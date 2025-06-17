# WebSocket 管理器

一個用於管理 WebSocket 連接的 Vue 3 組件，提供視覺化界面和完整的連接狀態管理。

## 功能特點

- 提供視覺化的 WebSocket 連接管理界面
- 實時顯示連接狀態和最後更新時間
- 支持動態更改 WebSocket URL
- 完整的 TypeScript 支持
- 響應式狀態管理
- 簡單易用的 API

## 安裝

確保已安裝必要的依賴：

```bash
npm install vue@3
```

## 使用方法

### 基本使用

```typescript
import { useWebsocketManager } from '@/components/websocketManager/websocketManagerPlugin'

// 在組件中使用
const wsManager = useWebsocketManager()

// 打開管理器視窗
wsManager.openWindow()

// 關閉管理器視窗
wsManager.closeWindow()

// 建立連接
wsManager.connectWebsocket()

// 斷開連接
wsManager.disconnectWebsocket()
```

### 監聽 WebSocket 狀態

```typescript
import { useWebsocketManager } from '@/components/websocketManager/websocketManagerPlugin'
import { watch } from 'vue'

const wsManager = useWebsocketManager()

// 監聽連接狀態
watch(() => wsManager.state.isConnected.value, (isConnected) => {
  if (isConnected) {
    console.log('WebSocket 已連接')
  } else {
    console.log('WebSocket 已斷開')
  }
})

// 監聽連接狀態文字
watch(() => wsManager.state.connectionStatusText.value, (status) => {
  console.log('連接狀態：', status)
})
```

### 自定義消息處理

```typescript
import { useWebsocketManager } from '@/components/websocketManager/websocketManagerPlugin'
import { watch } from 'vue'

const wsManager = useWebsocketManager()

// 監聽 socket 變化並設置消息處理
watch(() => wsManager.state.socket.value, (socket) => {
  if (socket) {
    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        console.log('收到消息：', data)
        // 處理接收到的消息
      } catch (error) {
        console.error('消息解析錯誤：', error)
      }
    }
  }
})
```

### 發送消息

```typescript
import { useWebsocketManager } from '@/components/websocketManager/websocketManagerPlugin'

const wsManager = useWebsocketManager()

// 發送消息
const sendMessage = (message: any) => {
  if (wsManager.state.socket.value && wsManager.state.isConnected.value) {
    wsManager.state.socket.value.send(JSON.stringify(message))
  } else {
    console.warn('WebSocket 未連接，無法發送消息')
  }
}
```

## API 參考

### websocketManager 方法

- `openWindow()`: 打開 WebSocket 管理器視窗
- `closeWindow()`: 關閉 WebSocket 管理器視窗
- `connectWebsocket()`: 建立 WebSocket 連接
- `disconnectWebsocket()`: 斷開 WebSocket 連接

### websocketState 狀態

- `socket`: WebSocket 實體
- `websocketUrl`: WebSocket 連接地址
- `isConnected`: 連接狀態（布爾值）
- `connectionStatus`: 連接狀態代碼（'connected' | 'disconnected' | 'error'）
- `connectionStatusText`: 連接狀態文字
- `lastUpdateTime`: 最後更新時間

## 事件監聽

WebSocket 管理器會自動處理以下事件：

- `onopen`: 連接建立時
- `onclose`: 連接關閉時
- `onerror`: 發生錯誤時

## 注意事項

1. 確保 WebSocket 服務器地址正確配置
2. 在組件銷毀時記得斷開連接
3. 處理消息時注意錯誤處理
4. 使用 TypeScript 時注意類型定義

## 示例

### 完整使用示例

```vue
<template>
  <div>
    <button @click="wsManager.openWindow">打開管理器</button>
    <button @click="sendTestMessage" :disabled="!wsManager.state.isConnected.value">
      發送測試消息
    </button>
    <div>連接狀態：{{ wsManager.state.connectionStatusText.value }}</div>
  </div>
</template>

<script setup lang="ts">
import { useWebsocketManager } from '@/components/websocketManager/websocketManagerPlugin'
import { onMounted, onUnmounted } from 'vue'

const wsManager = useWebsocketManager()

// 發送測試消息
const sendTestMessage = () => {
  if (wsManager.state.socket.value && wsManager.state.isConnected.value) {
    wsManager.state.socket.value.send(JSON.stringify({
      type: 'test',
      data: 'Hello WebSocket!'
    }))
  }
}

// 組件掛載時自動連接
onMounted(() => {
  wsManager.connectWebsocket()
})

// 組件卸載時斷開連接
onUnmounted(() => {
  wsManager.disconnectWebsocket()
})
</script>
```

## 貢獻

歡迎提交 Issue 和 Pull Request。

## 授權

MIT License 