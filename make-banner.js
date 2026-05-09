const { app, BrowserWindow } = require('electron')
const path = require('path')
const fs   = require('fs')

app.whenReady().then(async () => {
  const win = new BrowserWindow({
    width: 1168, height: 409,
    show: false,
    webPreferences: { nodeIntegration: false }
  })

  await win.loadFile(path.join(__dirname, 'assets', 'banner.html'))

  // Wait for images (GIF) to load
  await new Promise(r => setTimeout(r, 1800))

  const img  = await win.webContents.capturePage()
  const out  = path.join(__dirname, 'assets', 'banner.jpg')
  fs.writeFileSync(out, img.toJPEG(95))

  console.log('Saved:', out)
  app.quit()
})
