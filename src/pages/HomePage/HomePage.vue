<script setup lang="ts">
  import { useStore } from 'vuex'
  import type { State } from '@/store'
  const store = useStore<State>()
  import { useCounter } from './HomePage'
  const { count, add } = useCounter()
</script>

<template>
  <div class="container">
    <div class="row">
      <input type="text" v-model="store.state.count">
      {{ count }}
    </div>
    <div class="row">
      <div class="col">
        <button class="btn btn-primary" @click="add">+1</button>
      </div>
    </div>
  </div>
</template>

<style lang="postcss">
/* https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-nesting */
</style>