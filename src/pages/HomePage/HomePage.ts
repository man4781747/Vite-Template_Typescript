import { computed, ref, type Ref } from 'vue'
import { useCounterStore } from '@/stores/counter'

export function useCounter() {
  const counterStore = useCounterStore()

  const count = computed(() => counterStore.count)

  function add() {
    counterStore.increment()
  }

  const logMsg = ref('')
  return {
    count,
    add,
    logMsg,
  }
}
