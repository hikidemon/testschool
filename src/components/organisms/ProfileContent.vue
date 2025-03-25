<template>
  <div class="profile-container fade-in">
    <ProfileCard class="spotify-card" />
    <div class="profile-info-container">
      <ProfileInfo class="spotify-card pulse" />
      <div class="profile-actions">
        <AButton class="edit-button" @click="handleEdit">
          Редактировать профиль
        </AButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ProfileCard from '@/components/molecules/ProfileCard.vue'
import ProfileInfo from '@/components/molecules/ProfileInfo.vue'
import AButton from '@/components/atoms/AButton.vue'

const handleEdit = () => {
  // Add edit functionality
}
</script>

<style scoped lang="scss">
.profile-container {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 2rem;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.profile-info-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.profile-actions {
  display: flex;
  justify-content: flex-end;
  padding: 1rem;
}

.edit-button {
  background: var(--emerald-primary);
  border-radius: 500px;
  padding: 12px 24px;
  font-weight: 600;
  transition: all 0.3s ease;

  &:hover {
    background: var(--emerald-light);
    transform: scale(1.05);
  }
}
</style>