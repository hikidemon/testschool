
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
  const retryCount = ref(0)

  const fullName = computed(() => {
    if (!currentUser.value) return ''
    return `${currentUser.value.surname} ${currentUser.value.name}`
  })

  const fetchUserData = async (retry = true) => {
    isLoading.value = true
    error.value = null
    try {
      const { data } = await api.get('/api/user/profile')
      currentUser.value = data
      retryCount.value = 0
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Ошибка загрузки данных пользователя'
      if (retry && retryCount.value < 3 && err.response?.status !== 401) {
        retryCount.value++
        setTimeout(() => fetchUserData(true), 1000 * retryCount.value)
      }
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
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Ошибка обновления данных'
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
