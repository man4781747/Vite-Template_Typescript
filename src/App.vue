<script setup lang="ts">
import { WebSocketClient } from '@/websocket'
const wsClient = new WebSocketClient({
  url: 'ws://192.168.20.48/ws',
  reconnectInterval: 2000,
  maxReconnectAttempts: 10,
  debug: true,
})

wsClient.onOpen(() => console.log('✅ WebSocket connected'))
wsClient.onMessage((e) => console.log('📨 Message received:', e.data))
wsClient.onClose(() => console.warn('❌ WebSocket closed'))
wsClient.onError(() => console.error('⚠️ WebSocket error'))
console.log('Connected?', wsClient.isConnected())
</script>

<template>
  <div class="container-fluid">
    <router-view/>
  </div>
</template>

<script lang="ts">
</script>
