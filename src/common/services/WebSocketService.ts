
import { io } from 'socket.io-client'

class WebSocketService {
  private socket: any

  constructor() {
    this.socket = io(import.meta.env.VITE_API_URL)
    
    this.socket.on('connect', () => {
      console.log('Connected to WebSocket')
    })
  }

  subscribeToUpdates(userId: string) {
    this.socket.emit('subscribe', { userId })
  }

  unsubscribeFromUpdates(userId: string) {
    this.socket.emit('unsubscribe', { userId })
  }
}

export const webSocketService = new WebSocketService()
