<template>
  <el-select
    v-model="selected"
    :placeholder="placeholder"
    class="filter-dropdown"
    @change="handleChange"
  >
    <el-option
      v-for="option in options"
      :key="option.value"
      :label="option.label"
      :value="option.value"
    />
  </el-select>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface Option {
  value: string | number;
  label: string;
}

defineProps<{
  options: Option[];
  placeholder?: string;
}>();

const selected = defineModel<string | number>();

const emit = defineEmits<{
  (event: 'change', value: string | number): void;
}>();

function handleChange(value: string | number) {
  emit('change', value);
}
</script>

<style scoped lang="scss">
.filter-dropdown {
  width: 200px;
  margin-right: 10px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  &:focus {
    border-color: #409eff;
    box-shadow: 0 0 8px rgba(64, 158, 255, 0.3);
  }
}

.el-select-dropdown {
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.el-option {
  padding: 10px 20px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #f5f7fa;
  }

  &.selected {
    background-color: #409eff;
    color: white;
  }
}
</style>