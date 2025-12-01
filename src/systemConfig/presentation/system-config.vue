<template>
  <div class="system-config-container">
    <div class="config-header">
      <h2>{{ t('systemConfig.title') }}</h2>
      <p>{{ t('systemConfig.subtitle') }}</p>
    </div>

    <div class="config-content">
      <div v-if="!isEditing" class="config-view">
        <div class="config-table">
          <div class="table-header">
            <div class="table-cell">{{ t('systemConfig.currency') }}</div>
            <div class="table-cell">{{ t('systemConfig.interestType') }}</div>
            <div class="table-cell">{{ t('systemConfig.capitalization') }}</div>
            <div class="table-cell">{{ t('systemConfig.gracePeriod') }}</div>
            <div class="table-cell">{{ t('systemConfig.actions') }}</div>
          </div>
          <div class="table-row">
            <div class="table-cell">{{ getCurrencyLabel(localConfig.currency) }}</div>
            <div class="table-cell">{{ getInterestTypeLabel(localConfig.interestType) }}</div>
            <div class="table-cell">{{ getCapitalizationLabel(localConfig.capitalization) }}</div>
            <div class="table-cell">{{ localConfig.gracePeriodMonths }}</div>
            <div class="table-cell">
              <pv-button
                  :label="t('systemConfig.edit')"
                  icon="pi pi-pencil"
                  @click="startEditing"
                  class="edit-btn"
              />
            </div>
          </div>
        </div>

        <!-- Resumen -->
        <div class="config-summary">
          <h4>{{ t('systemConfig.summary') }}</h4>
          <div class="summary-content">
            <div class="summary-item">
              <strong>{{ t('systemConfig.currency') }}:</strong> {{ getCurrencyLabel(localConfig.currency) }}
            </div>
            <div class="summary-item">
              <strong>{{ t('systemConfig.interestType') }}:</strong> {{ getInterestTypeLabel(localConfig.interestType) }}
            </div>
            <div class="summary-item">
              <strong>{{ t('systemConfig.capitalization') }}:</strong> {{ getCapitalizationLabel(localConfig.capitalization) }}
            </div>
            <div class="summary-item">
              <strong>{{ t('systemConfig.gracePeriod') }}:</strong> {{ localConfig.gracePeriodMonths }} {{ t('systemConfig.months') }}
            </div>
          </div>
        </div>
      </div>

      <!-- Vista de edición -->
      <div v-else class="config-edit">
        <div class="edit-grid">
          <!-- Moneda -->
          <div class="edit-field">
            <label>{{ t('systemConfig.currency') }}</label>
            <pv-select
                v-model="localConfig.currency"
                :options="currencyOptions"
                optionLabel="label"
                optionValue="value"
                class="edit-input"
            />
          </div>

          <!-- Tipo de Tasa -->
          <div class="edit-field">
            <label>{{ t('systemConfig.interestType') }}</label>
            <pv-select
                v-model="localConfig.interestType"
                :options="interestOptions"
                optionLabel="label"
                optionValue="value"
                class="edit-input"
            />
          </div>

          <!-- Capitalización -->
          <div class="edit-field">
            <label>{{ t('systemConfig.capitalization') }}</label>
            <pv-select
                v-model="localConfig.capitalization"
                :options="capitalizationOptions"
                optionLabel="label"
                optionValue="value"
                class="edit-input"
            />
          </div>

          <!-- Plazo de Gracia -->
          <div class="edit-field">
            <label>{{ t('systemConfig.gracePeriod') }}</label>
            <pv-input-number
                v-model="localConfig.gracePeriodMonths"
                :min="0"
                :max="36"
                class="edit-input"
            />
          </div>
        </div>

        <!-- Botones de edición -->
        <div class="edit-actions">
          <pv-button
              :label="t('systemConfig.save')"
              @click="save"
              :loading="store.loading"
              icon="pi pi-save"
              class="save-btn"
          />
          <pv-button
              :label="t('systemConfig.cancel')"
              severity="secondary"
              @click="cancelEditing"
              icon="pi pi-times"
              class="cancel-btn"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useSystemConfigStore } from '../application/system-config.store.js';
import { SystemConfigEntity } from '../domain/system-config.entity.js';
import { Currency, InterestType, CapitalizationType } from '../domain/enums.js';

const { t } = useI18n();
const store = useSystemConfigStore();
const localConfig = ref(new SystemConfigEntity());
const isEditing = ref(false);
const originalConfig = ref(new SystemConfigEntity());

const currencyOptions = computed(() => [
  { label: t('systemConfig.currencyOptions.soles'), value: Currency.SOLES },
  { label: t('systemConfig.currencyOptions.dollars'), value: Currency.DOLARES }
]);

