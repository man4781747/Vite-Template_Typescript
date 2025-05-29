import { createApp, h } from 'vue'
import PopoutMessageBox from '@/components/popoutMessageBox/popoutMessageBox.vue'
import { v4 as uuidv4 } from 'uuid'

// This function is adapted from the existing index.ts
function createMessageBoxContainer(): HTMLElement {
  let container = document.getElementById('popout-message-box-list')
  if (!container) {
    container = document.createElement('div')
    container.id = 'popout-message-box-list'
    document.body.appendChild(container)
  }
  return container
}

// Define an interface for the notification functions
export interface PopoutNotifyMethods {
  success: (mainString: string, despString?: string, lifeTime?: number) => void
  error: (mainString: string, despString?: string, lifeTime?: number) => void
  info: (mainString: string, despString?: string, lifeTime?: number) => void
  warning: (mainString: string, despString?: string, lifeTime?: number) => void
  debug: (mainString: string, despString?: string, lifeTime?: number) => void
  primary: (mainString: string, despString?: string, lifeTime?: number) => void
}

const createMessage = (
  messageType: string,
  mainString: string,
  despString?: string,
  lifeTime: number = 5
) => {
  const container = createMessageBoxContainer()
  const tempID = uuidv4()
  const tempDiv = document.createElement('div')
  tempDiv.id = tempID
  // The original code added 'popout-message-box' class to the childNode,
  // but popoutMessageBox.vue itself is the root element with this class.
  // If popoutMessageBox.vue's root element already has this class, this might be redundant
  // or might be intended for an additional wrapper. For now, let's keep it simple.
  // tempDiv.className = 'popout-message-box' // Let's see if this is needed.
  container.appendChild(tempDiv) // The original code used prepend, let's stick to that for consistency. container.prepend(tempDiv)

  // Correcting to prepend based on original logic
  container.prepend(tempDiv)

  const app = createApp({
    render: () =>
      h(PopoutMessageBox, {
        eleID: tempID,
        messageType,
        mainString,
        despString: despString || '', // Ensure despString is not undefined
        lifeTime,
      }),
  })
  app.mount(tempDiv)
}

export const popoutNotify: PopoutNotifyMethods = {
  success: (mainString, despString, lifeTime) =>
    createMessage('success', mainString, despString, lifeTime),
  error: (mainString, despString, lifeTime) =>
    createMessage('fail', mainString, despString, lifeTime), // 'fail' was used in popoutMessageBox.vue styling & old index.ts
  info: (mainString, despString, lifeTime) =>
    createMessage('info', mainString, despString, lifeTime),
  warning: (mainString, despString, lifeTime) =>
    createMessage('warning', mainString, despString, lifeTime),
  debug: (mainString, despString, lifeTime) =>
    createMessage('debug', mainString, despString, lifeTime),
  primary: (mainString, despString, lifeTime) =>
    createMessage('primary', mainString, despString, lifeTime),
}
