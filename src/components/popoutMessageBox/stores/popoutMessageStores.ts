import { defineStore } from 'pinia'

export const usePopoutMessageStores = defineStore('popoutMessageStores', {
    /*
      state: 定義這個 store 管理的狀態（類似 Vue data）
      - 這裡我們定義了一個變數 count，初始值為 0
      - 使用箭頭函式回傳一個新的狀態物件，避免不同組件共享同一實例（防止污染）
    */
    state: () => ({
      count: 0,
    }),
    getters: {
      /*
        getters: 相當於 Vue 的 computed，用來根據 state 計算衍生資料
        - 這裡定義了一個 currentCount getter，實際上只是回傳 count 本身
        - 雖然可以直接用 this.count 取得值，但這種寫法在大型應用有助於封裝與統一存取邏輯
      */
      messageConut: (state) => state.count,
    },
    /*
      actions: 定義對 state 進行操作的行為（邏輯 + 觸發）
      - 可以是同步或非同步函式（支援 async/await）
    */
    actions: {
    },
  })