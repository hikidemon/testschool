
import axios from 'axios'
import { ElNotification } from 'element-plus'

export class NotificationService {
  static async updateNotificationSettings(settings: {
    method: 'email' | 'telegram'
    telegramId?: string
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

  static async sendInvite(childId: number) {
    try {
      await axios.post(`/api/children/${childId}/invite`)
      return true
    } catch (error) {
      throw new Error('Failed to send invite')
    }
  }
}