const interestOptions = computed(() => [
  { label: t('systemConfig.interestOptions.nominal'), value: InterestType.NOMINAL },
  { label: t('systemConfig.interestOptions.effective'), value: InterestType.ELECTIVA }
]);

const capitalizationOptions = computed(() => [
  { label: t('systemConfig.capitalizationOptions.monthly'), value: CapitalizationType.MENSUAL },
  { label: t('systemConfig.capitalizationOptions.bimonthly'), value: CapitalizationType.BIMESTRAL },
  { label: t('systemConfig.capitalizationOptions.quarterly'), value: CapitalizationType.TRIMESTRAL },
  { label: t('systemConfig.capitalizationOptions.semiannual'), value: CapitalizationType.SEMESTRAL },
  { label: t('systemConfig.capitalizationOptions.annual'), value: CapitalizationType.ANUAL }
]);

// Funciones para mostrar labels
const getCurrencyLabel = (currency) => {
  return currencyOptions.value.find(opt => opt.value === currency)?.label || currency;
};

const getInterestTypeLabel = (type) => {
  return interestOptions.value.find(opt => opt.value === type)?.label || type;
};

const getCapitalizationLabel = (cap) => {
  return capitalizationOptions.value.find(opt => opt.value === cap)?.label || cap;
};

onMounted(async () => {
  await store.loadConfig();
  localConfig.value = new SystemConfigEntity({ ...store.config });
  originalConfig.value = new SystemConfigEntity({ ...store.config });
});

const startEditing = () => {
  isEditing.value = true;
  originalConfig.value = new SystemConfigEntity({ ...localConfig.value });
};

const cancelEditing = () => {
  isEditing.value = false;
  localConfig.value = new SystemConfigEntity({ ...originalConfig.value });
};

const save = async () => {
  const payload = {
    currency: localConfig.value.currency,
    interestType: localConfig.value.interestType,
    capitalization: localConfig.value.capitalization,
    gracePeriod: localConfig.value.gracePeriodMonths,
    graceType: localConfig.value.graceType ?? "Ninguno"
  };

  const success = await store.updateConfig(payload);

  if (success) {
    isEditing.value = false;
    originalConfig.value = new SystemConfigEntity({ ...payload });
  }
};

</script>

<style scoped>
.system-config-container {
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
  min-height: 100vh;
  color: white;
  padding: 2rem;
}

.config-header {
  text-align: center;
  margin-bottom: 2rem;
}

.config-header h2 {
  color: white;
  font-size: 2rem;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.config-header p {
  color: #e0e0e0;
  font-size: 1.1rem;
}

.config-content {
  max-width: 1200px;
  margin: 0 auto;
}

/* Estilos para la tabla */
.config-table {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.table-header {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 120px;
  background: rgba(255, 255, 255, 0.2);
  font-weight: 600;
}

.table-row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 120px;
}

.table-cell {
  padding: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
}

.table-header .table-cell {
  border-bottom: none;
}

.config-summary {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 1.5rem;
  backdrop-filter: blur(10px);
}

.config-summary h4 {
  color: white;
  margin-bottom: 1rem;
  font-size: 1.3rem;
  text-align: center;
}

.summary-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.summary-item {
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  text-align: center;
}

/* Edición */
.edit-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.edit-field {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.edit-field label {
  color: white;
  font-weight: 600;
  font-size: 1rem;
}

.edit-input {
  width: 100%;
}

/* Botones */
.edit-btn {
  background: linear-gradient(45deg, #2196F3, #1976D2);
  border: none;
  padding: 0.5rem 1rem;
  font-weight: 600;
}

.edit-btn:hover {
  background: linear-gradient(45deg, #1976D2, #2196F3);
}

.edit-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.save-btn {
  background: linear-gradient(45deg, #4CAF50, #45a049);
  border: none;
  padding: 0.75rem 2rem;
  font-weight: 600;
}

.save-btn:hover {
  background: linear-gradient(45deg, #45a049, #4CAF50);
}

.cancel-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 0.75rem 2rem;
}

.cancel-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

:deep(.p-dropdown) {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
}

:deep(.p-dropdown .p-dropdown-label) {
  color: white;
}

:deep(.p-dropdown .p-dropdown-trigger) {
  color: white;
}

:deep(.p-inputnumber .p-inputnumber-input) {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  color: white;
}

:deep(.p-inputnumber .p-inputnumber-input::placeholder) {
  color: rgba(255, 255, 255, 0.6);
}

/* Responsive */
@media (max-width: 768px) {
  .system-config-container {
    padding: 1rem;
  }

  .table-header,
  .table-row {
    grid-template-columns: 1fr;
  }

  .edit-grid {
    grid-template-columns: 1fr;
  }

  .summary-content {
    grid-template-columns: 1fr;
  }

  .edit-actions {
    flex-direction: column;
  }

  .save-btn,
  .cancel-btn {
    width: 100%;
  }
}
</style>