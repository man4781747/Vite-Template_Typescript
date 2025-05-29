import { computed, ref, type Ref } from 'vue'
import { useStore } from 'vuex'
import type { State } from '@/store'

export function useCounter() {
  const store = useStore<State>()

  const count = computed(() => store.state.count)

  function add() {
    store.commit('increment')
  }

  const logMsg = ref("")
  return {
    count,
    add,
    logMsg,
  }
}