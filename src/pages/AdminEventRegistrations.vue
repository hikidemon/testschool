<template>
  <div class="admin-events">
    <div class="filters">
      <el-input
        v-model="search"
        placeholder="Поиск по имени/событию"
        prefix-icon="el-icon-search"
      />
      <el-select v-model="eventFilter" placeholder="Фильтр по мероприятию">
        <el-option 
          v-for="event in events" 
          :key="event.id" 
          :label="event.title" 
          :value="event.id"
        />
      </el-select>
    </div>

    <el-table :data="filteredRegistrations" style="width: 100%">
      <el-table-column prop="userName" label="Имя участника" />
      <el-table-column prop="eventTitle" label="Мероприятие" />
      <el-table-column prop="registrationDate" label="Дата регистрации" />
      <el-table-column prop="status" label="Статус">
        <template #default="{ row }">
          <el-tag :type="row.status === 'confirmed' ? 'success' : 'warning'">
            {{ row.status === 'confirmed' ? 'Подтверждено' : 'Ожидает' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Действия">
        <template #default="{ row }">
          <el-button-group>
            <el-button 
              type="success" 
              size="small" 
              @click="confirmRegistration(row.id)"
            >
              Подтвердить
            </el-button>
            <el-button 
              type="danger" 
              size="small" 
              @click="cancelRegistration(row.id)"
            >
              Отменить
            </el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>

    <div class="export-section">
      <el-button type="primary" @click="exportData">
        Экспорт данных
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useEventStore } from '@/store/EventStore'
import { ElNotification } from 'element-plus'

const eventStore = useEventStore()
const search = ref('')
const eventFilter = ref(null)
const registrations = ref(eventStore.registrations)
const events = ref(eventStore.events)


const filteredRegistrations = computed(() => {
  return registrations.value.filter(reg => {
    const matchesSearch = search.value ? 
      reg.userName.toLowerCase().includes(search.value.toLowerCase()) ||
      reg.eventTitle.toLowerCase().includes(search.value.toLowerCase())
      : true

    const matchesEvent = eventFilter.value ? 
      reg.eventId === eventFilter.value 
      : true

    return matchesSearch && matchesEvent
  })
})

const exportData = async () => {
  try {
    await eventStore.exportRegistrations();
    ElNotification({
      title: 'Успешно',
      message: 'Данные экспортированы',
      type: 'success'
    })
  } catch (error) {
    ElNotification({
      title: 'Ошибка',
      message: 'Не удалось экспортировать данные',
      type: 'error'
    })
  }
}

const confirmRegistration = async (registrationId) => {
  try {
    await eventStore.updateRegistrationStatus(registrationId, 'confirmed');
    ElNotification({
      title: 'Успешно',
      message: 'Регистрация подтверждена',
      type: 'success'
    })
  } catch (error) {
    ElNotification({
      title: 'Ошибка',
      message: 'Не удалось подтвердить регистрацию',
      type: 'error'
    })
  }
}

const cancelRegistration = async (registrationId) => {
  try {
    await eventStore.updateRegistrationStatus(registrationId, 'cancelled');
    ElNotification({
      title: 'Успешно',
      message: 'Регистрация отменена',
      type: 'success'
    })
  } catch (error) {
    ElNotification({
      title: 'Ошибка',
      message: 'Не удалось отменить регистрацию',
      type: 'error'
    })
  }
}
</script>

<style lang="scss" scoped>
.admin-events {
  padding: 20px;

  .filters {
    display: flex;
    gap: 16px;
    margin-bottom: 20px;
  }

  .export-section {
    margin-top: 20px;
    text-align: right;
  }
}
</style>