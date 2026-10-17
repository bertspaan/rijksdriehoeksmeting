import { onBeforeUnmount } from 'vue'
import ReconnectingWebSocket from 'reconnecting-websocket'
import type { ExhibitionMessage } from '../types'

interface SocketOptions {
  onOpen?: () => void
  onMessage?: (message: ExhibitionMessage) => void
}

export function useExhibitionSocket(options: SocketOptions) {
  const url = import.meta.env.VITE_WS_URL || 'wss://rijksdriehoeksmeting-api.glitch.me/ws'
  const socket = new ReconnectingWebSocket(url)

  socket.addEventListener('open', () => options.onOpen?.())
  socket.addEventListener('message', (event) => {
    let message: ExhibitionMessage
    try {
      message = JSON.parse(event.data)
    } catch {
      return
    }
    if (!message || typeof message !== 'object') return
    options.onMessage?.(message)
  })

  onBeforeUnmount(() => socket.close())

  function send(type: 'client' | 'display', data?: number[]) {
    socket.send(JSON.stringify({ type, timestamp: Date.now(), data }))
  }

  return { send }
}
