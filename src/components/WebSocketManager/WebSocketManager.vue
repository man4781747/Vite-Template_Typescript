<script setup lang="ts">
import { computed, defineEmits } from 'vue'; // Removed ref, added defineEmits
import { webSocketService } from '@/websocket/WebSocketService'; // Assuming @/ is src/

// Removed isVisible ref
const inputUrl = ref(webSocketService.url.value); // inputUrl still needed
const inputMaxReconnectAttempts = ref(webSocketService.maxReconnectAttempts.value); // inputMaxReconnectAttempts still needed

const isConnected = computed(() => webSocketService.isConnected.value);

const statusMessage = computed(() => {
  if (webSocketService.errorMessage.value) {
    return webSocketService.errorMessage.value;
  }
  if (webSocketService.isConnecting.value) {
    return 'Connecting...';
  }
  if (webSocketService.isConnected.value) {
    return "Connected";
  }
  if (webSocketService.currentReconnectAttempts.value > 0 && !webSocketService.isConnected.value) {
    // This condition ensures "Reconnecting..." is shown only when not yet connected and attempts are active.
    return `Reconnecting... (Attempt ${webSocketService.currentReconnectAttempts.value} of ${webSocketService.maxReconnectAttempts.value})`;
  }
  return "Disconnected";
});

const statusClass = computed(() => {
  if (webSocketService.errorMessage.value) {
    return 'status-error';
  }
  if (webSocketService.isConnecting.value) {
    return 'status-connecting';
  }
  if (webSocketService.isConnected.value) {
    return 'status-connected';
  }
  if (webSocketService.currentReconnectAttempts.value > 0 && !webSocketService.isConnected.value) {
    return 'status-reconnecting';
  }
  return 'status-disconnected';
});

// Define emits for the component
const emit = defineEmits(['close-panel']);

// Removed toggleVisibility function

function handleClosePanel() {
  emit('close-panel');
}

function handleConnectDisconnect() {
  if (webSocketService.isConnected.value) {
    webSocketService.disconnect();
  } else {
    webSocketService.setUrl(inputUrl.value);
    // Update max attempts from input before connecting, in case it changed
    webSocketService.setMaxReconnectAttempts(Number(inputMaxReconnectAttempts.value));
    webSocketService.connect();
  }
}

function updateMaxReconnectAttempts() {
  const attempts = Number(inputMaxReconnectAttempts.value);
  if (!isNaN(attempts) && attempts >= 0) {
    webSocketService.setMaxReconnectAttempts(attempts);
  } else {
    // Optionally, reset input to current service value or show an error
    inputMaxReconnectAttempts.value = webSocketService.maxReconnectAttempts.value;
  }
}

// Debug toggle uses v-model directly on webSocketService.debug
// If a method was needed:
// function toggleDebug() {
//   webSocketService.setDebug(!webSocketService.debug.value);
// }
</script>

<template>
  <div class="websocket-manager-panel"> <!-- Removed outer div and v-if -->
    <button @click="handleClosePanel" class="close-button" aria-label="Close Panel">&times;</button>
    <h4>WebSocket Control Panel</h4>

    <div class="form-group">
      <label for="ws-url">WebSocket URL:</label>
        <input
          type="text"
          id="ws-url"
          v-model="inputUrl"
          :disabled="webSocketService.isConnected.value || webSocketService.isConnecting.value || webSocketService.currentReconnectAttempts.value > 0"
        />
      </div>

      <div class="form-group">
        <label for="ws-max-reconnect">Max Reconnect Attempts:</label>
        <input
          type="number"
          id="ws-max-reconnect"
          v-model.number="inputMaxReconnectAttempts"
          min="0"
          :disabled="webSocketService.isConnected.value || webSocketService.isConnecting.value || webSocketService.currentReconnectAttempts.value > 0"
        />
        <button
          @click="updateMaxReconnectAttempts"
          :disabled="webSocketService.isConnected.value || webSocketService.isConnecting.value || webSocketService.currentReconnectAttempts.value > 0"
          class="inline-button"
        >
          Update
        </button>
      </div>

      <div class="form-group actions">
        <button @click="handleConnectDisconnect" :class="{'is-connected-true': webSocketService.isConnected.value}">
          {{ webSocketService.isConnected.value ? 'Disconnect' : 'Connect' }}
        </button>
      </div>

      <div class="status-section">
        <strong>Status:</strong>
        <span :class="['status-message', statusClass]">{{ statusMessage }}</span>
      </div>
      
      <div class="form-group">
        <label for="ws-debug">Enable Debug Logging:</label>
        <input
          type="checkbox"
          id="ws-debug"
          v-model="webSocketService.debug.value"
        />
      </div>

      <div v-if="webSocketService.debug.value && webSocketService.lastMessage.value" class="last-message-section">
        <strong>Last Message:</strong>
        <pre>{{ webSocketService.lastMessage.value }}</pre>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Removed .visibility-toggle-button styles */

