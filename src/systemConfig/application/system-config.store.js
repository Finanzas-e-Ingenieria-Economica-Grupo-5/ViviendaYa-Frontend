import { defineStore } from "pinia";
import { reactive } from "vue";

export const useSystemConfigStore = defineStore("systemConfig", () => {

    // CONFIG REACTIVA
    const config = reactive({
        currency: "Soles",
        interestType: "Nominal",
        capitalization: "Annual",
        graceType: "Ninguno",
        gracePeriod: 0
    });

    const API_URL = "https://fakeapi-vivendaya.onrender.com"; // ✅ apunta a tu fake API

    // CARGAR CONFIG DE DB.JSON
    async function loadConfig() {
        try {
            const res = await fetch(`${API_URL}/system-config/1`);
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            const data = await res.json();

            // mantener reactividad
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
            const res = await fetch(`${API_URL}/system-config/1`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newConfig)
            });
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            const updated = await res.json();

            config.currency = updated.currency;
            config.interestType = updated.interestType;
            config.capitalization = updated.capitalization;
            config.graceType = updated.graceType;
            config.gracePeriod = updated.gracePeriod;

            return true;
        } catch (e) {
            console.error("Error updating config:", e);
            return false;
        }
    }

    return {
        config,
        loadConfig,
        updateConfig
    };
});
