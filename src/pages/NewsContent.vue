
<template>
  <div class="news-content">
    <el-card class="news-card" :body-style="{ padding: '0px' }">
      <div class="news-header" :style="{ backgroundImage: `url(${news?.image?.[0]?.url || ''})` }">
        <div class="news-overlay">
          <h1 class="news-title">{{ news?.title }}</h1>
          <div class="news-meta">
            <el-tag type="info" class="meta-tag">
              <el-icon><Calendar /></el-icon>
              {{ formatDate(news?.date) }}
            </el-tag>
            <el-tag type="warning" class="meta-tag">
              <el-icon><Location /></el-icon>
              {{ news?.area }}
            </el-tag>
          </div>
        </div>
      </div>
      
      <div class="news-body">
        <div class="news-description" v-html="news?.content"></div>
        
        <div class="news-actions">
          <el-button type="primary" icon="ThumbsUp" @click="handleLike">
            {{ liked ? 'Понравилось' : 'Нравится' }}
          </el-button>
          
          <el-button type="info" icon="Share" @click="handleShare">
            Поделиться
          </el-button>
        </div>
        
        <div class="news-comments" v-if="showComments">
          <h3>Комментарии</h3>
          <el-input
            v-model="newComment"
            type="textarea"
            placeholder="Оставьте комментарий..."
            :rows="3"
          />
          <el-button type="primary" @click="handleComment" :disabled="!newComment.trim()">
            Отправить
          </el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { Calendar, Location } from '@element-plus/icons-vue'
import type { Post } from '@/common/types/Post'
import { ElMessage } from 'element-plus'

const route = useRoute()
const news = ref<Post | null>(null)
const liked = ref(false)
const showComments = ref(true)
const newComment = ref('')

const formatDate = (date: string | undefined) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

const handleLike = () => {
  liked.value = !liked.value
  ElMessage.success(liked.value ? 'Добавлено в понравившиеся' : 'Удалено из понравившихся')
}

const handleShare = async () => {
  try {
    await navigator.share({
      title: news.value?.title,
      text: news.value?.content,
      url: window.location.href
    })
  } catch {
    ElMessage.info('Скопировано в буфер обмена')
    navigator.clipboard.writeText(window.location.href)
  }
}

const handleComment = () => {
  ElMessage.success('Комментарий добавлен')
  newComment.value = ''
}

onMounted(async () => {
  // Here you would fetch the news data using the route.params.id
  // For now using mock data
  news.value = {
    id: Number(route.params.id),
    title: 'Sample News',
    content: 'News content...',
    date: new Date().toISOString(),
    image: [{ url: '/path/to/image.jpg' }],
    type: 'news',
    area: 'School News',
    time: ''
  }
})
</script>

<style scoped lang="scss">
.news-content {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1rem;
}

.news-card {
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-4px);
  }
}

.news-header {
  height: 400px;
  background-size: cover;
  background-position: center;
  position: relative;
}

.news-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 2rem;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
  color: white;
}

.news-title {
  font-size: 2.5rem;
  margin: 0 0 1rem;
  font-weight: 600;
}

.news-meta {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.meta-tag {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
}

.news-body {
  padding: 2rem;
}

.news-description {
  font-size: 1.1rem;
  line-height: 1.6;
  color: #2c3e50;
  margin-bottom: 2rem;
}

.news-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-start;
  margin-top: 2rem;
  margin-bottom: 2rem;
}

.news-comments {
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid #eee;

  h3 {
    margin-bottom: 1rem;
    font-size: 1.5rem;
    color: #2c3e50;
  }

  .el-button {
    margin-top: 1rem;
  }
}
</style>
