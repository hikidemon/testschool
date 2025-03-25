
<template>
  <div class="data-table">
    <div class="data-table-header">
      <el-input
        v-if="searchable"
        v-model="searchQuery"
        placeholder="Поиск..."
        class="search-input"
      >
        <template #prefix>
          <el-icon><search /></el-icon>
        </template>
      </el-input>
      
      <slot name="actions" />
    </div>
    
    <el-table
      v-loading="loading"
      :data="filteredData"
      style="width: 100%"
      :border="true"
      stripe
    >
      <slot />
      
      <template #empty>
        <el-empty :description="emptyText" />
      </template>
    </el-table>
    
    <div class="data-table-footer">
      <el-pagination
        v-if="pagination"
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :total="totalItems"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Search } from '@element-plus/icons-vue'

const props = defineProps({
  data: {
    type: Array,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  },
  searchable: {
    type: Boolean,
    default: false
  },
  pagination: {
    type: Boolean,
    default: true
  },
  emptyText: {
    type: String,
    default: 'Нет данных'
  }
})

const emit = defineEmits(['update:page', 'update:pageSize'])

const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = ref(10)

const filteredData = computed(() => {
  let result = [...props.data]
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(item => 
      Object.values(item).some(val => 
        String(val).toLowerCase().includes(query)
      )
    )
  }
  
  return result
})

const totalItems = computed(() => filteredData.value.length)

const handleSizeChange = (val: number) => {
  pageSize.value = val
  emit('update:pageSize', val)
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
  emit('update:page', val)
}
</script>

<style scoped lang="scss">
.data-table {
  background: #fff;
  border-radius: 4px;
  padding: 20px;
  
  &-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    
    .search-input {
      width: 300px;
    }
  }
  
  &-footer {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
