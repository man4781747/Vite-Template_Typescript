import { createApp, h, type App as VueApp } from 'vue';
import WebSocketManagerComponent from './WebSocketManager.vue'; // The .vue component

const WEBSOCKET_MANAGER_CONTAINER_ID = 'websocket-manager-container';

export class WebSocketUIManager {
  private mountedApp: VueApp | null = null;
  private containerElement: HTMLElement | null = null;

  public isPanelVisible(): boolean {
    return !!this.mountedApp && !!this.containerElement;
  }

  public showManager(): void {
    if (this.isPanelVisible()) {
      // Focus or bring to front if needed, for now, just return
      return;
    }

    this.containerElement = document.createElement('div');
    this.containerElement.id = WEBSOCKET_MANAGER_CONTAINER_ID;
    document.body.appendChild(this.containerElement);

    // Create a new Vue application instance for the WebSocketManager component
    this.mountedApp = createApp({
      render: () => h(WebSocketManagerComponent, {
        // Listen for the 'close-panel' event emitted by WebSocketManager.vue
        onClosePanel: () => {
          this.hideManager();
        }
      })
    });

    // Mount the app to the container
    this.mountedApp.mount(this.containerElement);
  }

  public hideManager(): void {
    if (!this.isPanelVisible() || !this.containerElement || !this.mountedApp) {
      return;
    }

    // Unmount the Vue application
    this.mountedApp.unmount();
    this.mountedApp = null;

    // Remove the container element from the DOM
    if (this.containerElement.parentNode) {
      this.containerElement.parentNode.removeChild(this.containerElement);
    }
    this.containerElement = null;
  }

  public toggleManager(): void {
    if (this.isPanelVisible()) {
      this.hideManager();
    } else {
      this.showManager();
    }
  }
}

// Export a singleton instance of the manager
export const webSocketUIManager = new WebSocketUIManager();
