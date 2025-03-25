<template>
  <div class="teachers-list">
    <teacher-card v-for="userId in userIds" :key="userId" :userId="userId" class="post-card" />
  </div>
</template>

<script setup lang="ts">
import TeacherCard from '../molecules/TeacherCard.vue'
import { onMounted } from 'vue'

defineProps<{
  userIds: string[]
}>()

onMounted(() => {})
</script>

<style scoped lang="scss">
.teachers-list {
  display: grid;
  grid-template-columns: repeat((3, 1fr));
  gap: 20px;
  padding-right: 10px;
}
.post-card {
  opacity: 0;
  transform: translateY(20px);
  transition:
    opacity 0.5s ease-out,
    transform 0.5s ease-out;
}

.post-card.fade-in-visible {
  opacity: 1;
  transform: translateY(0);
}
</style>
