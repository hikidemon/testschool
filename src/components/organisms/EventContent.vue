<template>
  <div class="main-content">
    <h1>Мероприятия</h1>
    <div class="admin-panel" v-if="isAdmin">
      <a-button class="add-post-button" type="primary" @click="openCreateModal">
        Добавить пост
      </a-button>
    </div>
    <div class="post-list">
      <post-card
        v-for="post in posts"
        :key="post.id"
        :id="post.id"
        :title="post.title"
        :content="post.content"
        :image="post.image"
        :date="post.date"
        :type="post.type"
        :area="post.area"
        :time="post.time"
        :eventdate="post.eventdate"
        @open="handleOpenPost(post)"
        @delete="handleDeletePost"
        @edit="handleEditPost"
        class="fade-in post-card"
        :isRegistered="post.isRegistered"
      />
    </div>
    <post-form
      :visible="isModalVisible"
      :postToEdit="postToEdit"
      @submit="handleSubmitPost"
      @close="closeModal"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import PostCard from '../molecules/PostCard.vue'
import { postService } from '@/common/utils/PostService'
import { Post } from '@/common/types/Post'
import programsIcon from '@/assets/icons/3.png'
import '@/assets/styles/_dark-theme.scss'
import { ElNotification } from 'element-plus'
import PostForm from '@/components/molecules/PostForm.vue'

const posts = ref<Post[]>([])
const isModalVisible = ref(false)
const postToEdit = ref<Post | null>(null)
const isAdmin = ref(true)

const fetchPosts = async () => {
  try {
    const allPosts = await postService.getAllPosts()
    posts.value = allPosts.filter(post => post.type === 'event')
  } catch (error) {
    console.error('Ошибка при загрузке мероприятий:', error)
    ElNotification({
      title: 'Ошибка',
      message: 'Не удалось загрузить данные. Показаны тестовые данные.',
      type: 'error',
      position: 'bottom-right'
    })
   
  }
}

const handleOpenPost = (post: Post) => {
  console.log('Открыт пост:', post)
}

const handleDeletePost = (postId: number) => {
  posts.value = posts.value.filter((post) => post.id !== postId)
}



const openCreateModal = () => {
  postToEdit.value = null
  isModalVisible.value = true
}

const handleEditPost = (post: Post) => {
  postToEdit.value = post
  isModalVisible.value = true
}

const handleSubmitPost = async (post: Post) => {
  try {
    if (post.id) {
      // Редактирование поста
      const [error, response] = await postService.updatePost(post.id, post);
      if (!error && response?.data) {
        // Обновляем локальное состояние
        const index = posts.value.findIndex(p => p.id === post.id);
        if (index !== -1) {
          posts.value[index] = { ...posts.value[index], ...response.data };
        }
      }
    } else {
      // Создание поста
      const [error, response] = await postService.createPost(post);
      if (!error && response?.data) {
        // Добавляем новый пост в локальное состояние
        posts.value.push(response.data.data);
      }
    }
    fetchPosts(); // Перезагружаем посты с сервера
    closeModal();
  } catch (error) {
    console.error('Ошибка при сохранении поста:', error);
    ElNotification({
      title: 'Ошибка',
      message: 'Не удалось сохранить пост.',
      type: 'error',
      position: 'bottom-right'
    });
  }
};



const closeModal = () => {
  isModalVisible.value = false
  postToEdit.value = null
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
  fetchPosts().then(() => {
    setupIntersectionObserver()
  })

 
})


</script>

<style scoped lang="scss">
.main-content {
  flex: 1;
  padding: 20px;
}

h1 {
  font-size: 2rem;
  margin-bottom: 20px;
  color: var(--color-black)-light;
}

.post-list {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  overflow-y: auto;
  max-height: 85vh;
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

.post-list::-webkit-scrollbar {
  display: none;
}
</style>
