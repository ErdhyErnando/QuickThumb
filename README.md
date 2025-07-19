# QuickThumb 🎯

A retro terminal-styled YouTube thumbnail grabber. Paste a YouTube URL, get the thumbnail instantly with CRT-style visual effects.

## Features

- 🖥️ **Retro terminal aesthetic** with CRT scanlines and green glow
- ⚡ **Instant thumbnail fetching** with quality fallback (maxres → hq → mq → sd)
- 📋 **Copy URL or download** thumbnail directly
- 🎉 **Fun toast notifications** with retro messages
- 📱 **Fully responsive** design
- 🚀 **100% static** - no backend required

## Tech Stack

- HTML5 + TailwindCSS (CDN)
- Vanilla JavaScript
- Toastify.js for notifications
- Google Fonts (Share Tech Mono)

## Quick Start

1. Clone or download this repo
2. Open `index.html` in your browser
3. Paste any YouTube URL and click "FETCH"
4. Copy URL or download the thumbnail

## Deploy to Cloudflare Pages

1. Push this repo to GitHub
2. Go to [Cloudflare Pages](https://pages.cloudflare.com/)
3. Connect your GitHub repo
4. Build settings:
   - Build command: _(leave empty)_
   - Output directory: `/`
5. Deploy!

Your site will be live at `https://your-project.pages.dev`

## File Structure

```
/
├── index.html     # Main app page
├── style.css      # Retro terminal styling + CRT effects
├── app.js         # Core functionality + fun messages
└── README.md      # This file
```

## Easter Egg

Try the Konami code: ↑↑↓↓←→←→BA 😉

---

**Total size**: ~38KB | **Dependencies**: None (all CDN) | **License**: Open Source
