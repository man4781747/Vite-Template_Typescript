// 匯入 createApp 與 h 函數：
// - createApp: 用來動態建立一個新的 Vue 應用（Component 實例）
// - h: 是 Vue 的虛擬 DOM 建立函數 (hyperscript)，用於手動渲染元件
import { render, createVNode  } from 'vue'
// 匯入自定義的元件 websocketManagerItem
import websocketManagerItem from '@/components/websocketManager/websocketManagerItem.vue'
// 匯入 websocketManagerPlugin
import { getWebsocketManagerRootApp } from './websocketManagerPlugin'
import { ref, watch } from 'vue'

// 響應式狀態

/**
 * 此服務的 websocket 實體
 */
const socket = ref<WebSocket | null>(null)
/**
 * 此服務的 websocket url
 */
const websocketUrl = ref<string>('ws://192.168.20.38/ws')
/**
 * 此服務的 websocket 是否處於連線狀況
 */
const isConnected = ref(false)
/**
 * 此服務的 websocket 連線狀態
 */
const connectionStatus = ref('disconnected')
/**
 * 此服務的 websocket 連線狀態文字
 */
const connectionStatusText = ref('未連接')
/**
 * 此服務的 websocket 最後更新時間
 */
const lastUpdateTime = ref('尚未連接')

const connectWebsocket = () => {
  disconnectWebsocket()
  try {
    const newSocket = new WebSocket(websocketUrl.value)
    setSocket(newSocket)
  } catch (error) {
    console.error('WebSocket 連接失敗:', error)
  }
}

const disconnectWebsocket = () => {
  if (isConnected.value) {
    if (socket.value) {
      socket.value.close()
      setSocket(null)
    }
  }
}

// 更新最後更新時間
const updateLastUpdateTime = () => {
  const now = new Date()
  lastUpdateTime.value = now.toLocaleTimeString()
}

// 設置 socket 事件監聽器
const setupSocketListeners = (socket: WebSocket) => {
  socket.onopen = () => {
    isConnected.value = true
    connectionStatus.value = 'connected'
    connectionStatusText.value = '已連接'
    console.log("socket 連線成功，若要進一步使用websocket功能，請設計 socket.onmessage 設定")
  }

  socket.onclose = () => {
    isConnected.value = false
    connectionStatus.value = 'disconnected'
    connectionStatusText.value = '已斷開'
    console.log("socket 斷開連線")
  }

  socket.onerror = () => {
    connectionStatus.value = 'error'
    connectionStatusText.value = '連接錯誤'
    console.log("socket 連接錯誤")
  }
}

// 監聽 socket 變化
watch(socket, (newSocket, oldSocket) => {
  console.log('Socket 狀態變化:', {
    old: oldSocket,
    new: newSocket,
    url: websocketUrl.value
  })
  updateLastUpdateTime()

  if (!newSocket) {
    // 當 socket 被設為 null 時，重置狀態
    isConnected.value = false
    connectionStatus.value = 'disconnected'
    connectionStatusText.value = '已斷開'
  } else {
    setupSocketListeners(newSocket)
  }
}, { immediate: true, deep: true })

/**
 * 設置 socket 
 * 當 socket 有變化時，會觸發 websocketManagerItem 的 socket 變化
 * 並且會觸發 websocketManagerItem 的 onUpdateSocket 事件
 * 
 * @param newSocket 新的 socket
 */
const setSocket = (newSocket: WebSocket | null) => {
  console.log("setSocket", newSocket)
  socket.value = newSocket
}

/**
 * 開啟 websocket 管理器視窗
 */
const openWindow = () => {
  let container = document.getElementById('akira-c-websocket-manager-container')
  if (!container) {
    container = document.createElement('div')
    container.id = 'akira-c-websocket-manager-container'
    document.body.appendChild(container)
    const vnode = createVNode(websocketManagerItem)
    vnode.appContext = getWebsocketManagerRootApp()._context
    render(vnode, container)
  } else {
    let card = document.getElementById('akira-c-websocket-manager-card')
    if (card) {
      card.classList.remove("not-show")
    }
  }
}

/**
 * 關閉 websocket 管理器視窗
 */
const closeWindow = () => {
  const card = document.getElementById('akira-c-websocket-manager-card')
  if (card) {
    card.classList.add('not-show')
  }
}

// 導出響應式狀態 
export const websocketState = {
  socket,
  websocketUrl,
  isConnected,
  connectionStatus,
  connectionStatusText,
  lastUpdateTime
}

/**
 * 定義 websocket 管理器的方法
 * 
 * @interface WebsocketManagerMethods
 * @property {() => void} openWindow 開啟 websocket 管理器視窗
 * @property {Object} state WebSocket 狀態對象
 * @property {Ref<WebSocket | null>} state.socket WebSocket 實體
 * @property {Ref<string>} state.websocketUrl WebSocket URL
 * @property {Ref<boolean>} state.isConnected 連接狀態
 * @property {Ref<string>} state.connectionStatus 連接狀態代碼
 * @property {Ref<string>} state.connectionStatusText 連接狀態文字
 * @property {Ref<string>} state.lastUpdateTime 最後更新時間
 */
export interface WebsocketManagerMethods {
  openWindow: () => void,
  closeWindow: () => void,
  connectWebsocket: () => void,
  disconnectWebsocket: () => void,
  state: {
    socket: typeof socket,
    websocketUrl: typeof websocketUrl,
    isConnected: typeof isConnected,
    connectionStatus: typeof connectionStatus,
    connectionStatusText: typeof connectionStatusText,
    lastUpdateTime: typeof lastUpdateTime
  }
}


/**
 * 導出 websocket 管理器
 * 
 * @type {WebsocketManagerMethods}
 */
export const websocketManager: WebsocketManagerMethods = {
  openWindow: () => openWindow(),
  closeWindow: () => closeWindow(),
  connectWebsocket: () => connectWebsocket(),
  disconnectWebsocket: () => disconnectWebsocket(),
  state: websocketState
}