<template>
  <div class="card">
    <div class="icon">{{ icon }}</div>
    <div class="label">{{ label }}</div>
    <div class="value">{{ value }}</div>
  </div>
</template>

<script setup>
defineProps({
  icon: String,
  label: String,
  value: String,
});
</script>

<style scoped>
.card {
  background: #ffffff;
  color: #1e2a3a;
  padding: 22px;
  border-radius: 14px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  box-shadow: 0 6px 20px rgba(0,0,0,0.12);
}

.icon {
  font-size: 2rem;
  margin-bottom: 8px;
}

.label {
  font-size: 0.85rem;
  opacity: 0.65;
  font-weight: 500;
}

.value {
  font-size: 1.3rem;
  font-weight: 700;
}
</style>
