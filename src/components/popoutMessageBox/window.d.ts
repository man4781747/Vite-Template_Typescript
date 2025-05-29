export {}

declare global {
  interface Window {
    successLog: (main: string, desp?: string, life?: number) => void
    failLog: (main: string, desp?: string, life?: number) => void
    errorLog: (main: string, desp?: string, life?: number) => void
    infoLog: (main: string, desp?: string, life?: number) => void
    warningLog: (main: string, desp?: string, life?: number) => void
    primaryLog: (main: string, desp?: string, life?: number) => void
    debugLog: (main: string, desp?: string, life?: number) => void
  }
}