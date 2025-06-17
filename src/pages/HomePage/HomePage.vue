<script setup lang="ts">
  import { useCounterStore } from '@/stores/counter'
  const counterStore = useCounterStore()
  import { useCounter } from './HomePage'
  const { logMsg } = useCounter()
  import { usePopoutMessage } from '@/components/popoutMessageBox/PopoutMessagePlugin'
  const $notify = usePopoutMessage()

  import { useWebsocketManager } from '@/components/websocketManager/websocketManagerPlugin'
  const $ws_manager = useWebsocketManager()

</script>

<template>
  <div class="container">
    <div class="row">
      <div class="col">
        <div class="input-group mb-3">
          <input type="number" class="form-control" v-model="counterStore.count">
          <button class="btn btn-primary" type="button" @click="counterStore.increment()">+1</button>
        </div>
      </div>
    </div>
    <div class="row">
      <h1>Popout Logs 演示 ({{ $notify.status.count  }})</h1>
      <div class="col">
        <div class="input-group mb-3">
          <input type="text" class="form-control" v-model="logMsg">
          <button class="btn btn-success" @click="$notify.success(logMsg, 'Success訊息', 10)">Success訊息</button>
          <button class="btn btn-danger" @click="$notify.error(logMsg, 'Error訊息', 10)">Error/Fail訊息</button>
          <button class="btn btn-info" @click="$notify.info(logMsg, 'Info訊息', 10)">Info訊息</button>
          <button class="btn btn-warning" @click="$notify.warning(logMsg, 'Waring訊息', 10)">Warning訊息</button>
          <button class="btn btn-secondary" @click="$notify.debug(logMsg, 'Debug訊息', 10)">Debug訊息</button>
          <button class="btn btn-primary" @click="$notify.primary(logMsg, 'Primary訊息', 10)">Primary訊息</button>
        </div>
      </div>
    </div>
    <div class="row">
      <h1>Websocket Manager 演示</h1>
      <div class="col">
        <div class="input-group mb-3">
          <span class="input-group-text">Websocket Manager</span>
          <input type="text" class="form-control" v-model="$ws_manager.state.websocketUrl.value" :disabled="$ws_manager.state.isConnected.value">
          <button v-if="!$ws_manager.state.isConnected.value" class="btn btn-info" @click="$ws_manager.connectWebsocket">建立連線</button>
          <button v-else class="btn btn-danger" @click="$ws_manager.disconnectWebsocket">斷開連線</button>
          <button class="btn btn-primary" type="button" @click="$ws_manager.openWindow()">打開操作視窗</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="postcss">
/* https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-nesting */
</style>