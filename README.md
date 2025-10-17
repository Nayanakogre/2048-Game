# 2048 - React + TypeScript (Vite)

This is a functional, modular implementation of the 2048 game using React + TypeScript with Vite.

## Quick start

1. Install dependencies:
```bash
npm install
```

2. Run dev server:
```bash
npm run dev
```

Open the URL printed by Vite (usually http://localhost:5173).

## Notes
- Core logic is in `src/game.ts` and implemented as pure functions for easy testing.
- Use arrow keys to play. Press 'R' to restart.
- Change board size using the dropdown (3x3 to 6x6).

## Deployment
Build and deploy with:
```bash
npm run build
```
Then serve `/dist` using Vercel, Netlify, or another static host.
