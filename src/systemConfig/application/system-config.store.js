import { defineStore } from "pinia";
import { reactive } from "vue";

export const useSystemConfigStore = defineStore("systemConfig", () => {

    // CONFIG REACTIVA REAL
    const config = reactive({
        currency: "Soles",
        interestType: "Nominal",
        capitalization: "Annual",
        graceType: "Ninguno",
        gracePeriod: 0
    });

    // CARGAR CONFIG DE DB.JSON
    async function loadConfig() {
        try {
            const res = await fetch("http://localhost:3000/system-config/1");
            const data = await res.json();

            // copiar cada campo para mantener la reactividad
            config.currency = data.currency;
            config.interestType = data.interestType;
            config.capitalization = data.capitalization;
            config.graceType = data.graceType;
            config.gracePeriod = data.gracePeriod;
        } catch (e) {
            console.error("Error loading config:", e);
        }
    }

    // GUARDAR CAMBIOS EN DB.JSON
    async function updateConfig(newConfig) {
        try {
            const res = await fetch("http://localhost:3000/system-config/1", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newConfig)
            });

            const updated = await res.json();

            config.currency = updated.currency;
            config.interestType = updated.interestType;
            config.capitalization = updated.capitalization;
            config.graceType = updated.graceType;
            config.gracePeriod = updated.gracePeriod;

            return true;   // 👈 AGREGAR ESTO

        } catch (e) {
            console.error("Error updating config:", e);
            return false;  // 👈 IMPORTANTE
        }
    }

    return {
        config,
        loadConfig,
        updateConfig
    };
});
