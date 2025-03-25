<template>
  <div class="teachers-page">
    <h1 class="page-title">Наши преподаватели</h1>
    <div class="post-list">
      <teachers-list :user-ids="userIds" class="post-card" />
    </div>
  </div>
</template>

<script setup lang="ts">
import TeachersList from '@/components/molecules/TeacherList.vue'
import Test from '@/assets/icons/calendar.webm'
import { ref, onMounted } from 'vue'
import { userService } from '@/common/utils/UserService'

const userIds = ref<string[]>([])

const fetchTeacherIds = async () => {
  try {
    const [error, response] = await userService.getTeachers()

    if (error) throw error

    const teacherList = response?.data?.data

    if (Array.isArray(teacherList) && teacherList.length > 0) {
      userIds.value = teacherList
    } else {
      throw new Error('Список преподавателей пуст')
    }
  } catch (error) {
    console.error('Ошибка при загрузке преподавателей:', error)

    userIds.value = ['1', '2', '3', '4', '5', '1', '2', '3', '4', '5']
  }
}

const setupIntersectionObserver = () => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in-visible')
        } else {
          entry.target.classList.remove('fade-in-visible')
        }
      })
    },
    { threshold: 0.3 }
  )

  const postCards = document.querySelectorAll('.post-card')

  postCards.forEach((card) => {
    observer.observe(card)
  })
}

onMounted(() => {
  fetchTeacherIds().then(() => {
    setupIntersectionObserver()
  })
})
</script>

<style scoped lang="scss">
.teachers-page {
  padding: 20px;
  flex: 1;
}

.page-title {
  font-size: 2rem;
  margin-bottom: 20px;
  color: var(--color-dark)-light;
}
.post-list {
  overflow-y: auto;
  max-height: 85vh;
}
.post-list::-webkit-scrollbar {
  display: none;
}
.post-card {
  opacity: 0;
  transform: translateY(20px);
  transition:
    opacity 0.5s ease-out,
    transform 0.5s ease-out;
}
.post-card.fade-in-visible {
  opacity: 1;
  transform: translateY(0);
}
</style>
