# WebSocket Manager for Vue 3/TypeScript

## Brief Description

The WebSocket Manager is a set of Vue 3 components and services designed to provide an easy-to-integrate UI for managing WebSocket connections within a TypeScript-based Vue application. It allows users to set the WebSocket URL, connect/disconnect, view connection status, configure reconnection attempts, and toggle debug logging for the underlying WebSocket service.

## File Structure

The primary files involved in this WebSocket Manager are:

```
src/
├── components/
│   └── WebSocketManager/
│       ├── WebSocketManager.vue      # The UI component for the control panel.
│       ├── WebSocketManagerPlugin.ts # Vue plugin for service injection.
│       ├── WebSocketUIManager.ts     # Service to manage dynamic mounting/unmounting of the panel.
│       └── README.md                 # This file.
└── websocket/
    ├── WebSocketService.ts         # The core service managing WebSocket logic & state.
    └── index.ts                    # Original WebSocketClient (if used by WebSocketService).
```
*(Note: `websocket/index.ts` refers to the pre-existing `WebSocketClient` which `WebSocketService.ts` encapsulates.)*

## Features

*   **UI Control Panel:** A floating panel to manage WebSocket settings and view status.
*   **Connect/Disconnect:** Buttons to manually initiate or terminate the WebSocket connection.
*   **URL Configuration:** Input field to specify the WebSocket server URL.
*   **Status Display:** Real-time feedback on connection status (Connected, Disconnected, Error, Reconnecting...).
*   **Reconnect Attempts Configuration:** Set the maximum number of times the client should try to reconnect.
*   **Debug Toggle:** Enable or disable verbose logging from the `WebSocketService` for troubleshooting.
*   **Dynamic Panel Management:** The UI panel can be dynamically shown, hidden, or toggled in the DOM.
*   **Last Message Display:** Shows the most recently received WebSocket message when debug mode is active.

## Installation and Usage

Follow these steps to integrate the WebSocket Manager into your Vue 3 application:

### Step 1: Install the Plugin (in `main.ts`)

The plugin makes the `WebSocketService` (for managing connection logic) and `WebSocketUIManager` (for managing the UI panel's visibility) available throughout your application.

```typescript
import { createApp } from 'vue';
import App from './App.vue'; // Or your root component
import router from './router'; // Example if you use Vue Router
import { createPinia } from 'pinia'; // Example if you use Pinia

// Import the WebSocketManagerPlugin
import WebSocketManagerPlugin from '@/components/WebSocketManager/WebSocketManagerPlugin'; // Adjust path if necessary

const app = createApp(App);

// Install other plugins (examples)
// app.use(createPinia());
// app.use(router);

// Install the WebSocketManager plugin
app.use(WebSocketManagerPlugin);

app.mount('#app');
```

### Step 2: Controlling the Panel Visibility

The `WebSocketManager.vue` component is no longer added statically to your application's template. Instead, its presence in the DOM is controlled by the `WebSocketUIManager` service. You can use this service from any component to show, hide, or toggle the panel.

**Example: Adding a toggle button in `App.vue` or any other component:**

```vue
<script setup lang="ts">
import { useWebSocketUIManager } from '@/components/WebSocketManager/WebSocketManagerPlugin'; // Adjust path

const wsUIManager = useWebSocketUIManager();
</script>

<template>
  <div>
    <!-- Button to toggle the WebSocket Manager panel -->
    <button 
      style="position: fixed; top: 10px; left: 10px; z-index: 99999;" 
      @click="wsUIManager.toggleManager()">
      Toggle WebSocket Panel
    </button>

    <!-- Your existing application content -->
    <router-view />
  </div>
</template>
```

The `WebSocketUIManager` provides the following methods:
*   `wsUIManager.showManager()`: Mounts and displays the panel.
*   `wsUIManager.hideManager()`: Unmounts and removes the panel.
*   `wsUIManager.toggleManager()`: Toggles the panel's visibility.
*   `wsUIManager.isPanelVisible()`: Returns `true` if the panel is currently visible.

The panel also has an internal "Close" button (an "X") that will hide the panel by calling `wsUIManager.hideManager()` itself.

### Step 3: Interacting with the WebSocket Connection Logic (Optional)

To interact with the actual WebSocket connection (e.g., send messages, check connection status, set URL programmatically), you use the `useWebSocketManager` composable, which provides access to the `WebSocketService`.

```typescript
// In any component's <script setup lang="ts">
import { computed } from 'vue';
import { useWebSocketManager } from '@/components/WebSocketManager/WebSocketManagerPlugin'; // Adjust path

const wsManager = useWebSocketManager();

// Example: Accessing reactive properties
const isConnected = computed(() => wsManager.isConnected.value);
const lastMessage = computed(() => wsManager.lastMessage.value);

// Example: Calling methods
function sendMessage(payload: string) {
  if (wsManager.isConnected.value) {
    wsManager.send(payload);
  } else {
    console.warn('Cannot send message, WebSocket is not connected.');
  }
}

function connectToService() {
  if (!wsManager.isConnected.value) {
    // You can set URL or other parameters before connecting if needed
    // wsManager.setUrl('ws://custom.example.com');
    wsManager.connect();
  }
}

// Use in your component's logic or template
// console.log('Current WebSocket URL:', wsManager.url.value);
// wsManager.setDebug(true);

// To control the UI panel itself (as shown in Step 2):
// import { useWebSocketUIManager } from '@/components/WebSocketManager/WebSocketManagerPlugin';
// const wsUIManager = useWebSocketUIManager();
// wsUIManager.showManager(); // or .hideManager(), .toggleManager()
</script>
```
It's important to distinguish between:
- `useWebSocketManager()`: For accessing the core `WebSocketService` to manage the WebSocket connection itself.
- `useWebSocketUIManager()`: For accessing the `WebSocketUIManager` to control the visibility of the UI panel.

## Styling

The `WebSocketManager.vue` component comes with basic scoped styling to make the panel functional and visually distinct. The styles are encapsulated within the component using `<style scoped>`. If you need more advanced customization, you can:
1. Modify the scoped styles directly within `WebSocketManager.vue`.
2. Override specific styles using more specific global CSS selectors if necessary (though generally not recommended over direct modification).

## How it Works

*   **`WebSocketManager.vue`**: This is the Vue component that provides the user interface (the floating panel). It interacts with the `WebSocketService` for connection logic and emits a `close-panel` event when its internal close button is clicked.
*   **`WebSocketService.ts`**: This TypeScript class encapsulates all the core WebSocket connection logic and state management (URL, connection status, messages, reconnection attempts, etc.). It is designed as a singleton.
*   **`WebSocketUIManager.ts`**: This service is responsible for dynamically mounting and unmounting the `WebSocketManager.vue` component into the document's body. It listens for the `close-panel` event from the component to automatically hide it.
*   **`WebSocketManagerPlugin.ts`**: This Vue plugin provides both the `WebSocketService` instance (for connection logic) and the `WebSocketUIManager` instance (for UI control) to the entire Vue application using Vue's provide/inject API. The composables `useWebSocketManager()` and `useWebSocketUIManager()` simplify accessing these services.

This separation of concerns makes the system modular: `WebSocketService` handles the connection, `WebSocketManager.vue` provides the UI for that service, `WebSocketUIManager` manages the UI component's lifecycle in the DOM, and the plugin integrates these services with Vue.
