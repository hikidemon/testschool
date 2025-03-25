
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '@/common/utils/AxiosService'

export interface UserData {
  id: string
  name: string
  email: string
  phone: string
  surname: string
  role: string
  school?: string
  class?: string
  address?: string
  groups?: string[]
}

export const useUser = () => {
  const router = useRouter()
  const currentUser = ref<UserData | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const fullName = computed(() => {
    if (!currentUser.value) return ''
    return `${currentUser.value.surname} ${currentUser.value.name}`
  })

  const fetchUserData = async () => {
    isLoading.value = true
    error.value = null
    try {
      const { data } = await api.get('/api/user/profile')
      currentUser.value = data
    } catch (err) {
      error.value = 'Ошибка загрузки данных пользователя'
      console.error(err)
    } finally {
      isLoading.value = false
    }
  }

  const updateUserData = async (userData: Partial<UserData>) => {
    isLoading.value = true
    error.value = null
    try {
      const { data } = await api.patch('/api/user/profile', userData)
      currentUser.value = { ...currentUser.value, ...data }
      return true
    } catch (err) {
      error.value = 'Ошибка обновления данных'
      return false
    } finally {
      isLoading.value = false
    }
  }

  return {
    currentUser,
    isLoading,
    error,
    fullName,
    fetchUserData,
    updateUserData
  }
}
