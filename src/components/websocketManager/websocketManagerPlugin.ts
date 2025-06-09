// 從 Vue 套件中匯入必要的型別與函數
// - App: 表示整個 Vue 應用實體，用於安裝插件
// - inject: 用於從依賴注入中取得先前被提供的資源
// - InjectionKey: 是 Vue 提供的泛型工具，用來讓 TypeScript 知道注入的是什麼型別
import { type App, inject, type InjectionKey } from 'vue'

// 匯入我們自定義的 websocketManager 服務與其方法型別
// - websocketManager 是實作通知邏輯的對象
// - WebsocketManagerMethods 則定義這個系統有哪些可以用的方法（例如 show(), hide() 等）
import { websocketManager, type WebsocketManagerMethods } from './websocketManagerService'

// 建立一個唯一的 InjectionKey，用來作為 provide/inject 的鍵值
// 這樣可以避免 key 重複問題，也能提供更安全的型別提示
export const WebsocketManagerInjectionKey: InjectionKey<WebsocketManagerMethods> = Symbol('WebsocketManager')

let _app: App | null = null

// 提供一個 getter 讓其他模組取得 app
export function getWebsocketManagerRootApp(): App {
  if (!_app) {
    throw new Error('Root App 尚未初始化，請確認已使用 app.use(WebsocketManagerPlugin)')
  }
  return _app
}

// 匯出一個 Vue 插件（Plugin object）
// 使用者可以在 main.ts 中透過 app.use(...) 註冊這個插件
// 當插件被註冊時，它會將 websocketManager 提供（provide）給整個 Vue 應用
export default {
  install: (app: App) => {
    // 利用 provide 機制，將 websocketManager 實例與 key 綁在一起
    app.provide(WebsocketManagerInjectionKey, websocketManager)
    _app = app // ✅ 儲存 app 供全域使用
    // 這樣在應用中其他地方，只要知道這個 key，就可以 inject 使用 popoutMessage
  },
}

/**
 * 自定義一個 Composition API Hook，名稱為 usePopoutMessage
 * 這個函數讓我們能在 setup() 中簡單地使用 websocketManager 的功能
 * 
 * 例如: 在 main.ts 中
 * 
 * import { usePopoutMessage } from '@/components/popoutMessageBox/PopoutMessagePlugin'
 * 
 * const $notify = usePopoutMessage()
 * 
 * 這樣就能使用 $notify 來操作了
 * 
 * @returns 
 */
export function useWebsocketManager(): WebsocketManagerMethods {
  // 使用 inject() 取出剛才提供（provide）的 popoutMessage 實例
  const notify = inject(WebsocketManagerInjectionKey)
  // 如果沒取到（通常是插件未被註冊），則拋出錯誤提醒開發者
  if (!notify) {
    throw new Error('PopoutMessage service not provided via PopoutMessagePlugin.')
  }
  // 成功取得時，回傳 notify 實例，讓使用者可以直接調用其方法
  return notify
}