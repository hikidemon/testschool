
<template>
  <div class="profile-info">
    <h3 class="info-title">Личная информация</h3>
    <div class="info-grid">
      <InfoItem label="Email" :value="currentUser?.email" icon="mail" />
      <InfoItem label="Телефон" :value="currentUser?.phone" icon="phone" />
      <InfoItem label="Школа" :value="currentUser?.school" icon="school" />
      <InfoItem label="Класс" :value="currentUser?.class" icon="class" />
      <InfoItem label="Адрес" :value="currentUser?.address" icon="location" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUser } from '@/common/composables/useUser'
import InfoItem from '@/components/molecules/InfoItem.vue'

const { currentUser } = useUser()
</script>

<style scoped lang="scss">
.profile-info {
  padding: 2rem;
  background: var(--surface-light);
  border-radius: 16px;
  transition: all 0.3s ease;

  &:hover {
    background: var(--surface-darker);
  }
}

.info-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 1.5rem;
  color: var(--text-light);
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}
</style>
