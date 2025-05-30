import { computed, ref, type Ref } from 'vue'

export function useCounter() {
  const logMsg = ref("")
  return {
    logMsg,
  }
}