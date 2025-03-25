<template>
  <div class="news-content">
    <h1 class="emerald-gradient-text">Новости</h1>

    <div class="news-grid">
      <article v-for="news in newsItems" :key="news.id" class="news-card neumorphic">
        <img :src="news.image" :alt="news.title" class="news-image">
        <div class="news-body">
          <h3>{{ news.title }}</h3>
          <p>{{ news.description }}</p>
          <div class="news-footer">
            <span class="news-date">{{ formatDate(news.date) }}</span>
            <el-button type="primary" @click="viewNews(news.id)">
              Подробнее
            </el-button>
          </div>
        </div>
      </article>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const newsItems = ref([
  {
    id: 1,
    title: 'Заголовок новости',
    description: 'Краткое описание новости...',
    image: 'https://placeholder.com/300x200',
    date: new Date()
  }
  // Add more news items
])

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('ru-RU').format(date)
}

const viewNews = (id: number) => {
  router.push(`/news/${id}`)
}
</script>

<style scoped lang="scss">
.news-content {
  h1 {
    margin-bottom: 32px;
  }
}

.news-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
}

.news-card {
  overflow: hidden;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-4px);
  }

  .news-image {
    width: 100%;
    height: 200px;
    object-fit: cover;
  }

  .news-body {
    padding: 20px;

    h3 {
      margin: 0 0 12px;
      color: var(--emerald-primary);
    }

    p {
      margin: 0 0 16px;
      color: var(--text-dark);
    }
  }

  .news-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .news-date {
      color: var(--text-dark);
      opacity: 0.8;
    }
  }
}
</style>