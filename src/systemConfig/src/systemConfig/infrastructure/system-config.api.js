import { BaseApi } from "../../shared/infrastructure/base-api.js";

export class SystemConfigApi extends BaseApi {

    async getConfig() {
        // Primero intenta cargar de localStorage
        const local = localStorage.getItem('system-config');
        if (local) {
            return JSON.parse(local);
        }

        // Si no existe, devuelve configuración por defecto
        return {
            currency: "PEN",
            interestType: "NOMINAL",
            capitalization: "MENSUAL",
            gracePeriodMonths: 0,
            financialInstitutions: []
        };
    }

    async saveConfig(config) {
        // Guarda en localStorage (puedes cambiar por API real)
        localStorage.setItem('system-config', JSON.stringify(config));
        return config;
    }
}