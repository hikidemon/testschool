
<template>
  <div class="event-content">
    <h1 class="emerald-gradient-text">События</h1>
    
    <div class="event-filters neumorphic">
      <el-select v-model="filterMonth" placeholder="Месяц" class="filter-select">
        <el-option v-for="month in months" :key="month.value" :label="month.label" :value="month.value" />
      </el-select>
      
      <el-select v-model="filterCategory" placeholder="Категория" class="filter-select">
        <el-option v-for="category in categories" :key="category.value" :label="category.label" :value="category.value" />
      </el-select>
    </div>
    
    <div class="events-timeline">
      <div v-for="event in filteredEvents" :key="event.id" class="event-card neumorphic">
        <div class="event-time">
          <span class="date">{{ formatDate(event.date) }}</span>
          <span class="time">{{ formatTime(event.date) }}</span>
        </div>
        
        <div class="event-details">
          <h3>{{ event.title }}</h3>
          <p>{{ event.description }}</p>
          <div class="event-meta">
            <span class="location">
              <i class="el-icon-location"></i>
              {{ event.location }}
            </span>
            <el-tag :type="event.category.type">{{ event.category.name }}</el-tag>
          </div>
        </div>
        
        <div class="event-actions">
          <el-button type="primary" @click="viewEvent(event.id)">
            Подробнее
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const filterMonth = ref('')
const filterCategory = ref('')

const months = [
  { value: 1, label: 'Январь' },
  { value: 2, label: 'Февраль' },
  // Add more months
]

const categories = [
  { value: 'academic', label: 'Учебные' },
  { value: 'sport', label: 'Спортивные' },
  // Add more categories
]

const events = ref([
  {
    id: 1,
    title: 'Название события',
    description: 'Описание события...',
    date: new Date(),
    location: 'Место проведения',
    category: { name: 'Учебное', type: 'success' }
  }
  // Add more events
])

const filteredEvents = computed(() => {
  return events.value.filter(event => {
    const monthMatch = !filterMonth.value || new Date(event.date).getMonth() + 1 === filterMonth.value
    const categoryMatch = !filterCategory.value || event.category.type === filterCategory.value
    return monthMatch && categoryMatch
  })
})

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('ru-RU').format(date)
}

const formatTime = (date: Date) => {
  return new Intl.DateTimeFormat('ru-RU', { hour: '2-digit', minute: '2-digit' }).format(date)
}

const viewEvent = (id: number) => {
  router.push(`/events/${id}`)
}
</script>

<style scoped lang="scss">
.event-content {
  h1 {
    margin-bottom: 32px;
  }
}

.event-filters {
  display: flex;
  gap: 16px;
  padding: 20px;
  margin-bottom: 32px;
}

.filter-select {
  width: 200px;
}

.events-timeline {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.event-card {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 24px;
  padding: 24px;
  align-items: center;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateX(8px);
  }

  .event-time {
    text-align: center;
    padding: 16px;
    border-right: 2px solid var(--emerald-primary);

    .date {
      display: block;
      font-weight: bold;
      color: var(--emerald-primary);
    }

    .time {
      display: block;
      margin-top: 4px;
      opacity: 0.8;
    }
  }

  .event-details {
    h3 {
      margin: 0 0 8px;
      color: var(--emerald-primary);
    }

    p {
      margin: 0 0 16px;
    }

    .event-meta {
      display: flex;
      align-items: center;
      gap: 16px;

      .location {
        display: flex;
        align-items: center;
        gap: 4px;
        opacity: 0.8;
      }
    }
  }
}

@media (max-width: 768px) {
  .event-card {
    grid-template-columns: 1fr;
    gap: 16px;

    .event-time {
      border-right: none;
      border-bottom: 2px solid var(--emerald-primary);
    }
  }
}
</style>
