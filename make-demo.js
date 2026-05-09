// make-demo.js — records a ~90s feature showcase video
// Usage: node make-demo.js
// Output: demo.mp4 on the Desktop

const { spawn } = require('child_process')
const path = require('path')
const os   = require('os')

const OUT      = path.join(os.homedir(), 'Desktop', 'clawd-demo.mp4')
const DURATION = 92   // seconds — matches last demo step at 88s + buffer

const electronBin = path.join(__dirname, 'node_modules', 'electron', 'dist', 'electron.exe')

console.log('Recording to:', OUT)
console.log('Starting ffmpeg…')

const rec = spawn('ffmpeg', [
  '-y',
  '-f', 'gdigrab',
  '-framerate', '30',
  '-i', 'desktop',
  '-t', String(DURATION),
  '-vcodec', 'libx264',
  '-preset', 'ultrafast',
  '-pix_fmt', 'yuv420p',
  '-movflags', '+faststart',
  OUT
], { stdio: ['pipe', 'pipe', 'pipe'] })

rec.stderr.on('data', d => process.stdout.write('.'))

// Wait for ffmpeg to initialise before launching the app
setTimeout(() => {
  console.log('\nLaunching Clawd in demo mode…')
  const app = spawn(electronBin, ['.', '--demo'], {
    cwd: __dirname,
    stdio: 'inherit',
    shell: false,
    windowsHide: false
  })
  app.on('exit', () => {
    console.log('\nApp exited — stopping recording…')
    try { rec.stdin.write('q') } catch {}
  })
}, 1200)

rec.on('exit', () => {
  console.log('Done! Video saved to:', OUT)
  process.exit(0)
})
