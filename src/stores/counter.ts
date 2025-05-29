import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', {
  state: () => ({
    count: 0,
  }),
  getters: {
    // Optional: a getter to access count, can also be accessed directly
    currentCount: (state) => state.count,
  },
  actions: {
    increment() {
      this.count++
    },
  },
})
