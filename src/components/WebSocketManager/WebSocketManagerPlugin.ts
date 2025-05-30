import { App, inject, InjectionKey } from 'vue';
import { webSocketService, type WebSocketService } from '@/websocket/WebSocketService'; // Adjust path if necessary
import { webSocketUIManager, type WebSocketUIManager } from './WebSocketUIManager';

// 1. Define the InjectionKey for WebSocketService
export const WebSocketManagerInjectionKey: InjectionKey<WebSocketService> = Symbol('WebSocketManager');

// 2. Define the InjectionKey for WebSocketUIManager
export const WebSocketUIManagerInjectionKey: InjectionKey<WebSocketUIManager> = Symbol('WebSocketUIManager');

// 3. Define the plugin object
const WebSocketManagerPlugin = {
  install: (app: App) => {
    app.provide(WebSocketManagerInjectionKey, webSocketService);
    app.provide(WebSocketUIManagerInjectionKey, webSocketUIManager);
  },
};

// 4. Define the composable function for WebSocketService injection
export function useWebSocketManager(): WebSocketService {
  const manager = inject(WebSocketManagerInjectionKey);
  if (!manager) {
    // This error signifies that the plugin hasn't been installed or used correctly.
    throw new Error('WebSocketManager service not provided. Did you forget to install the WebSocketManagerPlugin? app.use(WebSocketManagerPlugin)');
  }
  return manager;
}

// 5. Define the composable function for WebSocketUIManager injection
export function useWebSocketUIManager(): WebSocketUIManager {
  const uiManager = inject(WebSocketUIManagerInjectionKey);
  if (!uiManager) {
    throw new Error('WebSocketUIManager not provided via WebSocketManagerPlugin.');
  }
  return uiManager;
}

// Export the plugin as default
export default WebSocketManagerPlugin;
