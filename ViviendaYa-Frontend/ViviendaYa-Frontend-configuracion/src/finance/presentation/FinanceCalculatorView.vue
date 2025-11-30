<template>
  <div class="finance-page">
    <h1 class="title">Calculadora Financiera</h1>

    <div class="card">
      <form @submit.prevent="handleSubmit" class="form-grid">

        <div class="form-column">
          <div class="form-group">
            <label>Monto de Crédito</label>
            <div class="input-with-symbol">
              <input
                type="number"
                v-model.number="form.montoCredito"
                placeholder="Monto"
                min="0"
                required
              />
              <select v-model="form.moneda" class="currency-select">
                <option value="USD">$</option>
                <option value="PEN">S/</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label>Plazo (meses)</label>
            <input
              type="number"
              v-model.number="form.plazo"
              placeholder="Plazo (meses)"
              min="1"
              required
            />
          </div>

          <div class="form-group">
            <label>Tipo de Tasa</label>
            <select v-model="form.tipoTasa" required>
              <option disabled value="">Selecciona un tipo</option>
              <option value="Nominal">Nominal</option>
              <option value="Efectiva">Efectiva</option>
            </select>
          </div>

          <div class="form-group">
            <label>Tasa de Interés (%)</label>
            <div class="input-with-symbol right-symbol">
              <input
                type="number"
                v-model.number="form.tasaInteres"
                placeholder="Ej: 15.0"
                step="0.01"
                min="0"
                required
              />
              <span class="symbol-text">%</span>
            </div>
          </div>

          <div class="form-group">
            <label>Capitalización</label>
            <select 
                v-model="form.capitalizacion" 
                :disabled="form.tipoTasa === 'Efectiva'"
                required
            >
              <option disabled value="">Frecuencia</option>
              <option value="Mensual">Mensual</option>
              <option value="Bimestral">Bimestral</option>
              <option value="Trimestral">Trimestral</option>
              <option value="Semestral">Semestral</option>
              <option value="Anual">Anual</option>
            </select>
          </div>
        </div>

        <div class="form-column">
          <div class="form-group">
            <label>Tipo de Crédito</label>
            <select v-model="form.tipoCredito" required>
              <option disabled value="">Selecciona un tipo</option>
              <option value="MiVivienda">MiVivienda</option>
              <option value="TechoPropio">Techo Propio</option>
              <option value="Personal">Personal</option>
            </select>
          </div>

          <div class="form-group">
            <label>Periodo de Gracia</label>
            <select v-model="form.tipoGracia" required>
              <option value="Ninguno">Ninguno</option>
              <option value="Total">Total</option>
              <option value="Parcial">Parcial</option>
            </select>
          </div>

          <div class="form-group">
            <label>Meses de Gracia</label>
            <input
              type="number"
              v-model.number="form.mesesGracia"
              :disabled="form.tipoGracia === 'Ninguno'"
              min="0"
              placeholder="0"
            />
          </div>

          <div class="form-group toggle-group">
            <label>Aplicar Bono Techo Propio</label>
            <label class="switch">
              <input type="checkbox" v-model="form.aplicaBono" />
              <span class="slider round"></span>
            </label>
          </div>
        </div>
      </form>

      <div class="button-container">
        <button class="primary-btn" @click="handleSubmit">
            {{ finance.isLoading ? 'CALCULANDO...' : 'CALCULAR CRÉDITO' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from "vue";
import { useRouter } from "vue-router";
import { useFinanceStore } from "../application/finance.store.js"; // Asegúrate que la ruta sea correcta

const router = useRouter();
const finance = useFinanceStore();

// FORMULARIO REACTIVO (Ajustado para coincidir con el Service)
const form = reactive({
  montoCredito: 12000, // Nombre ajustado
  moneda: "PEN",
  plazo: 12,
  tasaInteres: null,   // CAMPO NUEVO
  tipoTasa: "Efectiva",
  capitalizacion: "Anual",
  tipoCredito: "TechoPropio",
  tipoGracia: "Ninguno",
  mesesGracia: 0,
  aplicaBono: true,    // Nombre ajustado
});

async function handleSubmit() {
  // 1. Validación básica
  if (!form.tasaInteres || form.tasaInteres <= 0) {
    alert("Por favor ingresa una Tasa de Interés válida.");
    return;
  }

  try {
    // 2. Llamada al Store (Esperamos con await)
    // NOTA: Asegúrate de que en tu store la acción se llame 'calculateCredit'
    await finance.calculateCredit(form); 
    
    // 3. Redirección (Solo ocurre si el cálculo fue exitoso)
    // Verifica que esta ruta exista en tu router/index.js
    router.push("/finance/results"); 
    
  } catch (error) {
    console.error("Error en el proceso:", error);
  }
}
</script>

<style scoped>
/* Estilos generales */
.finance-page {
  padding: 24px;
  min-height: 100vh;
  background: linear-gradient(135deg, #0d3b66, #1e5b99);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.title {
  color: #ffffff;
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 24px;
}

.card {
  background: #ffffff;
  border-radius: 18px;
  padding: 24px 32px 28px;
  max-width: 900px;
  width: 100%;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.12);
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px 32px;
}

.form-column, .form-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

label {
  font-size: 0.9rem;
  font-weight: 500;
  color: #333;
}

input, select {
  width: 100%;
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid #d0d7e2;
  outline: none;
  font-size: 0.9rem;
  background-color: #f9fafb;
}

input:focus, select:focus {
  border-color: #4ca3dd;
  box-shadow: 0 0 0 2px rgba(76, 163, 221, 0.25);
  background-color: #ffffff;
}

/* INPUTS CON SÍMBOLOS (Moneda a la izquierda, % a la derecha) */
.input-with-symbol {
  display: flex;
  gap: 8px;
  align-items: center;
}

.input-with-symbol input {
  flex: 1;
}

.currency-select {
  width: 70px;
  text-align: center;
}

.right-symbol {
    position: relative;
    gap: 0;
}
.symbol-text {
    background: #eef2f6;
    color: #555;
    padding: 0 12px;
    border: 1px solid #d0d7e2;
    border-left: none;
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
    display: flex;
    align-items: center;
    font-weight: bold;
    height: 100%; /* Para que coincida con el input */
}
/* Ajuste pequeño para que el input del % cuadre bien con el span */
.right-symbol input {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
}

/* Toggle Switch */
.toggle-group {
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}

.switch {
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
}
.switch input { display: none; }
.slider {
  position: absolute;
  cursor: pointer;
  inset: 0;
  background-color: #ccc;
  border-radius: 24px;
  transition: .4s;
}
.slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  border-radius: 50%;
  transition: .4s;
}
input:checked + .slider { background-color: #4ca3dd; }
input:checked + .slider:before { transform: translateX(20px); }

/* Botón */
.button-container {
  margin-top: 24px;
  display: flex;
  justify-content: center;
}

.primary-btn {
  background: #4ca3dd;
  color: white;
  border: none;
  border-radius: 10px;
  padding: 14px 40px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}
.primary-btn:hover { background: #3b8fc4; }

/* Responsive */
@media (max-width: 768px) {
  .form-grid { grid-template-columns: 1fr; }
}

input,
select,
textarea {
  color: #000 !important;         /* texto negro */
  background-color: #ffffff;      /* fondo blanco */
}

/* 🔹 Placeholder visible */
input::placeholder,
select::placeholder {
  color: #555 !important;         /* gris oscuro */
  opacity: 1 !important;
}

/* 🔹 Opciones del select (cuando despliegas la lista) */
option {
  color: #000 !important;         /* texto negro */
  background-color: #ffffff !important;
}


</style>