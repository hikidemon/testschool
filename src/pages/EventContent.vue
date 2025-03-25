
<template>
  <div class="event-content">
    <el-card class="event-card" :body-style="{ padding: '0px' }">
      <div class="event-header" :style="{ backgroundImage: `url(${event?.image?.[0]?.url || ''})` }">
        <div class="event-overlay">
          <h1 class="event-title">{{ event?.title }}</h1>
          <div class="event-meta">
            <el-tag type="success" class="meta-tag">
              <el-icon><Calendar /></el-icon>
              {{ formatDate(event?.eventdate) }}
            </el-tag>
            <el-tag type="info" class="meta-tag">
              <el-icon><Clock /></el-icon>
              {{ event?.time }}
            </el-tag>
            <el-tag type="warning" class="meta-tag">
              <el-icon><Location /></el-icon>
              {{ event?.area }}
            </el-tag>
          </div>
        </div>
      </div>
      
      <div class="event-body">
        <div class="event-description" v-html="event?.content"></div>
        
        <div class="event-actions">
          <el-button 
            type="primary" 
            :icon="event?.isRegistered ? 'Check' : 'Plus'"
            :disabled="event?.isRegistered"
            @click="handleRegister"
          >
            {{ event?.isRegistered ? 'Зарегистрирован' : 'Зарегистрироваться' }}
          </el-button>
          
          <el-button type="info" icon="Share" @click="handleShare">
            Поделиться
          </el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { Calendar, Clock, Location } from '@element-plus/icons-vue'
import type { Post } from '@/common/types/Post'
import { ElMessage } from 'element-plus'

const route = useRoute()
const event = ref<Post | null>(null)

const formatDate = (date: string | undefined) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

const handleRegister = () => {
  ElMessage.success('Регистрация прошла успешно!')
  if (event.value) {
    event.value.isRegistered = true
  }
}

const handleShare = async () => {
  try {
    await navigator.share({
      title: event.value?.title,
      text: event.value?.content,
      url: window.location.href
    })
  } catch {
    ElMessage.info('Скопировано в буфер обмена')
    navigator.clipboard.writeText(window.location.href)
  }
}

onMounted(async () => {
  // Here you would fetch the event data using the route.params.id
  // For now using mock data
  event.value = {
    id: Number(route.params.id),
    title: 'Sample Event',
    content: 'Event content...',
    date: new Date().toISOString(),
    image: [{ url: '/path/to/image.jpg' }],
    type: 'event',
    area: 'Main Hall',
    eventdate: new Date().toISOString(),
    time: '14:00',
    isRegistered: false
  }
})
</script>

<style scoped lang="scss">
.event-content {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1rem;
}

.event-card {
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-4px);
  }
}

.event-header {
  height: 400px;
  background-size: cover;
  background-position: center;
  position: relative;
}

.event-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 2rem;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
  color: white;
}

.event-title {
  font-size: 2.5rem;
  margin: 0 0 1rem;
  font-weight: 600;
}

.event-meta {
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

.event-body {
  padding: 2rem;
}

.event-description {
  font-size: 1.1rem;
  line-height: 1.6;
  color: #2c3e50;
  margin-bottom: 2rem;
}

.event-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-start;
  margin-top: 2rem;
}
</style>
