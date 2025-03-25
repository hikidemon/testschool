
<template>
  <div class="parent-dashboard">
    <h2>Личный кабинет родителя</h2>
    
    <div class="notification-settings">
      <h3>Настройки уведомлений</h3>
      <el-form :model="notificationSettings">
        <el-form-item label="Способ уведомлений">
          <el-select v-model="notificationSettings.method">
            <el-option label="Email" value="email" />
            <el-option label="Telegram" value="telegram" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="notificationSettings.method === 'telegram'" label="Telegram ID">
          <el-input v-model="notificationSettings.telegramId" />
        </el-form-item>
        <el-form-item v-if="notificationSettings.method === 'email'" label="Email">
          <el-input v-model="notificationSettings.email" type="email" />
        </el-form-item>
        
        <el-divider>Уведомлять о:</el-divider>
        
        <el-form-item>
          <el-checkbox v-model="notificationSettings.notifications.schedule">Изменениях в расписании</el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="notificationSettings.notifications.news">Новых новостях</el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="notificationSettings.notifications.events">Новых мероприятиях</el-checkbox>
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" @click="saveNotificationSettings">Сохранить настройки</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="children-list">
      <h3>Мои дети</h3>
      <el-button type="primary" @click="showAddChildDialog = true">Добавить ребенка</el-button>
      
      <el-table :data="children" style="width: 100%; margin-top: 20px;">
        <el-table-column prop="name" label="Имя" />
        <el-table-column prop="age" label="Возраст" />
        <el-table-column prop="school" label="Школа" />
        <el-table-column prop="class" label="Класс" />
        <el-table-column label="Действия">
          <template #default="{ row }">
            <el-button @click="viewChild(row)" type="info" size="small">Просмотр</el-button>
            <el-button 
              v-if="row.age >= 14" 
              type="success" 
              size="small"
              @click="sendProfileInvite(row)"
            >
              Отправить приглашение
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- Диалог добавления ребенка -->
    <el-dialog
      v-model="showAddChildDialog"
      title="Добавить ребенка"
      width="50%"
    >
      <el-form :model="newChild" label-width="120px">
        <el-form-item label="Имя">
          <el-input v-model="newChild.name" />
        </el-form-item>
        <el-form-item label="Дата рождения">
          <el-date-picker v-model="newChild.birthDate" type="date" />
        </el-form-item>
        <el-form-item label="Школа">
          <el-input v-model="newChild.school" />
        </el-form-item>
        <el-form-item label="Класс">
          <el-input v-model="newChild.class" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showAddChildDialog = false">Отмена</el-button>
          <el-button type="primary" @click="addChild">Добавить</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElNotification } from 'element-plus'

const notificationSettings = ref({
  method: 'email',
  telegramId: '',
  email: '',
  notifications: {
    schedule: true,
    news: true,
    events: true
  }
})

const saveNotificationSettings = async () => {
  await NotificationService.updateNotificationSettings(notificationSettings.value)
}

onMounted(() => {
  // Subscribe to WebSocket updates
  if (userStore.userId) {
    webSocketService.subscribeToUpdates(userStore.userId)
  }
})

onUnmounted(() => {
  // Unsubscribe from WebSocket updates
  if (userStore.userId) {
    webSocketService.unsubscribeFromUpdates(userStore.userId)
  }
})

const children = ref([])
const showAddChildDialog = ref(false)
const newChild = ref({
  name: '',
  birthDate: '',
  school: '',
  class: ''
})

const addChild = async () => {
  try {
    // Add API call here
    showAddChildDialog.value = false
    ElNotification({
      title: 'Успешно',
      message: 'Ребенок добавлен',
      type: 'success'
    })
  } catch (error) {
    ElNotification({
      title: 'Ошибка',
      message: 'Не удалось добавить ребенка',
      type: 'error'
    })
  }
}

const viewChild = (child) => {
  // Add navigation to child profile
}

const sendProfileInvite = async (child) => {
  try {
    // Add API call here
    ElNotification({
      title: 'Успешно',
      message: 'Приглашение отправлено',
      type: 'success'
    })
  } catch (error) {
    ElNotification({
      title: 'Ошибка',
      message: 'Не удалось отправить приглашение',
      type: 'error'
    })
  }
}
</script>

<style lang="scss" scoped>
.parent-dashboard {
  padding: 20px;

  h2 {
    margin-bottom: 30px;
    color: var(--el-text-color-primary);
  }

  .notification-settings {
    margin-bottom: 40px;
    padding: 20px;
    background: var(--el-bg-color-overlay);
    border-radius: 8px;
    box-shadow: var(--el-box-shadow-light);
  }

  .children-list {
    background: var(--el-bg-color-overlay);
    padding: 20px;
    border-radius: 8px;
    box-shadow: var(--el-box-shadow-light);
  }
}
</style>
