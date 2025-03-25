<template>
  <div class="profile-card">
    <div class="profile-image-container">
      <AImage
        :src="userImage || '/default-avatar.png'"
        alt="Profile"
        class="profile-image"
      />
      <div class="image-overlay">
        <label for="image-upload" class="upload-button">
          <i class="fas fa-camera"></i>
        </label>
        <input
          id="image-upload"
          type="file"
          accept="image/*"
          @change="handleImageUpload"
          class="hidden"
        />
      </div>
    </div>
    <h2 class="profile-name">{{ fullName }}</h2>
    <p class="profile-role">{{ role }}</p>
    <div class="profile-stats">
      <div class="stat-item">
        <span class="stat-value">{{ groupsCount }}</span>
        <span class="stat-label">Группы</span>
      </div>
      <div class="stat-item">
        <span class="stat-value">{{ eventsCount }}</span>
        <span class="stat-label">События</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useUser } from '@/common/composables/useUser'

const { currentUser } = useUser()

const fullName = computed(() => 
  currentUser.value ? `${currentUser.value.name} ${currentUser.value.surname}` : 'Пользователь'
)

const role = computed(() => currentUser.value?.role || 'Студент')
const groupsCount = computed(() => currentUser.value?.groups?.length || 0)
const eventsCount = ref(0) 

const handleImageUpload = (event: Event) => {
  // Implement image upload logic
}
</script>

<style scoped lang="scss">
.profile-card {
  padding: 2rem;
  text-align: center;
  background: var(--surface-light);
  border-radius: 16px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  }
}

.profile-image-container {
  position: relative;
  width: 150px;
  height: 150px;
  margin: 0 auto 1.5rem;
  border-radius: 50%;
  overflow: hidden;

  &:hover .image-overlay {
    opacity: 1;
  }
}

.profile-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.upload-button {
  color: white;
  cursor: pointer;
  font-size: 1.5rem;
}

.hidden {
  display: none;
}

.profile-name {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  color: var(--text-light);
}

.profile-role {
  color: var(--text-gray);
  margin: 0.5rem 0 1.5rem;
}

.profile-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--surface-darker);
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.stat-value {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--emerald-primary);
}

.stat-label {
  font-size: 0.875rem;
  color: var(--text-gray);
}
</style>