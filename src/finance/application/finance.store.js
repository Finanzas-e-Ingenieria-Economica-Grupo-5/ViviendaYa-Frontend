import { defineStore } from 'pinia';
import { financeService } from '../domain/finance.service';
import { financeApi } from '../infrastructure/finance.api';
import { useSystemConfigStore } from '../../systemConfig/application/system-config.store.js';

export const useFinanceStore = defineStore('finance', {
    state: () => ({
        creditData: null,

        schedule: [],

        indicators: {
            van: 0,
            tir: 0,
            totalInteres: 0,
            totalAmortizacion: 0,
            cuotaMensual: 0,
            ctc: 0
        },

        history: [],

        isLoading: false,
        error: null
    }),

    actions: {
        async calculateCredit(formData) {
            this.isLoading = true;
            this.error = null;

            // 1️⃣ LEER CONFIGURACIÓN DEL SISTEMA
            const configStore = useSystemConfigStore();
            await configStore.loadConfig();

            // Aquí obtenemos los valores configurados
            const tasaConfig   = configStore.config.interestType;
            const monedaConfig = configStore.config.currency;
            const capConfig    = configStore.config.capitalization;

            console.log("📌 CONFIG USADA EN FINANCE:", {
                tasaConfig, monedaConfig, capConfig
            });

            // 2️⃣ Mezclar formData usando la config real
            const finalData = {
                ...formData,
                moneda: monedaConfig,
                tipoTasa: tasaConfig,
                capitalizacion: capConfig
            };

            // Guardamos inputs usados realmente
            this.creditData = finalData;

            try {
                // 3️⃣ Cálculo con datos + configuración
                const response = await financeService.calculate(finalData);

                this.schedule = response.schedule;
                this.indicators = response.indicators;

                // 4️⃣ Guardar en JSON Server
                const saved = await financeApi.saveFinanceResult({
                    fecha: new Date().toISOString(),
                    config: finalData,
                    resultado: response
                });

                // 5️⃣ Guardar en historial local
                this.history.push(saved);

            } catch (err) {
                console.error(err);
                this.error = "Error al calcular el crédito.";
            } finally {
                this.isLoading = false;
            }
        },

        async loadHistory() {
            try {
                const data = await financeApi.getAll();
                this.history = data;
            } catch (err) {
                console.error(err);
            }
        },

        reset() {
            this.schedule = [];
            this.creditData = null;
            this.indicators = {
                van: 0, tir: 0, totalInteres: 0,
                totalAmortizacion: 0, cuotaMensual: 0, ctc: 0
            };
        }
    },

    getters: {
        hasResults: (state) => state.schedule.length > 0,
        getTasaAplicada: (state) =>
            state.creditData ? state.creditData.tasaInteres : 0
    }
});
