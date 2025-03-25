
<template>
  <el-container class="layout-container">
    <el-header class="layout-header">
      <div class="header-content">
        <h1 class="header-title">{{ title }}</h1>
        <el-dropdown class="user-menu" trigger="click">
          <span class="user-menu-trigger">
            {{ userStore.fullName }}
            <el-icon class="el-icon--right"><arrow-down /></el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="navigateToProfile">
                Профиль
              </el-dropdown-item>
              <el-dropdown-item @click="handleLogout">
                Выйти
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </el-header>
    
    <el-container>
      <el-aside width="250px" class="layout-sidebar">
        <el-menu
          :default-active="currentRoute"
          class="sidebar-menu"
          @select="handleMenuSelect"
        >
          <el-menu-item 
            v-for="item in menuItems" 
            :key="item.route"
            :index="item.route"
          >
            <el-icon><component :is="item.icon" /></el-icon>
            <span>{{ item.title }}</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      
      <el-main class="layout-main">
        <slot />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/store/user'
import { ArrowDown } from '@element-plus/icons-vue'

const props = defineProps<{
  title: string
}>()

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const currentRoute = computed(() => route.path)

const menuItems = computed(() => {
  const items = [
    { title: 'Расписание', route: '/schedule', icon: 'Calendar' },
    { title: 'Мои группы', route: '/groups', icon: 'Users' }
  ]
  
  if (userStore.isAdmin) {
    items.push({ title: 'Управление', route: '/admin', icon: 'Setting' })
  }
  
  return items
})

const handleMenuSelect = (route: string) => {
  router.push(route)
}

const navigateToProfile = () => {
  router.push('/profile')
}

const handleLogout = async () => {
  await userStore.logout()
  router.push('/login')
}
</script>

<style scoped lang="scss">
.layout-container {
  height: 100vh;
}

.layout-header {
  background: #fff;
  border-bottom: 1px solid #dcdfe6;
  padding: 0 20px;
  
  .header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 100%;
  }
  
  .header-title {
    margin: 0;
    font-size: 1.5rem;
    color: #303133;
  }
}

.layout-sidebar {
  background: #fff;
  border-right: 1px solid #dcdfe6;
}

.layout-main {
  background: #f5f7fa;
  padding: 20px;
}

.user-menu {
  &-trigger {
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
  }
}

.sidebar-menu {
  border-right: none;
}
</style>
