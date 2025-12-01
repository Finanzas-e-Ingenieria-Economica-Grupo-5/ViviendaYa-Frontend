import { defineStore } from "pinia";
import { ref } from "vue";
import { SystemConfigApi } from "../infrastructure/system-config.api.js";
import { SystemConfigEntity } from "../domain/system-config.entity.js";

const api = new SystemConfigApi();

export const useSystemConfigStore = defineStore("systemConfig", () => {
    const config = ref(new SystemConfigEntity());
    const loading = ref(false);

    async function loadConfig() {
        loading.value = true;
        try {
            const data = await api.getConfig();
            config.value = new SystemConfigEntity(data);
        } catch (error) {
            console.error('Error loading config:', error);
        } finally {
            loading.value = false;
        }
    }

    async function saveConfig(newConfig) {
        loading.value = true;
        try {
            const saved = await api.saveConfig(newConfig);
            config.value = new SystemConfigEntity(saved);
            return true;
        } catch (error) {
            console.error('Error saving config:', error);
            return false;
        } finally {
            loading.value = false;
        }
    }

    return {
        config,
        loading,
        loadConfig,
        saveConfig
    };
});