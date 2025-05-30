// 從 Vitest 套件中匯入測試函式
import { describe, it, expect, beforeEach } from 'vitest'
// 匯入 Pinia 的函數用來在測試中建立與啟用 store 環境
import { setActivePinia, createPinia } from 'pinia'
// 匯入欲測試的 store（這裡是 counter store）
// 注意：若檔案路徑不同，需調整 import 路徑
import { useCounterStore } from './counter'

/**
 * describe(...): 是測試群組的容器（test suite）
 * 用來對「Counter Store」這個 store 寫一組相關測試
 * 可視為「Counter store 的行為規格描述」
 */
describe('Counter Store', () => {
  /**
   * beforeEach(): 每個 it(...) 測試執行前都會跑一次
   * createPinia(): 建立一個全新的 Pinia 實例（避免測試污染）
   * setActivePinia(...): 設定為當前測試上下文中的作用中 Pinia
   * 確保每個測試都獨立、乾淨、不被前一個測試影響
   */
  beforeEach(() => {
    // 每個測試前都重新建立一個新的 Pinia 環境
    setActivePinia(createPinia())
  })
  // 測試 1：確認初始狀態
  it('initializes with count 0', () => {
    const store = useCounterStore() // 取得 store 實例
    expect(store.count).toBe(0)     // 預期初始值為 0
  })

  // 測試 2：執行 increment 行為後，count 是否加 1
  it('increments the count', () => {
    const store = useCounterStore()
    store.increment()
    expect(store.count).toBe(1)
  })
  // 測試 3：確認 getter 是否正確回傳 count 值
  it('getter currentCount returns the count', () => {
    const store = useCounterStore()
    expect(store.currentCount).toBe(0)
    store.increment()
    expect(store.currentCount).toBe(1)
  })
})