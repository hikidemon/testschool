<template>
  <div class="event-card" :class="{ 'spotify-style': true }">
    <img :src="event.image" class="event-image" />
    <div class="event-content">
      <h3>{{ event.title }}</h3>
      <p>{{ event.description }}</p>
      <div class="event-details">
        <span><i class="el-icon-time"></i> {{ formatDate(event.date) }}</span>
        <span><i class="el-icon-location"></i> {{ event.location }}</span>
      </div>
      <el-button 
        type="primary" 
        @click="handleRegister" 
        :loading="loading"
      >
        {{ isRegistered ? 'Зарегистрирован' : 'Записаться' }}
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuthStore } from '@/store/AuthStore'
import { useRouter } from 'vue-router'
import { ElNotification } from 'element-plus'
import { postService } from '@/common/utils/PostService';
import { format } from 'date-fns';

const props = defineProps<{
  event: {
    id: number;
    title: string;
    date: string;
    image: string;
    description: string;
    location: string;
    requiresParentalConsent?: boolean;
  };
}>()
const authStore = useAuthStore()
const router = useRouter()
const loading = ref(false)
const isRegistered = ref(false)

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return format(date, 'dd.MM.yyyy');
};


const handleRegister = async () => {
  if (!authStore.isAuthenticated) {
    ElNotification({
      title: 'Требуется авторизация',
      message: 'Для записи на мероприятие необходимо войти в систему',
      type: 'warning'
    })
    router.push('/auth')
    return
  }

  if (authStore.userRole === 'parent' && props.event.requiresParentalConsent) {
    // Handle parental consent -  This needs further implementation based on your requirements.  
    // For example, you might display a modal asking for parent's confirmation.
    alert('Parental consent required.  This feature needs further implementation.');
    return;
  }

  try {
    loading.value = true
    const response = await postService.registerUserForEvent(props.event.id);
    if (response.status === 200) {
      isRegistered.value = true;
      ElNotification({
        title: 'Успешно',
        message: 'Вы успешно зарегистрировались на мероприятие!',
        type: 'success'
      })
    } else {
      ElNotification({
        title: 'Ошибка',
        message: 'Не удалось записаться на мероприятие. Пожалуйста, попробуйте позже.',
        type: 'error'
      })
    }

  } catch (error) {
    ElNotification({
      title: 'Ошибка',
      message: 'Не удалось записаться на мероприятие',
      type: 'error'
    })
  } finally {
    loading.value = false
  }
}
</script>

<style lang="scss" scoped>
.spotify-style {
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.5));
  border-radius: 8px;
  padding: 16px;
  transition: all 0.3s ease;

  &:hover {
    background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
    transform: translateY(-4px);
  }
}

.event-image {
  width: 100%;
  border-radius: 4px;
  margin-bottom: 12px;
}

.event-content {
  color: white;
}

.event-details {
  display: flex;
  gap: 16px;
  margin: 12px 0;
}
</style>