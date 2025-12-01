<template>
  <div class="schedule-page">
    <div class="container">
      <h1 class="title">Amortization Schedule</h1>

      <div class="actions">
        <button class="btn-primary" @click="goBack">Recalculate</button>
        <button class="btn-secondary" @click="exportPDF">Exportar PDF</button>
        <button class="btn-secondary" @click="toggleExpand">
          {{ expanded ? "Colapsar" : "Expandir" }}
        </button>
      </div>

      <div class="card">
        <table>
          <thead>
            <tr>
              <th>Period</th>
              <th>Payment</th>
              <th>Interest</th>
              <th>Amortization</th>
              <th>Balance</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="row in schedule" :key="row.period">
              <td>{{ row.period }}</td>
              <td>{{ formatMoney(row.payment) }}</td>
              <td>{{ formatMoney(row.interest) }}</td>
              <td>{{ formatMoney(row.amortization) }}</td>
              <td>{{ formatMoney(row.balance) }}</td>
            </tr>
          </tbody>

          <tfoot>
            <tr class="totals">
              <td>Totals</td>
              <td>{{ formatMoney(totals.payment) }}</td>
              <td>{{ formatMoney(totals.interest) }}</td>
              <td>{{ formatMoney(totals.amortization) }}</td>
              <td>{{ formatMoney(totals.balance) }}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { useFinanceStore } from "../application/finance.store.js";

const router = useRouter();
const finance = useFinanceStore();
const expanded = ref(false);

// 🔥 La data REAL del cronograma viene del store
const schedule = finance.schedule;

// Volver a calcular
function goBack() {
  router.push("/finance/calculator");
}

// Exportar PDF (placeholder)
function exportPDF() {
  alert("Aquí luego conectamos jsPDF o html2pdf");
}

function toggleExpand() {
  expanded.value = !expanded.value;
}

// 🔥 Totalizadores automáticos
const totals = computed(() => {
  return {
    payment: sum("payment"),
    interest: sum("interest"),
    amortization: sum("amortization"),
    balance: schedule.length ? schedule[schedule.length - 1].balance : 0,
  };
});

function sum(field) {
  return schedule.reduce((acc, r) => acc + r[field], 0);
}

function formatMoney(n) {
  return n.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }) + " USD";
}
</script>

<style scoped>
.schedule-page {
  background: linear-gradient(135deg, #0d3b66, #1e5b99);
  min-height: 100vh;
  padding: 24px;
}

.container {
  max-width: 1000px;
  margin: auto;
}

.title {
  color: #ffffff;
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 20px;
  text-align: center;
}

.actions {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-bottom: 18px;
}

.btn-primary,
.btn-secondary {
  padding: 10px 20px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  font-weight: 600;
  transition: 0.2s;
}

.btn-primary {
  background: #4ca3dd;
  color: white;
}

.btn-primary:hover {
  background: #3b8fc4;
}

.btn-secondary {
  background: #ffffff33;
  color: white;
}

.btn-secondary:hover {
  background: #ffffff55;
}

.card {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(14px);
  padding: 24px;
  border-radius: 20px;
  overflow-x: auto;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

table {
  width: 100%;
  color: white;
  border-collapse: collapse;
  font-size: 0.95rem;
}

thead th {
  background: rgba(255, 255, 255, 0.18);
  padding: 12px;
  font-weight: 600;
}

tbody td {
  padding: 10px 12px;
  background: rgba(255, 255, 255, 0.1);
}

tbody tr:nth-child(even) td {
  background: rgba(255, 255, 255, 0.15);
}

tfoot td {
  padding: 12px;
  font-weight: 700;
  background: rgba(255, 255, 255, 0.18);
}
</style>
