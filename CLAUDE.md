# KillClawd

Desktop pet Electron app. A sarcastic AI crab named Clawd lives as a transparent always-on-top overlay on Windows, powered by a local Ollama model.

GitHub: https://github.com/ninjahawk/KillClawd

## Stack

- **Electron 28** — transparent frameless window, full-screen overlay, click-through via IPC
- **Vanilla JS** — no bundler, no framework, everything in index.html (~1400 lines)
- **Ollama** — local LLM, two tiers: `qwen:latest` (4B, streaming chat) and `qwen3.5:9b-gpu` (background thoughts/observations)

## Key Files

- `main.js` — Electron main: creates window, mouse-over/out IPC, unloads model from VRAM on quit
- `index.html` — everything: movement AI, state machine, all game systems, Ollama calls, UI
- `clawd.bat` — one-click launcher, auto-installs node_modules on first run
- `demo-main.js` — offscreen Electron renderer for recording the programmed demo video
- `demo-video.html` — scripted 49s feature showcase used by demo-main.js
- `make-demo.js` — screen-records the live app running in demo mode (alternate approach)

## Architecture

**State machine:** `walk | idle | crazy | entering | explore | castle | vehicle | celeb`

**Sprites** (all in `assets/`): idle, walk, think, sleep, happy, celeb, crazy, enter, peek, error, reading, annoyed, typing, debug, notify, build, alert

**Two Ollama functions:**
- `ask(prompt, maxTok, useChat)` — non-streaming, for background thoughts/observations
- `askStream(prompt, onToken, maxTok)` — streaming, for chat responses

**Prompt format:** completion-style (not instruction following) — more reliable on small models. 3 random few-shot examples prepended each call.

**Response pools:** large arrays per event type (grab, throw, flee, win, etc). Rotate without back-to-back repeats. Background-refresh via model when pool drops below 8.

**XP system:** persisted to `clawd-xp.json` on Desktop. Passive XP every 30s, bonus for grab/throw/chat/mob defeat/level up.

**Journal:** appends everything to `clawd-journal.txt` on Desktop.

## Conventions

- `setSprite(key, force=false)` — priority sprites (enter, happy, error, alert, celeb, annoyed) bypass the 350ms debounce
- `cap2(s)` — truncates to 2 sentences, applied to all unprompted bubble text (not chat replies)
- `clean(s)` — strips `<think>` tags and surrounding quotes from model output
- `showBubble(text, ms)` / `updateBubble(text)` — updateBubble is for streaming (no timer reset per token)
- All entities (mobs, vehicles, castle) are DOM elements appended to body

## What's Been Done

- Expanded sprite usage: `reading` during long idles, `debug` for non-existential thoughts and folder approach, `peek` when cursor is in curious range, `alert` on castle/vehicle spawn
- Capped all unprompted thoughts + chat replies at 2 sentences via `cap2()`
- Demo recording infrastructure (`demo-main.js` + `demo-video.html`)
- Posted to Reddit r/artificial with title "I made a desktop crab that bullies you back"

## Running

```
npm start          # normal launch
clawd.bat          # one-click (installs deps if needed)
electron demo-main.js   # record programmed demo video
node make-demo.js  # screen-record live demo
```
