<template>
  <div class="results-page">
    <h1 class="title">Financial Results</h1>
    <p class="subtitle">Resumen de indicadores financieros y costos del crédito</p>

    <div v-if="indicators" class="results-grid">

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
        :value="(indicators.tir ? indicators.tir.toFixed(2) : '0.00') + '%'"
      />

      <ResultCard
        icon="🏦"
        label="Ahorro Bono Techo Propio"
        :value="formatMoney(15000)" 
      />

      <ResultCard
        icon="🏠"
        label="Bono Aplicado"
        :value="'Sí'"
      />
    </div>

    <div class="button-row">
      <button class="btn-secondary" @click="goBack">Recalcular</button>
      <button class="btn-primary" @click="goSchedule">
        Ver Cronograma de Pagos
      </button>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { useFinanceStore } from "../application/finance.store.js";
import ResultCard from "./components/ResultCard.vue"; // Asegúrate de haber creado este archivo

const router = useRouter();
const finance = useFinanceStore();

// Usamos computed para que sea reactivo si cambia el store
// NOTA: Cambié 'results' por 'indicators' para coincidir con el store que creamos antes
const indicators = computed(() => finance.indicators);

// Seguridad: Si el usuario refresca la página y se pierden los datos, volver al inicio
onMounted(() => {
    // Si la cuota es 0 o undefined, significa que no se ha calculado nada
    if (!finance.indicators || !finance.indicators.cuotaMensual) {
        // Opcional: Descomenta esto si quieres que los redirija automáticamente
        // router.push("/finance/calculator");
    }
});

function goBack() {
  router.push("/finance/calculator");
}

function goSchedule() {
  router.push("/finance/schedule");
}

function formatMoney(n) {
  if (n === undefined || n === null) return "0.00";
  // Usamos una moneda genérica o podrías leer finance.formData.moneda
  return Number(n).toLocaleString("es-PE", {
    style: "currency",
    currency: "PEN", // O pon "USD" si prefieres
    minimumFractionDigits: 2
  });
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