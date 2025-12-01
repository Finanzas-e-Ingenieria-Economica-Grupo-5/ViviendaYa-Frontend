<script setup>
import { ref, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import useCustomerStore from "../../application/customer.store.js";
import { CustomerEntity } from "../../domain/model/customer.entity.js";

const { t } = useI18n();

const store = useCustomerStore();
const dialogVisible = ref(false);
const isEditing = ref(false);
const form = ref(new CustomerEntity());

// Load customers on mount
onMounted(() => {
  if (!store.customersLoaded) store.fetchCustomers();
});

// Open "Create" dialog
const openNew = () => {
  form.value = new CustomerEntity();
  isEditing.value = false;
  dialogVisible.value = true;
};

// Open "Edit" dialog
const openEdit = (customer) => {
  form.value = new CustomerEntity({ ...customer });
  isEditing.value = true;
  dialogVisible.value = true;
};

// Save create/update
const saveCustomer = () => {
  if (isEditing.value) {
    store.updateCustomer(form.value);
  } else {
    store.addCustomer(form.value);
  }
  dialogVisible.value = false;
};

// Delete
const deleteCustomer = (customer) => {
  store.deleteCustomer(customer);
};
</script>

<template>
  <div class="p-4">
    <!-- HEADER -->
    <pv-toolbar class="mb-4">
      <template #start>
        <h2 class="m-0">{{ t("customer.title") }}</h2>
      </template>
      <template #end>
        <pv-button
            :label="t('customer.new')"
            icon="pi pi-plus"
            @click="openNew"
        />
      </template>
    </pv-toolbar>

    <!-- TABLE -->
    <pv-data-table
        :value="store.customers"
        dataKey="id"
        stripedRows
        paginator
        :rows="10"
    >
      <pv-column field="id" header="ID" style="width: 80px" />
      <pv-column field="firstName" :header="t('customer.firstName')" />
      <pv-column field="lastName" :header="t('customer.lastName')" />
      <pv-column field="email" :header="t('customer.email')" />
      <pv-column field="phone" :header="t('customer.phone')" />
      <pv-column field="segment" :header="t('customer.segment')" />

      <pv-column :header="t('customer.actions')" style="width: 140px">
        <template #body="{ data }">
          <pv-button
              icon="pi pi-pencil"
              text
              rounded
              @click="openEdit(data)"
          />
          <pv-button
              icon="pi pi-trash"
              text
              rounded
              severity="danger"
              @click="deleteCustomer(data)"
          />
        </template>
      </pv-column>
    </pv-data-table>

    <!-- DIALOG -->
    <pv-dialog
        v-model:visible="dialogVisible"
        modal
        :header="isEditing ? t('customer.edit') : t('customer.new')"
        :style="{ width: '600px' }"
    >
      <!-- FORM -->
      <div class="form-grid">

        <!-- First Name -->
        <div class="form-item">
          <pv-float-label>
            <pv-input-text id="firstName" v-model="form.firstName" class="w-full" />
            <label for="firstName">{{ t("customer.firstName") }}</label>
          </pv-float-label>
        </div>

        <!-- Last Name -->
        <div class="form-item">
          <pv-float-label>
            <pv-input-text id="lastName" v-model="form.lastName" class="w-full" />
            <label for="lastName">{{ t("customer.lastName") }}</label>
          </pv-float-label>
        </div>

        <!-- Email -->
        <div class="form-item-full">
          <pv-float-label>
            <pv-input-text id="email" v-model="form.email" class="w-full" />
            <label for="email">{{ t("customer.email") }}</label>
          </pv-float-label>
        </div>

        <!-- Phone -->
        <div class="form-item">
          <pv-float-label>
            <pv-input-text id="phone" v-model="form.phone" class="w-full" />
            <label for="phone">{{ t("customer.phone") }}</label>
          </pv-float-label>
        </div>

        <!-- Income -->
        <div class="form-item">
          <pv-float-label>
            <pv-input-number id="income" v-model="form.income" inputClass="w-full" class="w-full" />
            <label for="income">{{ t("customer.income") }}</label>
          </pv-float-label>
        </div>

        <!-- Dependents -->
        <div class="form-item">
          <pv-float-label>
            <pv-input-number id="dependents" v-model="form.dependents" inputClass="w-full" class="w-full" />
            <label for="dependents">{{ t("customer.dependents") }}</label>
          </pv-float-label>
        </div>

        <!-- Employment Status -->
        <div class="form-item">
          <pv-float-label>
            <pv-input-text id="employmentStatus" v-model="form.employmentStatus" class="w-full" />
            <label for="employmentStatus">{{ t("customer.employmentStatus") }}</label>
          </pv-float-label>
        </div>

        <!-- Marital Status -->
        <div class="form-item">
          <pv-float-label>
            <pv-input-text id="maritalStatus" v-model="form.maritalStatus" class="w-full" />
            <label for="maritalStatus">{{ t("customer.maritalStatus") }}</label>
          </pv-float-label>
        </div>

        <!-- Segment -->
        <div class="form-item-full">
          <pv-float-label>
            <pv-input-text id="segment" v-model="form.segment" class="w-full" />
            <label for="segment">{{ t("customer.segment") }}</label>
          </pv-float-label>
        </div>

      </div>

      <!-- BUTTONS -->
      <template #footer>
        <pv-button label="Cancel" text @click="dialogVisible = false" />
        <pv-button label="Save" @click="saveCustomer" />
      </template>
    </pv-dialog>
  </div>
</template>

<style scoped>

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px; /* separación uniforme */
}

.form-item,
.form-item-full {
  width: 100%;
}

.form-item-full {
  grid-column: span 2;
}

.p-float-label > label {
  left: 12px !important; /* alineación perfecta */
  top: 14px !important;  /* label empieza DENTRO del input */
  transition: all 0.15s ease;
}

/* cuando el input está enfocado o lleno → label flota arriba */
.p-float-label input:focus ~ label,
.p-float-label input.p-filled ~ label,
.p-float-label .p-inputnumber-input:focus ~ label,
.p-float-label .p-inputnumber-input.p-filled ~ label {
  top: -10px !important;
  left: 10px !important;
  font-size: 0.75rem;
  opacity: 0.8;
}

/* Responsivo */
@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
  .form-item-full {
    grid-column: span 1;
  }
}


</style>
