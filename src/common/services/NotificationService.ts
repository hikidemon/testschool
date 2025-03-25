
import axios from 'axios'
import { ElNotification } from 'element-plus'

export class NotificationService {
  static async updateNotificationSettings(settings: {
    method: 'email' | 'telegram'
    telegramId?: string
    email?: string
    notifications: {
      schedule: boolean
      news: boolean
      events: boolean
    }
  }) {
    try {
      await axios.post('/api/notifications/settings', settings)
      ElNotification({
        title: 'Успешно',
        message: 'Настройки уведомлений обновлены',
        type: 'success'
      })
    } catch (error) {
      ElNotification({
        title: 'Ошибка',
        message: 'Не удалось обновить настройки',
        type: 'error'
      })
    }
  }

  static async sendNotification(data: {
    userId: string
    type: 'schedule' | 'news' | 'event'
    title: string
    message: string
  }) {
    try {
      await axios.post('/api/notifications/send', data)
      return true
    } catch (error) {
      console.error('Failed to send notification:', error)
      return false
    }
  }
}
