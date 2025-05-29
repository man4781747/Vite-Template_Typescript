import { App, createVNode, render } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import popoutMessageBox from './popoutMessageBox.vue'

// 註冊組件安裝方法
const install = (app: App): void => {
  app.component('popout-message-box', popoutMessageBox)
}

// 將組件附加 install 方法，以支援 app.use()
Object.assign(popoutMessageBox, { install })

// 定義 Log 類型
interface LogOptions {
  messageType: string
  mainString: string
  despString?: string
  lifeTime?: number
}

function showLog({ messageType, mainString, despString = '', lifeTime = 5 }: LogOptions): void {
  const UUIDString = uuidv4()
  const vnode = createVNode(popoutMessageBox, {
    messageType,
    eleID: UUIDString,
    lifeTime,
    mainString,
    despString
  })

  let mountNode = document.getElementById('popout-message-box-list')
  if (!mountNode) {
    mountNode = document.createElement('div')
    mountNode.id = 'popout-message-box-list'
    document.body.appendChild(mountNode)
  }

  const childNode = document.createElement('div')
  childNode.className = 'popout-message-box'
  childNode.id = UUIDString
  render(vnode, childNode)
  mountNode.prepend(childNode)
}

// 將 log 函式掛到 window 上
window.successLog = (main, desp = '', life = 5) => showLog({ messageType: 'success', mainString: main, despString: desp, lifeTime: life })
window.failLog = (main, desp = '', life = 5) => showLog({ messageType: 'fail', mainString: main, despString: desp, lifeTime: life })
window.errorLog = window.failLog
window.infoLog = (main, desp = '', life = 5) => showLog({ messageType: 'info', mainString: main, despString: desp, lifeTime: life })
window.warningLog = (main, desp = '', life = 5) => showLog({ messageType: 'warning', mainString: main, despString: desp, lifeTime: life })
window.primaryLog = (main, desp = '', life = 5) => showLog({ messageType: 'primary', mainString: main, despString: desp, lifeTime: life })
window.debugLog = (main, desp = '', life = 5) => showLog({ messageType: 'debug', mainString: main, despString: desp, lifeTime: life })



export default popoutMessageBox