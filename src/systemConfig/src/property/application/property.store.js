import { defineStore } from "pinia";
import PropertyService from "../infrastructure/property.api.js";

export default defineStore("propertyStore", {
    state: () => ({
        properties: [],
        loaded: false,
    }),

    actions: {
        async fetchProperties() {
            if (this.loaded) return;
            this.properties = await PropertyService.getAll();
            this.loaded = true;
        },

        async addProperty(property) {
            const created = await PropertyService.create(property);
            this.properties.push(created);
        },

        async updateProperty(property) {
            const updated = await PropertyService.update(property);
            const index = this.properties.findIndex(p => p.id === updated.id);
            this.properties[index] = updated;
        },

        async deleteProperty(property) {
            await PropertyService.delete(property.id);
            this.properties = this.properties.filter(p => p.id !== property.id);
        }
    }
});
