import { ref } from 'vue';
import { WebSocketClient } from './index';

export class WebSocketService {
  public url = ref<string>('ws://echo.websocket.org');
  public isConnected = ref<boolean>(false);
  public maxReconnectAttempts = ref<number>(5);
  public currentReconnectAttempts = ref<number>(0);
  public errorMessage = ref<string | null>(null);
  public debug = ref<boolean>(false);
  public lastMessage = ref<any | null>(null);
  public isConnecting = ref(false);

  private wsClient: WebSocketClient | null = null;

  constructor() {
    // Initialization of reactive properties is done at declaration
  }

  public setUrl(newUrl: string): void {
    this.url.value = newUrl;
    if (this.debug.value) {
      console.log(`WebSocketService: URL set to ${newUrl}. It will be used on the next connection attempt.`);
    }
    // For immediate effect, one might consider:
    // if (this.isConnected.value) {
    //   this.disconnect();
    //   this.connect();
    // }
  }

  public setMaxReconnectAttempts(attempts: number): void {
    this.maxReconnectAttempts.value = attempts;
    if (this.debug.value) {
      console.log(`WebSocketService: Max reconnect attempts set to ${attempts}.`);
    }
  }

  public setDebug(value: boolean): void {
    this.debug.value = value;
    if (this.debug.value) {
      console.log(`WebSocketService: Debug mode ${value ? 'enabled' : 'disabled'}.`);
    }
  }

  public connect(): void {
    this.isConnecting.value = true;

    if (this.isConnected.value) {
      if (this.debug.value) {
        console.log("WebSocketService: Already connected.");
      }
      return;
    }

    if (this.wsClient) {
      this.wsClient.shouldReconnect = false; // Prevent old client from further reconnecting
      this.wsClient.close();
      this.wsClient = null;
    }

    this.errorMessage.value = null;
    this.currentReconnectAttempts.value = 0;

    if (this.debug.value) {
      console.log(`WebSocketService: Attempting to connect to ${this.url.value}.`);
    }

    this.wsClient = new WebSocketClient({
      url: this.url.value,
      maxReconnectAttempts: this.maxReconnectAttempts.value,
      debug: this.debug.value,
      reconnectInterval: 3000, // Hardcoded as per instructions
    });

    this.wsClient.onOpen = () => {
      this.isConnecting.value = false;
      this.isConnected.value = true;
      this.errorMessage.value = null;
      this.currentReconnectAttempts.value = 0; // Reset attempts on successful connection
      if (this.debug.value) {
        console.log("WebSocketService: Connected.");
      }
    };

    this.wsClient.onMessage = (event: MessageEvent) => {
      this.lastMessage.value = event.data;
      if (this.debug.value) {
        console.log("WebSocketService: Message received:", event.data);
      }
    };

    this.wsClient.onClose = (event: CloseEvent) => {
      this.isConnecting.value = false;
      this.isConnected.value = false;
      if (this.debug.value) {
        console.log("WebSocketService: Disconnected.", event.reason, event.code);
      }

      // Check if the client itself is trying to reconnect
      if (this.wsClient && this.wsClient.shouldReconnect) {
        this.currentReconnectAttempts.value++;
         if (this.debug.value) {
            console.log(`WebSocketService: Reconnect attempt ${this.currentReconnectAttempts.value} by client.`);
        }
      } else {
        // If not shouldReconnect, it means client gave up or user called disconnect()
        // We need to ensure this message is set only if it's not a user-initiated disconnect.
        // A simple check could be if wsClient is null (set by disconnect method)
        // or if wsClient exists but its shouldReconnect is false.
        if (this.wsClient && !this.wsClient.shouldReconnect) {
             // Check if current attempts have reached max, which means the client gave up.
            if (this.currentReconnectAttempts.value >= this.maxReconnectAttempts.value) {
                 this.errorMessage.value = 'Connection closed. Max reconnect attempts reached by client.';
            } else if (event.code !== 1000) { // 1000 is normal closure
                // If not max attempts, but also not shouldReconnect, and not a normal closure
                // it could be an explicit server rejection or other issue.
                this.errorMessage.value = `Connection closed unexpectedly: ${event.reason || 'Server unavailable'}. Code: ${event.code}`;
            }
            // if user called disconnect(), wsClient would be null, so this block might not be hit as intended
            // The disconnect method handles its own state updates.
        } else if (!this.wsClient) { // User called disconnect
             if (this.debug.value) {
                console.log("WebSocketService: Disconnection was user-initiated or client was cleared.");
             }
        }
      }
    };

    this.wsClient.onError = (event: Event) => {
      this.isConnecting.value = false;
      this.isConnected.value = false;
      // The actual error message from the event is often not very informative for the UI.
      // 'WebSocket error. See console for details.' is a common practice.
      this.errorMessage.value = 'WebSocket error. See console for details.';
      console.error("WebSocketService: Error occurred.", event);
    };

    this.wsClient.connect(); // Initiate the connection
  }

  public disconnect(): void {
    // Note: isConnecting should also be set to false on explicit disconnect 
    // if a connection attempt was aborted by a quick disconnect.
    this.isConnecting.value = false; 
    if (this.debug.value) {
      console.log("WebSocketService: User triggered disconnect.");
    }
    if (this.wsClient) {
      this.wsClient.shouldReconnect = false; // Crucial: stop the client's own reconnect loop
      this.wsClient.close(); // This will trigger onClose, which also sets isConnecting = false
      this.wsClient = null;
    }
    this.isConnected.value = false;
    this.currentReconnectAttempts.value = 0; // Reset as this is a manual action
    // Optionally, set a message indicating user disconnection
    // this.errorMessage.value = "Disconnected by user.";
  }

  public send(data: string | ArrayBuffer | Blob): void {
    if (this.wsClient && this.isConnected.value) {
      try {
        this.wsClient.send(data);
        if (this.debug.value) {
          console.log("WebSocketService: Message sent:", data);
        }
      } catch (error) {
        this.errorMessage.value = 'Failed to send message. See console for details.';
        console.error("WebSocketService: Send error:", error);
        this.isConnected.value = false; // Assume connection is compromised
      }
    } else {
      this.errorMessage.value = 'Cannot send: Not connected.';
      console.error("WebSocketService: Cannot send, not connected.");
    }
  }
}

export const webSocketService = new WebSocketService();
