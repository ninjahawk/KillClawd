'use strict'

const { contextBridge, ipcRenderer } = require('electron')
const fs = require('fs')
const path = require('path')
const os = require('os')

const IPC = new Set(['mouse-over', 'mouse-out', 'quit'])

contextBridge.exposeInMainWorld('clawdAPI', {
  homedir() {
    return os.homedir()
  },
  desktopPath() {
    return path.join(os.homedir(), 'Desktop')
  },
  username() {
    return os.userInfo().username
  },

  ipcSend(channel) {
    if (IPC.has(channel)) ipcRenderer.send(channel)
  },

  statSync(p) {
    try {
      const s = fs.statSync(p)
      return {
        isDirectory: s.isDirectory(),
        size: s.size,
        mtimeMs: s.mtimeMs,
        birthtimeMs: s.birthtimeMs,
        ctimeMs: s.ctimeMs
      }
    } catch {
      return null
    }
  },

  readFileSync(p, enc) {
    return fs.readFileSync(p, enc || 'utf8')
  },
  writeFileSync(p, data) {
    fs.writeFileSync(p, data)
  },
  appendFileSync(p, data) {
    fs.appendFileSync(p, data)
  },
  existsSync(p) {
    return fs.existsSync(p)
  },
  readdirSync(p) {
    return fs.readdirSync(p)
  },

  pathJoin(...parts) {
    return path.join(...parts)
  },

  isDemoMode() {
    return process.argv.includes('--demo')
  }
})
