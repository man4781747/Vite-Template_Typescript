<script setup lang="ts">
  import { useStore } from 'vuex'
  import type { State } from '@/store'
  const store = useStore<State>()
  import { useCounter } from './HomePage'
  const { count, add, logMsg } = useCounter()
  import { usePopoutMessage } from '@/components/popoutMessageBox/PopoutMessagePlugin'
  const $notify = usePopoutMessage()
</script>

<template>
  <div class="container">
    <div class="row">
      <div class="col">
        <div class="input-group mb-3">
          <input type="number" class="form-control" v-model="store.state.count">
          <button class="btn btn-primary" type="button" @click="add">+1</button>
        </div>
      </div>
    </div>
    <div class="row">
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
  </div>
</template>

<style lang="postcss">
/* https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-nesting */
</style>