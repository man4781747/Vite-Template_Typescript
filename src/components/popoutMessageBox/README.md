# 🧩 Popout Notification System for Vue 3/TypeScript

這是一個可插拔的彈出式通知元件系統，支援多種訊息類型（成功、錯誤、警告等），能在畫面右上方以動畫顯示簡短訊息，並在設定時間後自動淡出。適用於任何 Vue 3 專案。

---

## 📦 檔案結構
```
components/
├── popoutMessageBox.vue # 單一訊息顯示元件（動畫、內容、計時控制）
├── popoutMessageService.ts # 訊息建立邏輯與外部調用接口
└── PopoutNotifyPlugin.ts # Vue 插件，提供 inject 用的全域通知服務
```

---

## 🚀 安裝與使用

### 1️⃣ 安裝插件（main.ts）

```ts
import { createApp } from 'vue'
import App from './App.vue'
import PopoutNotifyPlugin from '@/components/popoutMessageBox/PopoutNotifyPlugin'

const app = createApp(App)
app.use(PopoutNotifyPlugin)
app.mount('#app')
```

### 2️⃣ 在組件中使用通知功能
範例1
```ts
import { usePopoutNotify } from '@/components/popoutMessageBox/PopoutNotifyPlugin'

export default {
  setup() {
    const notify = usePopoutNotify()
    notify.success('儲存成功', '資料已更新')
    notify.error('儲存失敗', '請稍後再試', 10)
  }
}
```
範例2
```ts
<script setup lang="ts">
  const { count, add, logMsg } = useCounter()
  import { usePopoutNotify } from '@/components/popoutMessageBox/PopoutMessagePlugin'
  const $notify = usePopoutNotify()
</script>

<template>
  <div class="container">
    <div class="row">
      <div class="col">
        <div class="input-group mb-3">
          <input type="text" class="form-control" v-model="logMsg">
          <button class="btn btn-success" @click="$notify.success(logMsg, 'Success訊息', 10)">Success訊息</button>
          <button class="btn btn-danger" @click="$notify.error(logMsg, 'Error訊息', 10)">Error/Fail訊息</button>
          <button class="btn btn-info" @click="$notify.info(logMsg, 'Info訊息', 10)">Info訊息</button>
          <button class="btn btn-warning" @click="$notify.warning(logMsg, 'Waring訊息', 10)">Warning訊息</button>
          <button class="btn btn-secondary" @click="$notify.debug(logMsg, 'Debug訊息', 10)">Debug訊息</button>
          <button class="btn btn-primary" @click="$notify.primary(logMsg, 'Primary訊息', 10)">Primary訊息</button>
        </div>
      </div>
    </div>
  </div>
</template>
```
