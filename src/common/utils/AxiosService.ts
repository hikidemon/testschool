import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { useUserStore } from '@/store/user'
import router from '@/router'
import { ElNotification } from 'element-plus' // Added import for ElNotification

export type ApiResponseType<T = unknown> = {
  data: T
  status: number
  message?: string
}

export type ApiErrorType = {
  message: string
  code?: string
  errors?: Record<string, string[]>
}

export type ServiceResponseType<T> = Promise<[AxiosError<ApiErrorType> | null, T | null]>

export class AxiosService {
  private static instance: AxiosInstance

  public static getInstance(): AxiosInstance {
    if (!this.instance) {
      this.instance = axios.create({
        baseURL: import.meta.env.VITE_API_URL,
        timeout: 15000,
        headers: {
          'Content-Type': 'application/json'
        }
      })

      this.setupInterceptors()
    }
    return this.instance
  }

  private static setupInterceptors() {
    this.instance.interceptors.request.use(
      (config) => {
        const userStore = useUserStore()
        const token = userStore.token
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => Promise.reject(error)
    )

    this.instance.interceptors.response.use(
      (response) => response,
      async (error: AxiosError<ApiErrorType>) => {
        this.handleError(error) // Call the handleError method
        return Promise.reject(error)
      }
    )
  }

  private static handleError(error: AxiosError<ApiErrorType>): void { // Added static keyword
    const userStore = useUserStore()

    switch (error.response?.status) {
      case 401:
        userStore.logout()
        router.push('/auth')
        this.showNotification('Ошибка авторизации', 'error')
        break
      case 403:
        this.showNotification('Нет доступа к ресурсу', 'error')
        break
      case 404:
        this.showNotification('Ресурс не найден', 'error')
        break
      case 500:
        this.showNotification('Ошибка сервера', 'error')
        break
      default:
        this.showNotification('Произошла ошибка', 'error')
    }
  }

  private static showNotification(message: string, type: 'success' | 'warning' | 'info' | 'error'): void { // Added static keyword
    ElNotification({
      title: 'Уведомление',
      message,
      type,
      duration: 3000
    })
  }

  protected async axiosCall<T>(config: AxiosRequestConfig): ServiceResponseType<T> {
    try {
      const response = await this.getInstance().request<T>(config)
      return [null, response.data]
    } catch (error) {
      return [error as AxiosError<ApiErrorType>, null]
    }
  }
}

export const api = AxiosService.getInstance()

export const API_CONFIG = {
  // Add your API configuration here if needed.
};