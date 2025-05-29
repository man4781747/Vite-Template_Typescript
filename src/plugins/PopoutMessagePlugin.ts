import { type App, inject, type InjectionKey } from 'vue'
import { popoutNotify, type PopoutNotifyMethods } from '@/services/popoutMessageService'

export const PopoutNotifyInjectionKey: InjectionKey<PopoutNotifyMethods> = Symbol('PopoutNotify')

export default {
  install: (app: App) => {
    app.provide(PopoutNotifyInjectionKey, popoutNotify)
  },
}

export function usePopoutNotify(): PopoutNotifyMethods {
  const notify = inject(PopoutNotifyInjectionKey)
  if (!notify) {
    throw new Error('PopoutNotify service not provided via PopoutMessagePlugin.')
  }
  return notify
}
