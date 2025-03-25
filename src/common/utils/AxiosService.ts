import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { useUserStore } from '@/store/user'
import router from '@/router'

export type ApiResponseType<T = unknown> = {
  data: T
  status: number
  message?: string
}

export class AxiosService {
  private static instance: AxiosInstance

  public static getInstance(): AxiosInstance {
    if (!this.instance) {
      this.instance = axios.create({
        baseURL: import.meta.env.VITE_API_URL,
        timeout: 10000,
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
      async (error: AxiosError) => {
        if (error.response?.status === 401) {
          const userStore = useUserStore()
          userStore.logout()
          router.push('/login')
        }
        return Promise.reject(error)
      }
    )
  }
}

export const api = AxiosService.getInstance()