.websocket-manager-panel {
  position: fixed;
  bottom: 10px; /* Panel now at the bottom */
  right: 10px;
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  padding: 15px;
  z-index: 1000;
  width: 320px;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
  border-radius: 5px;
  font-family: Arial, sans-serif;
  font-size: 14px;
}

.close-button {
  position: absolute;
  top: 8px;
  right: 10px;
  background: transparent;
  border: none;
  font-size: 1.5rem; /* Made slightly larger */
  font-weight: bold;
  color: #666;
  cursor: pointer;
  line-height: 1;
  padding: 0;
}

.close-button:hover {
  color: #333;
}

.websocket-manager-panel h4 {
  margin-top: 0;
  padding-right: 20px; /* Add padding to avoid overlap with close button */
  margin-bottom: 15px;
  color: #333;
}

.form-group {
  margin-bottom: 12px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #555;
}

.form-group input[type="text"],
.form-group input[type="number"] {
  width: calc(100% - 22px); /* Account for padding/border */
  padding: 8px 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
}

.form-group input[type="checkbox"] {
  margin-right: 5px;
  vertical-align: middle;
}


.form-group input:disabled {
  background-color: #e9ecef;
  cursor: not-allowed;
}


.form-group .inline-button {
  padding: 6px 10px;
  margin-left: 8px;
  background-color: #6c757d;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}
.form-group .inline-button:disabled {
  background-color: #adb5bd;
  cursor: not-allowed;
}


.form-group.actions button {
  padding: 10px 15px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  width: 100%;
}

.form-group.actions button:hover {
  background-color: #218838;
}

/* Disconnect button style */
.form-group.actions button:disabled {
    background-color: #ccc;
}
.form-group.actions button:not(:disabled) { /* Specificity for connect/disconnect */
  background-color: #007bff; /* Blue for Connect */
}
.form-group.actions button:not(:disabled):hover {
  background-color: #0056b3;
}

/* If isConnected is true, button should be for "Disconnect" and red */
.form-group.actions button.is-connected-true {
  background-color: #dc3545; /* Red for Disconnect */
}
.form-group.actions button.is-connected-true:hover {
  background-color: #c82333;
}


.status-section {
  margin-top: 15px;
  margin-bottom: 15px;
}

.status-message {
  margin-top: 5px;
  padding: 8px;
  border: 1px solid #eee;
  background-color: #fff;
  border-radius: 4px;
  word-wrap: break-word;
}

.status-connected {
  color: #155724;
  background-color: #d4edda;
  border-color: #c3e6cb;
}

.status-error {
  color: #721c24;
  background-color: #f8d7da;
  border-color: #f5c6cb;
}

.status-reconnecting {
  color: #856404;
  background-color: #fff3cd;
  border-color: #ffeeba;
}

.status-disconnected {
  color: #383d41;
  background-color: #e2e3e5;
  border-color: #d6d8db;
}

.status-connecting {
  color: #004085; /* Dark blue text */
  background-color: #cce5ff; /* Light blue background */
  border-color: #b8daff; /* Lighter blue border */
}

.last-message-section {
  margin-top: 15px;
  padding-top: 10px;
  border-top: 1px solid #ddd;
}
.last-message-section strong {
  display: block;
  margin-bottom: 5px;
}
.last-message-section pre {
  background-color: #fff;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  white-space: pre-wrap;
  word-break: break-all;
  max-height: 150px;
  overflow-y: auto;
  font-size: 12px;
}
</style>
