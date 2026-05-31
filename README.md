# Booth — deploy guide

This is a complete React + Vite app. Below are three ways to get a live URL you
can open on your phone. The menu is hidden by default, so it looks like a real app.
(There's a tiny invisible tap-target in the **top-right corner** that opens a
screen-jump menu if you ever want it — harmless to leave in.)

---

## Easiest: deploy straight from your computer (no GitHub needed)

You need [Node.js](https://nodejs.org) installed (LTS version is fine).

1. Unzip this folder and open a terminal inside it.
2. Run:
   ```
   npm install
   npm run build
   ```
   This creates a `dist/` folder — that's your finished website.

### Option A — Vercel
```
npm install -g vercel
vercel
```
- Log in when prompted (email/GitHub/Google).
- Accept the defaults. Vercel auto-detects Vite.
- It prints a live URL (like `https://booth-xxx.vercel.app`). Open it on your phone.
- To get the permanent production URL: `vercel --prod`

### Option B — Netlify
```
npm install -g netlify-cli
netlify deploy --prod
```
- When asked for the publish directory, enter: `dist`
- It prints a live URL. Done.

### Option C — Netlify Drop (zero command line after build)
1. Run `npm install && npm run build` (creates `dist/`).
2. Go to https://app.netlify.com/drop
3. Drag the **`dist`** folder onto the page.
4. You instantly get a live URL.

---

## Deploy via GitHub (best if you'll keep editing)

1. Create a new repo on GitHub and push this folder to it.
2. Go to vercel.com (or netlify.com) → "New Project" → import that repo.
3. Framework preset: **Vite** (auto-detected). Build command `npm run build`,
   output dir `dist` — already configured here, so just click Deploy.
4. Every future `git push` redeploys automatically.

---

## Put it on your phone like an app

1. Open the live URL in Safari (iPhone) or Chrome (Android).
2. **iPhone:** Share button → "Add to Home Screen."
   **Android:** ⋮ menu → "Add to Home screen" / "Install app."
3. It now launches full-screen from your home screen, no browser bars.

---

## Run it locally first (optional)
```
npm install
npm run dev
```
Open the printed `http://localhost:5173` — and on your phone, open
`http://<your-computer-ip>:5173` while on the same Wi-Fi to preview live.
