
<template>
  <div class="program-list">
    <program-filter @filter="handleFilter" />
    <div class="programs-grid">
      <program-card
        v-for="program in filteredPrograms"
        :key="program.id"
        v-bind="program"
        @enroll="handleEnroll(program.id)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import ProgramFilter from '../molecules/ProgramFilter.vue'
import ProgramCard from '../atoms/ProgramCard.vue'
import { useUser } from '@/common/composables/useUser'

const { user } = useUser()

interface Program {
  id: string
  title: string
  description: string
  duration: string
  teacher: string
  category: string
}

const programs = ref<Program[]>([])
const filterParams = ref({ search: '', category: '' })

const filteredPrograms = computed(() => {
  return programs.value.filter(program => {
    const matchesSearch = program.title.toLowerCase().includes(filterParams.value.search.toLowerCase())
    const matchesCategory = !filterParams.value.category || program.category === filterParams.value.category
    return matchesSearch && matchesCategory
  })
})

const handleFilter = (params: typeof filterParams.value) => {
  filterParams.value = params
}

const handleEnroll = async (programId: string) => {
  if (!user.value) {
    // Handle unauthorized case
    return
  }
  // Handle enrollment logic
}
</script>

<style scoped>
.program-list {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.programs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}
</style>
