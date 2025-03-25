<template>
  <el-card class="teacher-card" shadow="hover">
    <div class="user-card__header">
      <el-avatar :size="50" :src="teacher.avatarUrl || Test" class="user-card__avatar" />
      <div class="user-card__main-info">
        <h3 class="user-card__name h2">{{ teacher.name }}</h3>
      </div>
    </div>

    <div class="teacher-bottom">
      <h6 class="teacher-position">{{ teacher.occupation }}</h6>
      <p class="teacher-description">{{ teacher.bio }}</p>
      <div class="teacher-subjects">
        <el-tag v-for="subject in teacher.subjects" :key="subject" type="info" class="subject-tag">
          {{ subject }}
        </el-tag>
      </div>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import AImage from '../atoms/AImage.vue'
import Test from '@/assets/icons/6.png'
import { ref, onMounted } from 'vue'
import { userService } from '@/common/utils/UserService'
import { User } from '@/common/types/User'

const props = defineProps<{
  userId: string
}>()

const teacher = ref<User>(userService.getDefaultUser())

onMounted(async () => {
  const [error, data] = await userService.getUser(props.userId)

  console.log('Получен ответ для userId', props.userId, data, error)

  if (!error && data) {
    teacher.value = data.data || userService.getDefaultUser()
  } else {
    console.error('Ошибка при загрузке данных пользователя. Используются тестовые данные.')

    teacher.value = userService.getDefaultUser()
  }

  teacher.value = userService.getDefaultUser()

  console.log('teacher.value', teacher.value)
})
</script>

<style scoped lang="scss">
.teacher-card {
  margin-bottom: 0px;
  border-radius: 12px;
  overflow: hidden;
  padding: 1px;
  border: 1px solid var(--color-emerald);
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 6px 6px 10px $color-emerald;
  }
}

.teacher-top {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 12px;
}

.teacher-avatar {
  flex-shrink: 0;
}

.teacher-name {
  font-size: 1.5rem;
  margin: 0;
  color: var(--color-primary);
  flex-grow: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.teacher-bottom {
  width: 100%;
}

.teacher-position {
  font-size: 1rem;
  color: var(--color-text-secondary);
  margin: 5px 0;
}

.teacher-description {
  font-size: 0.9rem;
  color: var(--color-text-regular);
  margin: 10px 0;
  word-break: normal;
  overflow-wrap: break-word;
}

.teacher-subjects {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.subject-tag {
  margin: 2px;
  color: var(--color-emerald);
  background: var(--color-white-dark);
  border: 1px solid var(--color-emerald);
}
.user-card__header {
  display: flex;
  margin-bottom: 10px;
  justify-content: center;
  align-items: center;
}

.user-card__main-info {
  margin-left: 10px;
}

.user-card__name {
  margin: 0;
  font-size: 1.8rem;
  word-wrap: break-word;
  align-items: center;
}

.user-card__avatar {
  flex-shrink: 0;
  justify-content: center;
  align-items: center;
  margin-right: 20px;
}
</style>
