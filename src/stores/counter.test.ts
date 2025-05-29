import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useCounterStore } from './counter' // Adjust path if store is in a different location

describe('Counter Store', () => {
  beforeEach(() => {
    // Create a fresh Pinia instance and make it active for each test
    setActivePinia(createPinia())
  })

  it('initializes with count 0', () => {
    const store = useCounterStore()
    expect(store.count).toBe(0)
  })

  it('increments the count', () => {
    const store = useCounterStore()
    store.increment()
    expect(store.count).toBe(1)
  })

  it('getter currentCount returns the count', () => {
    const store = useCounterStore()
    expect(store.currentCount).toBe(0)
    store.increment()
    expect(store.currentCount).toBe(1)
  })
})
