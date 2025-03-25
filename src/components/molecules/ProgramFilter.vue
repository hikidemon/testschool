
<template>
  <div class="program-filter neumorphic-inset">
    <el-input
      v-model="searchQuery"
      placeholder="Поиск программы"
      @input="$emit('filter', { search: searchQuery, category: selectedCategory })"
    >
      <template #prefix>
        <el-icon><Search /></el-icon>
      </template>
    </el-input>
    
    <el-select
      v-model="selectedCategory"
      placeholder="Категория"
      @change="$emit('filter', { search: searchQuery, category: selectedCategory })"
    >
      <el-option
        v-for="category in categories"
        :key="category.value"
        :label="category.label"
        :value="category.value"
      />
    </el-select>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Search } from '@element-plus/icons-vue'

const searchQuery = ref('')
const selectedCategory = ref('')

const categories = [
  { label: 'Все программы', value: '' },
  { label: 'Математика', value: 'math' },
  { label: 'Физика', value: 'physics' },
  { label: 'Информатика', value: 'cs' },
  { label: 'Химия', value: 'chemistry' }
]
</script>

<style scoped>
.program-filter {
  display: flex;
  gap: 20px;
  padding: 20px;
  margin-bottom: 30px;
}
</style>
