<template>
  <el-card class="event-card">
    <div class="event-card__header">
      <h2>Мои мероприятия</h2>
    </div>
    <div class="event-card__content">
      <div class="event-list">
        <div v-for="(event, index) in events" :key="index" class="event-item">
          <div class="event-item__info">
            <img :src="event.image" alt="Avatar" class="event-item__avatar" />
            <div class="event-item__details">
              <h3 class="event-item__title">{{ event.title }}</h3>
            </div>
          </div>
          <p class="event-item__date">{{ event.date }}</p>
          <el-button type="primary" @click="handleRegister(event)">Записаться</el-button>
        </div>
      </div>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { Ref, ref, onMounted, inject } from 'vue';
import { postService } from '@/common/utils/PostService';
import { ElNotification } from 'element-plus';
import { Post } from '@/common/types/Post';
import programsIcon from '@/assets/icons/3.png';
import { useRouter } from 'vue-router';
import { authService } from '@/common/utils/AuthService'; // Placeholder import

const router = useRouter();
const events = ref<Post[]>([]);
const registeredEvents = inject('registeredEvents') as Ref<number[]>;
const defaultEvent: Post[] = [
  {
    id: 1,
    title: 'Конференция Vue.js',
    date: '2022-07-15',
    image: programsIcon
  },
  {
    id: 2,
    title: 'Конференция React.js',
    date: '2022-07-15',
    image: 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'
  },
  {
    id: 3,
    title: 'Конференция Angular.js',
    date: '2022-07-15',
    image: 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'
  }
];

const fetchEvents = async () => {
  try {
    const [error, response] = await postService.getPosts();

    if (error) {
      throw error;
    }

    const filteredEvents = response?.data.data.filter((event: Post) => registeredEvents.value.includes(event.id));

    events.value = filteredEvents || defaultEvent;
  } catch (error) {
    console.error('Ошибка при загрузке мероприятий:', error);

    events.value = defaultEvent;

    ElNotification({
      title: 'Ошибка',
      message: 'Не удалось загрузить мероприятия',
      type: 'error',
      position: 'bottom-right'
    });
  }
};

const handleRegister = async (event: Post) => {
  const [authError, isAuthorized] = await authService.check(); // Placeholder function call

  if (authError || !isAuthorized) {
    ElNotification({
      title: 'Необходима авторизация',
      message: 'Пожалуйста, войдите в систему для регистрации на мероприятие',
      type: 'warning',
      position: 'bottom-right'
    });
    router.push('/auth');
    return;
  }

  await postService.registerUserForEvent(event.id); // Assuming postService has this method
  ElNotification({
    title: 'Успешно',
    message: 'Вы зарегистрированы на мероприятие',
    type: 'success',
    position: 'bottom-right'
  });
};

onMounted(() => {
  fetchEvents();
});
</script>

<style scoped lang="scss">
.event-card {
  background: linear-gradient(145deg, #282828 0%, #181818 100%);
  border-radius: 8px;
  padding: 16px;
  transition: all 0.3s ease;
  cursor: pointer;
  color: #fff;

  &:hover {
    background: linear-gradient(145deg, #303030 0%, #202020 100%);
    transform: translateY(-4px);
  }

  .event-image {
    width: 100%;
    aspect-ratio: 1;
    object-fit: cover;
    border-radius: 4px;
    margin-bottom: 16px;
  }

  .event-title {
    font-size: 1.2em;
    font-weight: 700;
    margin-bottom: 8px;
    color: #fff;
  }

  .event-date {
    font-size: 0.9em;
    color: #b3b3b3;
    margin-bottom: 12px;
  }

  .event-description {
    font-size: 0.9em;
    color: #b3b3b3;
    margin-bottom: 16px;
    line-height: 1.4;
  }

  .register-button {
    background: #1db954;
    color: #fff;
    border: none;
    border-radius: 20px;
    padding: 8px 24px;
    font-weight: 600;
    transition: all 0.2s ease;

    &:hover {
      background: #1ed760;
      transform: scale(1.05);
    }
  }
}

.event-item {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 20px;
  background-color: #282828;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s ease;
  color: white;
}

.event-item__info {
    display: flex;
    align-items: center;
    gap: 15px;
}

.event-item__avatar {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 12px;
}

.event-item__details {
  display: flex;
  flex-direction: column;
}

.event-item__title {
  font-size: 1.2rem;
  font-weight: bold;
  color: white;
}

.event-item__date {
  font-size: 1rem;
  font-weight: normal;
  color: #888;
}
</style>