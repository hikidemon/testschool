<template>
  <div class="info-item">
    <div class="info-icon">
      <i :class="'fas fa-' + icon"></i>
    </div>
    <div class="info-content">
      <span class="info-label">{{ label }}</span>
      <span class="info-value">{{ value || 'Не указано' }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label: string
  value?: string
  icon: string
}>()
</script>

<style scoped lang="scss">
.info-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-radius: 8px;
  background: var(--surface-darker);
  transition: all 0.3s ease;

  &:hover {
    transform: translateX(4px);
    background: var(--surface-dark);
  }
}

.info-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: var(--emerald-primary);
  color: var(--text-light);
}

.info-content {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.info-label {
  font-size: 0.875rem;
  color: var(--text-gray);
}

.info-value {
  font-size: 1rem;
  color: var(--text-light);
}
</style>