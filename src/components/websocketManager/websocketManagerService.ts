// 匯入 createApp 與 h 函數：
// - createApp: 用來動態建立一個新的 Vue 應用（Component 實例）
// - h: 是 Vue 的虛擬 DOM 建立函數 (hyperscript)，用於手動渲染元件
import { render, createVNode  } from 'vue'
// 匯入自定義的通知元件 PopoutMessageBox（彈出通知 UI）
import websocketManagerItem from '@/components/websocketManager/websocketManagerItem.vue'
// 匯入 uuid 套件來產生唯一 ID，避免 DOM 元素 ID 衝突，以及提供後續操作的依據
import { v4 as uuidv4 } from 'uuid'
/* 
  建立或取得通知用的容器（div#popout-message-box-list）
  - 若已有該容器，直接回傳它；
  - 若尚未建立，則建立新的 div 加入至 <body>
*/
import { getWebsocketManagerRootApp } from './websocketManagerPlugin'
import { Socket } from 'dgram'
import { ref, computed } from 'vue'

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
    updateLastUpdateTime()
  }

  socket.onclose = () => {
    isConnected.value = false
    connectionStatus.value = 'disconnected'
    connectionStatusText.value = '已斷開'
    updateLastUpdateTime()
  }

  socket.onerror = () => {
    connectionStatus.value = 'error'
    connectionStatusText.value = '連接錯誤'
    updateLastUpdateTime()
  }
}

const setWebsocketUrl = (url: string) => {
  websocketUrl.value = url
}

const getSocket = () => {
  return socket.value
}

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
  if (newSocket) {
    setupSocketListeners(newSocket)
  } else {
    isConnected.value = false
    connectionStatus.value = 'disconnected'
    connectionStatusText.value = '已斷開'
    updateLastUpdateTime()
  }
}

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

export interface WebsocketManagerMethods {
  openWindow: () => void,
  getSocket:() => WebSocket | null,
  setWebsocketUrl: (url: string) => void,
  setSocket: (socket: WebSocket | null) => void,
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

export const websocketManager: WebsocketManagerMethods = {
  openWindow: () => openWindow(),
  getSocket: () => getSocket(),
  setWebsocketUrl: (url: string) => setWebsocketUrl(url),
  setSocket: (socket: WebSocket | null) => setSocket(socket),
}