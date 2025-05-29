type WebSocketEventHandler = (event: Event | MessageEvent<any>) => void

interface WebSocketOptions {
  url: string
  reconnectInterval?: number // ms
  maxReconnectAttempts?: number
  debug?: boolean
}

export class WebSocketClient {
  private ws: WebSocket | null = null
  private url: string
  private reconnectInterval: number
  private maxReconnectAttempts: number
  private reconnectAttempts = 0
  private shouldReconnect = true
  private debug: boolean

  private onOpenCallback: WebSocketEventHandler | null = null
  private onMessageCallback: WebSocketEventHandler | null = null
  private onCloseCallback: WebSocketEventHandler | null = null
  private onErrorCallback: WebSocketEventHandler | null = null

  constructor(options: WebSocketOptions) {
    this.url = options.url
    this.reconnectInterval = options.reconnectInterval ?? 3000
    this.maxReconnectAttempts = options.maxReconnectAttempts ?? Infinity
    this.debug = options.debug ?? false

    this.connect()
  }

  private log(...args: any[]) {
    if (this.debug) console.log('[WebSocketClient]', ...args)
  }

  private connect() {
    this.ws = new WebSocket(this.url)

    this.ws.onopen = (e) => {
      this.log('connected')
      this.reconnectAttempts = 0
      this.onOpenCallback?.(e)
    }

    this.ws.onmessage = (e) => {
      this.onMessageCallback?.(e)
    }

    this.ws.onclose = (e) => {
      this.log('connection closed', e)
      this.onCloseCallback?.(e)
      if (this.shouldReconnect && this.reconnectAttempts < this.maxReconnectAttempts) {
        setTimeout(() => this.reconnect(), this.reconnectInterval)
      }
    }

    this.ws.onerror = (e) => {
      this.log('error', e)
      this.onErrorCallback?.(e)
    }
  }

  private reconnect() {
    this.reconnectAttempts++
    this.log(`reconnecting... attempt ${this.reconnectAttempts}`)
    this.connect()
  }

  public setUrl(url: string) {
    this.url = url
  }

  public send(data: string) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(data)
    } else {
      this.log('send failed, not connected')
    }
  }

  public close() {
    this.shouldReconnect = false
    this.ws?.close()
  }

  public isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN
  }

  // 註冊事件回調
  public onOpen(callback: WebSocketEventHandler) {
    this.onOpenCallback = callback
  }

  public onMessage(callback: WebSocketEventHandler) {
    this.onMessageCallback = callback
  }

  public onClose(callback: WebSocketEventHandler) {
    this.onCloseCallback = callback
  }

  public onError(callback: WebSocketEventHandler) {
    this.onErrorCallback = callback
  }
}

