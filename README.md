# Vite + Vue 3 + TypeScript 模板

本專案旨在提供一個功能豐富的現代 Vue.js 3 應用程式入門模板，利用 Vite 實現快速建置，並透過 TypeScript 提升程式碼的類型安全性。

## 環境準備與啟動

在開始之前，請確保您的開發環境已安裝 Node.js 和 npm。建議使用 Node Version Manager (NVM) 來管理 Node.js 版本。

**安裝與設定步驟：**

1.  **安裝 Node.js 18 (若尚未使用 NVM):**
    ```bash
    nvm install 18
    ```
2.  **切換至 Node.js 18:**
    ```bash
    nvm use 18
    ```
3.  **安裝專案依賴:**
    ```bash
    npm install
    ```
4.  **啟動開發伺服器:**
    ```bash
    npm run dev
    ```
    啟動後，您可以在瀏覽器中開啟指定的網址（通常是 `http://localhost:5173`）查看應用程式。

## 專案結構概覽

以下是本模板主要目錄結構及其用途：

- `public/`: 用於存放靜態資源，這些資源在建置時會被直接複製到最終的輸出目錄。
- `src/`: 應用程式的主要原始碼目錄。
  - `src/assets/`: 用於存放會被 Vite 處理的靜態資源（例如：圖片、字型）。
  - `src/components/`: 存放可重用的 Vue 元件。
    - `popoutMessageBox/`: 提供一個彈出式訊息提示框 UI 元件。
  - `src/pages/` (或 `src/views/`): 存放路由級別的頁面元件。
  - `src/router/`: 包含 Vue Router 的設定檔案 (`index.ts`)。
  - `src/store/`: 包含 Vuex 狀態管理設定（未來計畫遷移至 Pinia）。
  - `src/websocket/`: 包含 WebSocket 客戶端輔助程式。
- `App.vue`: 應用程式的根 Vue 元件。
- `main.ts`: 應用程式的進入點。

## 主要功能特性

本模板整合了多項現代前端開發常用工具與功能：

- **Vue 3:** 採用最新的 Vue.js 版本，提供更佳的效能與開發體驗。
- **Vite:** 極速的開發伺服器與建置工具，大幅縮短啟動與熱更新時間。
- **TypeScript:** 為 JavaScript 添加靜態類型檢查，提升程式碼的健壯性與可維護性。
- **Vue Router:** 用於實現客戶端路由功能。
- **Vuex (即將遷移至 Pinia):** 提供集中的狀態管理方案。目前使用 Vuex，未來計畫遷移至 Pinia 以獲得更簡潔的 API 和完整的 TypeScript 支援。
- **Bootstrap 5:** 流行的前端 UI 框架，提供豐富的樣式與元件。
- **Font Awesome:** 提供大量的向量圖示。
- **彈出式訊息框 (`popoutMessageBox`):** 內建於 `src/components/popoutMessageBox` 的通知系統。您可以透過 `HomePage.vue` 中的範例（例如：`window.successLog(...)`, `window.errorLog(...)`）來觸發成功或錯誤等不同類型的訊息提示。
- **WebSocket 客戶端:** 於 `src/websocket/index.ts` 中提供了一個 WebSocket 客戶端輔助程式。在 `App.vue` 中有相關的示範程式碼（預設為註解狀態），您可以取消註解並設定正確的 WebSocket 伺服器 URL 以實現即時通訊功能。

## 開發指南

### 新增頁面

1.  在 `src/pages/` 目錄下建立一個新的 `.vue` 檔案（例如：`MyNewPage.vue`）。
2.  開啟 `src/router/index.ts` 檔案。
3.  匯入您剛建立的頁面元件：
    ```typescript
    import MyNewPage from '../pages/MyNewPage.vue'
    ```
4.  在 `routes` 陣列中新增一個新的路由物件：
    ```typescript
    {
      path: '/my-new-page',
      name: 'MyNewPage',
      component: MyNewPage
    }
    ```

### 新增元件

1.  在 `src/components/` 目錄下建立一個新的 `.vue` 檔案（例如：`MyCustomComponent.vue`）。
2.  在其他元件或頁面中匯入並使用它：

    ```vue
    <script setup lang="ts">
    import MyCustomComponent from '@/components/MyCustomComponent.vue'
    </script>

    <template>
      <MyCustomComponent />
    </template>
    ```

## 可用腳本

在 `package.json` 中定義了以下常用腳本：

- `npm run dev`: 啟動 Vite 開發伺服器，通常用於本地開發。
- `npm run build`: 使用 Vite 將專案建置為生產環境版本。
- `npm run preview`: 在本地預覽生產環境建置後的應用程式。
- `npm run type-check`: 執行 TypeScript 類型檢查。

---

希望這份更新的 README 能幫助您更快上手！