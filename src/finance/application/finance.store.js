import { defineStore } from 'pinia';
import { useSystemConfigStore } from '../../systemConfig/application/system-config.store.js';
import { financeService } from '../domain/finance.service.js'; // 👈 IMPORTAR
import { watchEffect } from 'vue';

export const useFinanceStore = defineStore('finance', {
    state: () => ({
        creditData: null,
        schedule: [],
        indicators: { van:0, tir:0, totalInteres:0, totalAmortizacion:0, cuotaMensual:0, ctc:0 },
        history: [],
        isLoading: false,
        error: null
    }),

    actions: {
        async calculateCredit(formData) {
            this.isLoading = true;
            this.error = null;

            const configStore = useSystemConfigStore();
            if (!configStore.config.id) await configStore.loadConfig();

            this.creditData = {
                ...formData,
                moneda: configStore.config.currency === 'Soles' ? 'PEN' : 'USD',
                tipoTasa: configStore.config.interestType,
                capitalizacion: configStore.config.capitalization,
                tipoGracia: configStore.config.graceType ?? 'Sin gracia',
                mesesGracia: configStore.config.gracePeriod
            };

            try {
                // 🔥 USAR EL SERVICIO REAL
                const response = await financeService.calculate(this.creditData);

                this.schedule = response.schedule;
                this.indicators = response.indicators;

                const saved = await this.saveFinanceResult({
                    fecha: new Date().toISOString(),
                    parametrosUsados: this.creditData,
                    resultado: response
                });

                this.history.push(saved);

            } catch (err) {
                console.error(err);
                this.error = 'Error al calcular crédito';
            } finally {
                this.isLoading = false;
            }
        },

        // 🗑️ ELIMINAR fakeCalculation() completamente

        async saveFinanceResult(data) {
            const res = await fetch("https://fakeapi-vivendaya.onrender.com/finance", {
                method:"POST",
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify(data)
            });
            return await res.json();
        }
    }
});