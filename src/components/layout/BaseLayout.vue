
<template>
  <div class="layout">
    <nav class="sidebar neumorphic">
      <div class="logo emerald-gradient-text">
        <h2>School Portal</h2>
      </div>
      <div class="nav-links">
        <router-link v-for="route in mainRoutes" 
          :key="route.path" 
          :to="route.path"
          class="nav-link"
          :class="{ active: currentRoute === route.path }">
          <i :class="route.icon"></i>
          {{ route.name }}
        </router-link>
      </div>
    </nav>
    
    <main class="main-content">
      <header class="top-bar neumorphic">
        <div class="user-controls">
          <el-dropdown>
            <span class="user-profile">
              <el-avatar :size="32" class="neumorphic-inset">U</el-avatar>
              <span>{{ userName }}</span>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="handleLogout">Выйти</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </header>
      
      <div class="content-area">
        <slot></slot>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUser } from '@/common/composables/useUser'

const route = useRoute()
const router = useRouter()
const { logout } = useUser()

const currentRoute = computed(() => route.path)
const userName = computed(() => 'User Name')

const mainRoutes = [
  { path: '/dashboard', name: 'Главная', icon: 'el-icon-house' },
  { path: '/news', name: 'Новости', icon: 'el-icon-document' },
  { path: '/events', name: 'События', icon: 'el-icon-calendar' },
  { path: '/profile', name: 'Профиль', icon: 'el-icon-user' }
]

const handleLogout = async () => {
  await logout()
  router.push('/login')
}
</script>

<style scoped lang="scss">
.layout {
  display: grid;
  grid-template-columns: 250px 1fr;
  min-height: 100vh;
  background: var(--surface-light);
  gap: 20px;
  padding: 20px;
}

.sidebar {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 32px;
  position: sticky;
  top: 20px;
  height: calc(100vh - 40px);

  .logo {
    padding-bottom: 16px;
    border-bottom: 1px solid var(--emerald-primary);
    h2 {
      margin: 0;
    }
  }
}

.nav-links {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  text-decoration: none;
  color: var(--text-dark);
  border-radius: 8px;
  transition: all 0.3s ease;

  &:hover, &.active {
    background: var(--emerald-primary);
    color: var(--text-light);
    box-shadow: 
      4px 4px 8px var(--shadow-dark),
      -4px -4px 8px var(--shadow-light);
  }

  i {
    font-size: 20px;
  }
}

.main-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 1200px;
}

.top-bar {
  padding: 16px 24px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.user-controls {
  .user-profile {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    padding: 8px;
    border-radius: 24px;
    transition: all 0.3s ease;

    &:hover {
      background: var(--emerald-light);
    }
  }
}

.content-area {
  background: var(--surface-light);
  border-radius: 20px;
  padding: 24px;
  min-height: calc(100vh - 140px);
}

@media (max-width: 768px) {
  .layout {
    grid-template-columns: 1fr;
  }

  .sidebar {
    display: none;
  }
}
</style>
