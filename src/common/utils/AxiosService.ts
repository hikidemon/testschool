
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { useUserStore } from '@/store/user'
import router from '@/router'

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
        if (error.response?.status === 401) {
          const userStore = useUserStore()
          await userStore.logout()
          router.push('/login')
        } else if (error.response?.status === 403) {
          router.push('/forbidden')
        }
        return Promise.reject(error)
      }
    )
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
