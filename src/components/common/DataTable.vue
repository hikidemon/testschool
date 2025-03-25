
<template>
  <div class="data-table neumorphic">
    <div class="table-header">
      <slot name="header">
        <h3 class="emerald-gradient-text">{{ title }}</h3>
      </slot>
      <div class="table-actions">
        <slot name="actions"></slot>
      </div>
    </div>
    
    <el-table 
      :data="data" 
      style="width: 100%"
      :border="false"
      class="custom-table">
      <slot></slot>
    </el-table>
    
    <div class="table-footer">
      <el-pagination
        v-if="showPagination"
        :current-page="currentPage"
        :page-size="pageSize"
        :total="total"
        layout="prev, pager, next"
        @current-change="handlePageChange"
        class="neumorphic-inset"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  data: {
    type: Array,
    required: true
  },
  title: {
    type: String,
    default: ''
  },
  showPagination: {
    type: Boolean,
    default: true
  },
  currentPage: {
    type: Number,
    default: 1
  },
  pageSize: {
    type: Number,
    default: 10
  },
  total: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['page-change'])

const handlePageChange = (page: number) => {
  emit('page-change', page)
}
</script>

<style scoped lang="scss">
.data-table {
  padding: 24px;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;

  h3 {
    margin: 0;
  }
}

.table-actions {
  display: flex;
  gap: 12px;
}

.table-footer {
  margin-top: 24px;
  display: flex;
  justify-content: center;
}

:deep(.custom-table) {
  --el-table-border-color: var(--emerald-light);
  --el-table-header-bg-color: var(--surface-light);
  --el-table-row-hover-bg-color: var(--emerald-light);
  
  th {
    background-color: var(--surface-light) !important;
    font-weight: 600;
    color: var(--emerald-primary);
  }

  td {
    transition: all 0.3s ease;
  }
}

:deep(.el-pagination) {
  padding: 8px 16px;
  border-radius: 12px;
  
  .el-pager li {
    background: transparent;
    color: var(--text-dark);
    
    &.is-active {
      color: var(--emerald-primary);
      font-weight: bold;
    }
  }
}
</style>
