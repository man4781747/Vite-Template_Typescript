<script setup lang="ts">
import { useCounterStore } from '@/stores/counter'
import { useCounter } from './HomePage'
import { usePopoutNotify } from '@/plugins/PopoutMessagePlugin'

const counterStore = useCounterStore()
const { count, add, logMsg } = useCounter()
const $notify = usePopoutNotify()

function successMsg() {
  $notify.success(logMsg.value, 'Success訊息', 10)
}
function errorMsg() {
  $notify.error(logMsg.value, 'Error訊息', 10)
}
function infoMsg() {
  $notify.info(logMsg.value, 'Info訊息', 10)
}
function warningMsg() {
  $notify.warning(logMsg.value, 'Waring訊息', 10)
}
function degubMsg() {
  $notify.debug(logMsg.value, 'Debug訊息', 10)
}
function primaryMsg() {
  $notify.primary(logMsg.value, 'Primary訊息', 10)
}
</script>

<template>
  <div class="container">
    <div class="row">
      <div class="col">
        <div class="input-group mb-3">
          <input v-model="counterStore.count" type="number" class="form-control" />
          <button class="btn btn-primary" type="button" @click="add">+1</button>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <div class="input-group mb-3">
          <input v-model="logMsg" type="text" class="form-control" />
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
