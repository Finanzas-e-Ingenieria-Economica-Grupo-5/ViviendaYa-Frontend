<template>
  <div class="results-page">
    <h1 class="title">Resultados Financieros</h1>
    <p class="subtitle">Resumen de indicadores financieros y costos del crédito</p>

    <!-- Renderiza solo si la config y los indicadores están listos -->
    <div v-if="configLoaded && indicators && Object.keys(indicators).length" class="results-grid">

      <ResultCard
          icon="📅"
          label="Cuota Mensual"
          :value="formatMoney(indicators.cuotaMensual)"
      />

      <ResultCard
          icon="💰"
          label="Total Intereses"
          :value="formatMoney(indicators.totalInteres)"
      />

      <ResultCard
          icon="📉"
          label="Total Amortización"
          :value="formatMoney(indicators.totalAmortizacion)"
      />

      <ResultCard
          icon="💳"
          label="Costo Total (CTC)"
          :value="formatMoney(indicators.ctc)"
      />

      <ResultCard
          icon="📦"
          label="Valor Actual Neto (VAN)"
          :value="formatMoney(indicators.van)"
      />

      <ResultCard
          icon="📈"
          label="Tasa Interna de Retorno (TIR)"
          :value="indicators.tir ? indicators.tir.toFixed(2) + '%' : '0.00%'"
      />

      <ResultCard
          icon="🏦"
          label="Ahorro Bono Techo Propio"
          :value="formatMoney(indicators.ahorroBono || 0)"
      />

      <ResultCard
          icon="🏠"
          label="Bono Aplicado"
          :value="indicators.bonoAplicado ? 'Sí' : 'No'"
      />
    </div>

    <!-- Loading mientras no se cargan datos -->
    <div v-else class="loading-text">
      Cargando resultados...
    </div>

    <div class="button-row">
      <button class="btn-secondary" @click="goBack">Recalcular</button>
      <button class="btn-primary" @click="goSchedule">Ver Cronograma de Pagos</button>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useFinanceStore } from "../application/finance.store.js";
import { useSystemConfigStore } from "../../systemConfig/application/system-config.store.js";
import ResultCard from "./components/ResultCard.vue";

const router = useRouter();
const finance = useFinanceStore();
const configStore = useSystemConfigStore();

// Flag para saber si la config ya cargó
const configLoaded = ref(false);

// Indicadores calculados
const indicators = computed(() => finance.indicators || {});

// 🔹 Símbolo de moneda según Config
const currencySymbol = computed(() => {
  if (!configStore.config.currency) return "S/";
  // ✅ Maneja ambos formatos: "Soles"/"PEN" y "Dólares"/"USD"
  return (configStore.config.currency === "Soles" || configStore.config.currency === "PEN")
      ? "S/"
      : "$";
});
// 🔹 Función para formatear dinero con símbolo
function formatMoney(value) {
  if (value === undefined || value === null) return currencySymbol.value + " 0.00";
  return currencySymbol.value + " " + Number(value).toLocaleString("es-PE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

onMounted(async () => {
  // Cargar configuración primero
  await configStore.loadConfig();
  configLoaded.value = true;

  // Inicializar moneda en financeStore si no existe
  if (!finance.creditData) {
    finance.creditData = {
      moneda: configStore.config.currency === "Soles" ? "PEN" : "USD"
    };
  }
});

function goBack() {
  router.push("/finance/calculator");
}

function goSchedule() {
  router.push("/finance/schedule");
}
</script>

<style scoped>
.results-page {
  padding: 24px;
  min-height: 100vh;
  background: linear-gradient(135deg, #0d3b66, #1e5b99);
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 6px;
}

.subtitle {
  opacity: 0.8;
  margin-bottom: 30px;
}

.results-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  max-width: 1200px;
  width: 100%;
}

.loading-text {
  margin: 50px 0;
  font-size: 1.2rem;
  opacity: 0.9;
}

.button-row {
  display: flex;
  gap: 16px;
  margin-top: 40px;
}

.btn-primary,
.btn-secondary {
  padding: 14px 32px;
  border-radius: 10px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: 0.2s;
  font-size: 1rem;
}

.btn-primary {
  background: #4ca3dd;
  color: white;
  box-shadow: 0 4px 15px rgba(76, 163, 221, 0.4);
}

.btn-primary:hover {
  background: #3b8fc4;
  transform: translateY(-2px);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.15);
  color: white;
  backdrop-filter: blur(5px);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.25);
}

/* RESPONSIVE */
@media (max-width: 1024px) {
  .results-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .results-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .results-grid {
    grid-template-columns: 1fr;
  }
}
</style>
