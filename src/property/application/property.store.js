import { defineStore } from "pinia";
import { ref } from "vue";
import PropertyApi from "../infrastructure/property.api.js";
import { PropertyEntity } from "../domain/model/property.entity.js";

const usePropertyStore = defineStore("property", () => {

    const properties = ref([]);
    const loaded = ref(false);

    async function fetchProperties() {
        const list = await PropertyApi.getAll();
        properties.value = list.map(p => new PropertyEntity(p));
        loaded.value = true;
    }

    async function addProperty(property) {
        const created = await PropertyApi.create(property);
        properties.value.push(new PropertyEntity(created));
        return created;
    }

    async function updateProperty(property) {
        const updated = await PropertyApi.update(property);

        const index = properties.value.findIndex(p => p.id === updated.id);
        if (index !== -1) {
            properties.value[index] = new PropertyEntity(updated);
        }

        return updated;
    }

    async function deleteProperty(property) {
        await PropertyApi.delete(property.id);
        properties.value = properties.value.filter(p => p.id !== property.id);
    }

    return {
        properties,
        loaded,
        fetchProperties,
        addProperty,
        updateProperty,
        deleteProperty
    };
});

export default usePropertyStore;
