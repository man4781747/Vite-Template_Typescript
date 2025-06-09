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

/*
  建立單一通知訊息元件：
  - messageType: 類型（如 success、error）
  - mainString: 主訊息
  - despString: 補充說明（可選）
  - lifeTime: 存活秒數（預設 5 秒）
*/
const openWindow = () => {
  let container = document.getElementById('akira-c-websocket-manager-container')
  if (!container) {
    container = document.createElement('div')
    container.id = 'akira-c-websocket-manager-container'
    document.body.appendChild(container)
    const vnode = createVNode(websocketManagerItem, {})
    // const app = getPopoutRootApp()
    vnode.appContext = getWebsocketManagerRootApp()._context
    render(vnode, container)
  } else {
    document.getElementById('akira-c-websocket-manager-card').classList.remove("not-show")
  }
}

// 定義 popoutMessage 所提供的方法介面：代表彈出訊息可使用的種類
// - mainString: 標題文字或主要訊息
// - despString: 補充說明（可選）
// - lifeTime: 彈出訊息存活時間（秒），預設為 5 秒
export interface WebsocketManagerMethods {
  openWindow: () => void
}

/*
  建立 popoutMessage 這個通知服務對象，實作 WebsocketManagerMethods 介面
  - 每種通知方法都是呼叫 createMessage 並指定對應的樣式類型
  - 這些方法可透過 provide/inject 系統傳遞給整個應用使用
*/
export const websocketManager: WebsocketManagerMethods = {
  openWindow: () => openWindow()
}