
<template>
  <div class="program-card neumorphic">
    <h3 class="emerald-gradient-text">{{ title }}</h3>
    <p class="description">{{ description }}</p>
    <div class="details">
      <span><i class="el-icon-time"></i> {{ duration }}</span>
      <span><i class="el-icon-user"></i> {{ teacher }}</span>
    </div>
    <el-button type="success" @click="$emit('enroll')">Записаться</el-button>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: 'AtomProgramCard'
})
defineProps<{
  title: string
  description: string
  duration: string
  teacher: string
}>()
</script>

<style scoped>
.program-card {
  padding: 20px;
  margin: 15px;
  transition: transform 0.3s ease;
}

.program-card:hover {
  transform: translateY(-5px);
}

.description {
  color: var(--text-dark);
  margin: 10px 0;
}

.details {
  display: flex;
  justify-content: space-between;
  margin: 15px 0;
  color: var(--emerald-dark);
}
</style>
