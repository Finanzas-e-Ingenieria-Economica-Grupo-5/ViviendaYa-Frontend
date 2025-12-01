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

            // 1️⃣ Obtener configuración del sistema
            const configStore = useSystemConfigStore();

            if (!configStore.config.id) {
                console.log("🔄 Cargando configuración...");
                await configStore.loadConfig();
            }

            const config = configStore.config;

            // 2️⃣ Preparar datos finales (NADIE puede sobreescribir estos)
            const finalData = {
                ...formData,
                moneda: config.currency === "Soles" ? "PEN" : "USD",
                tipoTasa: config.interestType,
                capitalizacion: config.capitalization,
                tipoGracia: config.graceType ?? "Sin gracia",
                mesesGracia: config.gracePeriod
            };

            console.log("📌 DATOS FINALES USADOS EN EL CÁLCULO:", finalData);

            this.creditData = finalData;

            try {
                // 3️⃣ Calcular crédito
                const response = await financeService.calculate(finalData);

                this.schedule = response.schedule;
                this.indicators = response.indicators;

                // 4️⃣ Guardar resultado completo en DB JSON
                const saved = await financeApi.saveFinanceResult({
                    fecha: new Date().toISOString(),
                    parametrosUsados: finalData,
                    resultado: response
                });

                console.log("💾 Guardado en db.json:", saved);

                this.history.push(saved);

            } catch (err) {
                console.error("❌ Error:", err);
                this.error = "Error al calcular el crédito.";
            } finally {
                this.isLoading = false;
            }
        },

        async loadHistory() {
            try {
                this.history = await financeApi.getAll();
            } catch (err) {
                console.error("❌ Error cargando historial:", err);
            }
        },

        reset() {
            this.schedule = [];
            this.creditData = null;
            this.indicators = {
                van: 0,
                tir: 0,
                totalInteres: 0,
                totalAmortizacion: 0,
                cuotaMensual: 0,
                ctc: 0
            };
        }
    },

    getters: {
        hasResults: (state) => state.schedule.length > 0,
        getTasaAplicada: (state) =>
            state.creditData?.tasaInteres ?? 0
    }
});
