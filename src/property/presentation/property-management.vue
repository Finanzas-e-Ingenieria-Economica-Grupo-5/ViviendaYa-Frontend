<template>
  <div class="container">

    <!-- HEADER -->
    <div class="header">
      <h2>{{ t("property.title") }}</h2>
      <button class="btn btn-success" @click="openNew">{{ t("property.new") }}</button>
    </div>

    <!-- TABLE -->
    <div class="card">
      <table class="table">
        <thead>
        <tr>
          <th>{{ t("property.name") }}</th>
          <th>{{ t("property.price") }}</th>
          <th>{{ t("property.type.label") }}</th>
          <th>{{ t("property.area") }}</th>
          <th>{{ t("property.location") }}</th>
          <th>{{ t("property.actions") }}</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="property in store.properties" :key="property.id">
          <td>{{ property.name }}</td>
          <td>{{ property.price }}</td>
          <td>{{ t(`property.type.${property.type.toLowerCase()}`) }}</td>
          <td>{{ property.area }}</td>
          <td>{{ property.location }}</td>
          <td>
            <button class="btn btn-edit" @click="openEdit(property)">{{ t("property.edit") }}</button>
            <button class="btn btn-danger" @click="deleteProperty(property)">{{ t("property.delete") }}</button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <!-- FORM MODAL -->
    <div v-if="dialogVisible" class="modal-overlay">
      <div class="modal">
        <h3>{{ isEditing ? t("property.edit") : t("property.new") }}</h3>

        <div class="form-group">
          <label>{{ t("property.name") }}:</label>
          <input v-model="form.name" type="text" />
        </div>

        <div class="form-group">
          <label>{{ t("property.price") }}:</label>
          <input v-model="form.price" type="number" />
        </div>

        <div class="form-group">
          <label>{{ t("property.type.label") }}:</label>
          <select v-model="form.type">
            <option value="DEPARTMENT">{{ t("property.type.department") }}</option>
            <option value="HOUSE">{{ t("property.type.house") }}</option>
            <option value="LAND">{{ t("property.type.land") }}</option>
          </select>
        </div>

        <div class="form-group">
          <label>{{ t("property.area") }}:</label>
          <input v-model="form.area" type="number" />
        </div>

        <div class="form-group">
          <label>{{ t("property.location") }}:</label>
          <input v-model="form.location" type="text" />
        </div>

        <div class="modal-footer">
          <button class="btn btn-text" @click="dialogVisible = false">{{ t("property.cancel") }}</button>
          <button class="btn btn-success" @click="saveProperty">{{ t("property.save") }}</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import usePropertyStore from "../../property/application/property.store.js";
import { PropertyEntity } from "../domain/model/property.entity.js";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const store = usePropertyStore();

const dialogVisible = ref(false);
const isEditing = ref(false);
const form = ref(new PropertyEntity());

onMounted(() => {
  if (!store.loaded) store.fetchProperties();
});

const resetForm = () => {
  form.value = new PropertyEntity();
};

const openNew = () => {
  resetForm();
  isEditing.value = false;
  dialogVisible.value = true;
};

const openEdit = (property) => {
  form.value = new PropertyEntity({ ...property });
  isEditing.value = true;
  dialogVisible.value = true;
};

const saveProperty = async () => {
  if (isEditing.value) {
    await store.updateProperty(form.value);
  } else {
    await store.addProperty(form.value);
  }
  dialogVisible.value = false;
  resetForm();
};

const deleteProperty = async (property) => {
  await store.deleteProperty(property);
};
</script>

<style scoped>
.container {
  padding: 20px;
  font-family: Arial, sans-serif;
}

/* HEADER */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.header h2 {
  margin: 0;
}

/* BUTTONS */
.btn {
  padding: 6px 14px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-weight: 500;
  transition: 0.2s;
}
.btn:hover { opacity: 0.9; }
.btn-success { background-color: #4caf50; color: #fff; }
.btn-danger { background-color: #f44336; color: #fff; }
.btn-edit { background-color: #2196f3; color: #fff; margin-right: 4px; }
.btn-text { background-color: transparent; color: #555; }

/* CARD */
.card {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 6px rgba(0,0,0,0.1);
  padding: 15px;
  overflow-x: auto;
}

/* TABLE */
.table {
  width: 100%;
  border-collapse: collapse;
}
.table th, .table td {
  padding: 10px;
  text-align: left;
  border-bottom: 1px solid #eee;
}
.table th {
  background: #f5f5f5;
}

/* MODAL */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
  max-width: 90%;
  box-shadow: 0 3px 15px rgba(0,0,0,0.2);
}
.modal h3 {
  margin-top: 0;
  margin-bottom: 15px;
}

/* FORM */
.form-group {
  margin-bottom: 12px;
}
.form-group label {
  display: block;
  margin-bottom: 4px;
  font-weight: 500;
}
.form-group input, .form-group select {
  width: 100%;
  padding: 6px 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
}

/* MODAL FOOTER */
.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 15px;
}
</style>
