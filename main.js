const { app, BrowserWindow, screen, ipcMain } = require('electron')
const http = require('http')

let win

app.whenReady().then(() => {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize

  win = new BrowserWindow({
    width, height, x: 0, y: 0,
    transparent: true, frame: false,
    alwaysOnTop: true, skipTaskbar: true,
    resizable: false, hasShadow: false,
    webPreferences: { nodeIntegration: true, contextIsolation: false }
  })

  win.loadFile('index.html')
  win.setIgnoreMouseEvents(true, { forward: true })

  ipcMain.on('mouse-over', () => win.setIgnoreMouseEvents(false))
  ipcMain.on('mouse-out',  () => win.setIgnoreMouseEvents(true, { forward: true }))
  ipcMain.on('quit', unloadAndQuit)
})

function unloadAndQuit() {
  // Ask Ollama to unload the model from VRAM before exiting
  try {
    const body = JSON.stringify({ model: 'qwen3.5:9b-gpu', keep_alive: 0 })
    const req = http.request({
      hostname: 'localhost', port: 11434,
      path: '/api/generate', method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) }
    })
    req.on('error', () => {})
    req.write(body)
    req.end()
  } catch {}
  setTimeout(() => app.quit(), 800)
}

app.on('window-all-closed', () => app.quit())
