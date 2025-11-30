import { defineStore } from 'pinia';
import { financeService } from '../domain/finance.service';

export const useFinanceStore = defineStore('finance', {
    state: () => ({
        // 1. Aquí guardamos los inputs del usuario (Monto, Tasa, Plazo...)
        creditData: null, 

        // 2. Aquí guardamos la Tabla generada
        schedule: [],            
        
        // 3. Aquí guardamos los Resultados (VAN, TIR, Cuota)
        indicators: {            
            van: 0,
            tir: 0,
            totalInteres: 0,
            totalAmortizacion: 0,
            cuotaMensual: 0,
            ctc: 0
        },
        
        isLoading: false,
        error: null
    }),

    actions: {
        async calculateCredit(formData) {
            this.isLoading = true;
            this.error = null;
            
            // GUARDAMOS LOS DATOS DE ENTRADA (Incluyendo la Tasa de Interés)
            this.creditData = formData; 

            try {
                const response = await financeService.calculate(formData);
                
                this.schedule = response.schedule;
                this.indicators = response.indicators;
                
            } catch (err) {
                console.error(err);
                this.error = "Error al calcular el crédito.";
            } finally {
                this.isLoading = false;
            }
        },

        reset() {
            this.schedule = [];
            this.creditData = null; // Limpiamos los inputs también
            this.indicators = {
                van: 0, tir: 0, totalInteres: 0, 
                totalAmortizacion: 0, cuotaMensual: 0, ctc: 0
            };
        }
    },

    getters: {
        hasResults: (state) => state.schedule.length > 0,
        // Getter útil para recuperar la tasa fácilmente en cualquier vista
        getTasaAplicada: (state) => state.creditData ? state.creditData.tasaInteres : 0
    }
});