<script setup lang="ts">
  import { useStore } from 'vuex'
  import type { State } from '@/store'
  const store = useStore<State>()
  import { useCounter } from './HomePage'
  const { count, add, logMsg } = useCounter()



  function successMsg() {window.successLog(logMsg.value, 'Success訊息', 10)}
  function errorMsg() {window.errorLog(logMsg.value, 'Error訊息', 10)}
  function infoMsg() {window.infoLog(logMsg.value, 'Info訊息', 10)}
  function warningMsg() {window.warningLog(logMsg.value, 'Waring訊息', 10)}
  function degubMsg() {window.debugLog(logMsg.value, 'Debug訊息', 10)}
  function primaryMsg() {window.primaryLog(logMsg.value, 'Primary訊息', 10)}
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
          <button class="btn btn-success" @click="successMsg">Success訊息</button>
          <button class="btn btn-danger" @click="errorMsg">Error/Fail訊息</button>
          <button class="btn btn-info" @click="infoMsg">Info訊息</button>
          <button class="btn btn-warning" @click="warningMsg">Warning訊息</button>
          <button class="btn btn-secondary" @click="degubMsg">Debug訊息</button>
          <button class="btn btn-primary" @click="primaryMsg">Primary訊息</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="postcss">
/* https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-nesting */
</style>