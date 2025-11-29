<script setup>
import { reactive, ref, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import usePropertyStore from "../../property/application/property.store.js";
import {PropertyEntity} from "../domain/model/property.entity.js";
import {PropertyType} from "../domain/model/property-type.enum.js";

const { t } = useI18n();
const store = usePropertyStore();

const dialogVisible = ref(false);
const isEditing = ref(false);

// ⬅️ YA NO ES ref() — ES reactive()
const form = reactive(new PropertyEntity());

const propertyTypeOptions = [
  { label: t("property.type.department"), value: PropertyType.DEPARTMENT },
  { label: t("property.type.house"), value: PropertyType.HOUSE },
  { label: t("property.type.land"), value: PropertyType.LAND },
];

onMounted(() => {
  if (!store.loaded) store.fetchProperties();
});

const resetForm = () => {
  Object.assign(form, new PropertyEntity());
};

const openNew = () => {
  resetForm();
  isEditing.value = false;
  dialogVisible.value = true;
};

const openEdit = (property) => {
  Object.assign(form, property);
  isEditing.value = true;
  dialogVisible.value = true;
};

const saveProperty = () => {
  if (isEditing.value) store.updateProperty({ ...form });
  else store.addProperty({ ...form });

  dialogVisible.value = false;
};

const deleteProperty = (property) => {
  store.deleteProperty(property);
};
</script>

<template>
  <div class="p-5">

    <!-- TOOLBAR -->
    <pv-toolbar class="mb-4 custom-toolbar shadow-2">
      <template #start>
        <h2 class="title">{{ t("property.title") }}</h2>
      </template>

      <template #end>
        <pv-button
            label="Nuevo"
            icon="pi pi-plus"
            class="p-button-rounded p-button-success"
            @click="openNew"
        />
      </template>
    </pv-toolbar>

    <!-- TABLE -->
    <pv-card class="shadow-3 p-4">
      <pv-data-table
          :value="store.properties"
          stripedRows
          paginator
          :rows="10"
      >
        <pv-column field="name" :header="t('property.name')" />
        <pv-column field="price" :header="t('property.price')" />
        <pv-column field="type" :header="t('property.type')" />
        <pv-column field="area" :header="t('property.area')" />
        <pv-column field="location" :header="t('property.location')" />

        <pv-column header="Acciones" style="width: 150px">
          <template #body="{ data }">
            <pv-button icon="pi pi-pencil" text rounded @click="openEdit(data)" />
            <pv-button icon="pi pi-trash" text rounded severity="danger" @click="deleteProperty(data)" />
          </template>
        </pv-column>
      </pv-data-table>
    </pv-card>

    <!-- FORM DIALOG -->
    <pv-dialog
        v-model:visible="dialogVisible"
        modal
        :header="isEditing ? 'Editar Propiedad' : 'Registrar Propiedad'"
        class="dialog-custom"
        :style="{ width: '40rem' }"
    >

      <div class="form-grid">

        <pv-float-label>
          <pv-input-text id="name" v-model="form.name" class="w-full" />
          <label for="name">Nombre</label>
        </pv-float-label>

        <pv-float-label>
          <pv-input-number id="price" v-model="form.price" class="w-full" inputClass="w-full" />
          <label for="price">Precio</label>
        </pv-float-label>

        <pv-float-label>
          <pv-dropdown
              id="type"
              v-model="form.type"
              :options="propertyTypeOptions"
              optionLabel="label"
              optionValue="value"
              class="w-full"
          />
          <label for="type">Tipo</label>
        </pv-float-label>

        <pv-float-label>
          <pv-input-number id="area" v-model="form.area" class="w-full" inputClass="w-full" />
          <label for="area">Área (m²)</label>
        </pv-float-label>

        <pv-float-label class="form-item-full">
          <pv-input-text id="location" v-model="form.location" class="w-full" />
          <label for="location">Ubicación</label>
        </pv-float-label>

      </div>

      <template #footer>
        <pv-button label="Cancelar" class="p-button-text" @click="dialogVisible = false" />
        <pv-button label="Guardar" class="p-button-success" @click="saveProperty" />
      </template>

    </pv-dialog>

  </div>
</template>

<style scoped>
.title {
  font-weight: 700;
  font-size: 1.5rem;
}

.custom-toolbar {
  border-radius: 10px;
  background: var(--p-surface-0);
}

.dialog-custom {
  border-radius: 14px;
}

.form-grid {
  margin-top: 20px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 18px;
}

.form-item-full {
  grid-column: span 2;
}

/* Efecto mejorado para labels */
.p-float-label label {
  left: 12px;
  top: 14px;
  transition: all 0.15s ease;
}

.p-float-label input:focus ~ label,
.p-float-label input.p-filled ~ label,
.p-float-label .p-inputnumber-input:focus ~ label,
.p-float-label .p-inputnumber-input.p-filled ~ label,
.p-float-label .p-dropdown.p-inputwrapper-focus ~ label,
.p-float-label .p-dropdown.p-filled ~ label {
  top: -10px;
  font-size: 0.75rem;
  opacity: 0.95;
}
</style>
