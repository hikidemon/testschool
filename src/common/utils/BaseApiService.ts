
import type { AxiosRequestConfig } from 'axios'
import { AxiosService, type ServiceResponseType, type ApiResponseType } from './AxiosService'

export class BaseApiService extends AxiosService {
  protected endpoint: string

  constructor(endpoint: string) {
    super()
    this.endpoint = endpoint
  }

  protected async get<T>(path = '', config: AxiosRequestConfig = {}): ServiceResponseType<ApiResponseType<T>> {
    return this.axiosCall<ApiResponseType<T>>({
      method: 'GET',
      url: `${this.endpoint}${path}`,
      ...config
    })
  }

  protected async post<T>(path = '', data?: unknown, config: AxiosRequestConfig = {}): ServiceResponseType<ApiResponseType<T>> {
    return this.axiosCall<ApiResponseType<T>>({
      method: 'POST',
      url: `${this.endpoint}${path}`,
      data,
      ...config
    })
  }

  protected async put<T>(path = '', data?: unknown, config: AxiosRequestConfig = {}): ServiceResponseType<ApiResponseType<T>> {
    return this.axiosCall<ApiResponseType<T>>({
      method: 'PUT',
      url: `${this.endpoint}${path}`,
      data,
      ...config
    })
  }

  protected async patch<T>(path = '', data?: unknown, config: AxiosRequestConfig = {}): ServiceResponseType<ApiResponseType<T>> {
    return this.axiosCall<ApiResponseType<T>>({
      method: 'PATCH',
      url: `${this.endpoint}${path}`,
      data,
      ...config
    })
  }

  protected async delete<T>(path = '', config: AxiosRequestConfig = {}): ServiceResponseType<ApiResponseType<T>> {
    return this.axiosCall<ApiResponseType<T>>({
      method: 'DELETE',
      url: `${this.endpoint}${path}`,
      ...config
    })
  }
}
