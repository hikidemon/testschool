<template>
  <div class="main-content">
    <h1>Новости</h1>
    <div class="post-list">
      <post-card
        v-for="post in posts"
        :key="post.id"
        :id="post.id"
        :title="post.title"
        :content="post.content"
        :image="post.image"
        :date="post.date"
        type="news"
        @open="handleOpenPost(post)"
        class="fade-in post-card"
        @delete="handleDeletePost"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import PostCard from '../molecules/PostCard.vue'
import { postService } from '@/common/utils/PostService'
import { Post } from '@/common/types/Post'
import programsIcon from '@/assets/icons/3.png'
import '@/assets/styles/_dark-theme.scss'

const posts = ref<Post[]>([])

const fetchPosts = async () => {
  try {
    const allPosts = await postService.getAllPosts()
    posts.value = allPosts.filter(post => post.type === 'news')
  } catch (error) {
    console.error('Ошибка при загрузке новостей:', error)

  }
}

const handleOpenPost = (post: Post) => {
  console.log('Открыт пост:', post)
}

const handleDeletePost = (postId: number) => {
  posts.value = posts.value.filter((post) => post.id !== postId)
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

let intervalId: number

onMounted(() => {
  fetchPosts().then(() => {
    setupIntersectionObserver()
  })

  intervalId = window.setInterval(fetchPosts, 60000)
})

onBeforeUnmount(() => {
  clearInterval(intervalId)
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
