<template>
  <div id="akira-c-websocket-manager-card" class="websocket-manager-card">
    <div class="websocket-manager-header">
      <h3>WebSocket 管理器</h3>
      <button class="close-btn" @click="websocketManager.closeWindow">×</button>
    </div>
    <div class="websocket-manager-content">
      <div class="url-section">
        <label>WebSocket URL:</label>
        <input 
          type="text" 
          v-model="websocketManager.state.websocketUrl.value"
          placeholder="ws://localhost:8080/ws"
          :disabled="websocketManager.state.isConnected.value"
        />
      </div>
      <div class="status-section">
        <div class="status-item">
          <span>連接狀態：</span>
          <span :class="['status-badge', websocketManager.state.connectionStatus.value]">{{ websocketManager.state.connectionStatusText.value }}</span>
        </div>
        <div class="status-item">
          <span>最後更新：</span>
          <span>{{ websocketManager.state.lastUpdateTime.value }}</span>
        </div>
      </div>
      <div class="control-section">
        <button v-if="!websocketManager.state.isConnected.value" class="connect-btn" @click="websocketManager.connectWebsocket">建立連接</button>
        <button v-else class="connect-btn disconnect" @click="websocketManager.disconnectWebsocket">斷開連接</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { websocketManager } from './websocketManagerService'
</script>

<style scoped>
.websocket-manager-card {
  position: fixed;
  top: 20px;
  right: 20px;
  width: 300px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  transition: all 0.3s ease;
}

.websocket-manager-card.not-show {
  display: none;
}

.websocket-manager-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #eee;
}

.websocket-manager-header h3 {
  margin: 0;
  font-size: 16px;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #666;
}

.websocket-manager-content {
  padding: 16px;
}

.url-section {
  margin-bottom: 16px;
}

.url-section label {
  display: block;
  margin-bottom: 8px;
  color: #666;
}

.url-section input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.status-section {
  margin-bottom: 16px;
}

.status-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.status-badge {
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
}

.status-badge.connected {
  background: #e6f7e6;
  color: #52c41a;
}

.status-badge.disconnected {
  background: #f5f5f5;
  color: #999;
}

.status-badge.error {
  background: #fff1f0;
  color: #f5222d;
}

.control-section {
  text-align: center;
}

.connect-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  background: #1890ff;
  color: white;
  cursor: pointer;
  transition: all 0.3s;
}

.connect-btn:hover {
  background: #40a9ff;
}

.connect-btn.disconnect {
  background: #ff4d4f;
}

.connect-btn.disconnect:hover {
  background: #ff7875;
}
</style>