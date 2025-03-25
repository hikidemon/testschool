
<template>
  <div class="admin-events">
    <h1>Управление регистрациями</h1>
    
    <div class="filters">
      <el-input
        v-model="search"
        placeholder="Поиск..."
        prefix-icon="el-icon-search"
        clearable
      />
      
      <el-select v-model="eventFilter" placeholder="Мероприятие" clearable>
        <el-option
          v-for="event in events"
          :key="event.id"
          :label="event.title"
          :value="event.id"
        />
      </el-select>
      
      <el-date-picker
        v-model="dateFilter"
        type="date"
        placeholder="Дата"
        clearable
      />
    </div>

    <el-table :data="filteredRegistrations" style="width: 100%">
      <el-table-column prop="userName" label="Пользователь" />
      <el-table-column prop="eventTitle" label="Мероприятие" />
      <el-table-column prop="registrationDate" label="Дата регистрации" />
      <el-table-column prop="status" label="Статус">
        <template #default="{ row }">
          <el-select v-model="row.status" @change="updateStatus(row)">
            <el-option label="Ожидание" value="pending" />
            <el-option label="Подтверждено" value="confirmed" />
            <el-option label="Отменено" value="cancelled" />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="Действия" width="120">
        <template #default="{ row }">
          <el-button type="danger" size="small" @click="deleteRegistration(row)">
            Удалить
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useEventStore } from '@/store/EventStore'
import { ElNotification } from 'element-plus'

const eventStore = useEventStore()
const search = ref('')
const eventFilter = ref(null)
const dateFilter = ref(null)

const filteredRegistrations = computed(() => {
  let result = eventStore.registrations
  
  if (search.value) {
    result = result.filter(r => 
      r.userName.toLowerCase().includes(search.value.toLowerCase()) ||
      r.eventTitle.toLowerCase().includes(search.value.toLowerCase())
    )
  }
  
  if (eventFilter.value) {
    result = result.filter(r => r.eventId === eventFilter.value)
  }
  
  if (dateFilter.value) {
    result = result.filter(r => 
      new Date(r.registrationDate).toDateString() === dateFilter.value.toDateString()
    )
  }
  
  return result
})

async function updateStatus(registration) {
  try {
    await eventStore.updateRegistrationStatus(registration)
    ElNotification({
      title: 'Успешно',
      message: 'Статус обновлен',
      type: 'success'
    })
  } catch (error) {
    ElNotification({
      title: 'Ошибка',
      message: 'Не удалось обновить статус',
      type: 'error'
    })
  }
}

async function deleteRegistration(registration) {
  try {
    await eventStore.deleteRegistration(registration.id)
    ElNotification({
      title: 'Успешно',
      message: 'Регистрация удалена',
      type: 'success'
    })
  } catch (error) {
    ElNotification({
      title: 'Ошибка',
      message: 'Не удалось удалить регистрацию',
      type: 'error'
    })
  }
}
</script>

<style lang="scss" scoped>
.admin-events {
  padding: 20px;
  
  h1 {
    margin-bottom: 20px;
  }
  
  .filters {
    display: flex;
    gap: 16px;
    margin-bottom: 20px;
    
    .el-input {
      width: 200px;
    }
    
    .el-select {
      width: 200px;
    }
  }
}
</style>
