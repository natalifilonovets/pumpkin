# Frank's Jack-o'-Lantern Workshop

A complete buildless English classroom game for grades 5–6 (A1+–A2). Open `index.html`, or serve this directory:

```sh
python3 -m http.server 8080
```

Visit http://localhost:8080. For GitHub Pages, publish this folder as the site's root (all paths are relative). For Genially, host on HTTPS first and embed the hosted page in an iframe. Allow fullscreen and downloads where supported. YouTube and optional Google Fonts need network access; system fonts work offline. The exact YouTube link remains visible for environments that block embedding. Playback completion is manually acknowledged; the game never claims to verify watching.

## Features

Intro → supplied real YouTube video → six transcript-based True/False memories → layered pumpkin composer → glowing lantern and speaking prompts → collectible reward. Every quiz item keeps its own answer key after Fisher–Yates shuffling. Incorrect answers give a hint and require a correct retry. The drawer previews and carved openings share the same paths; 5 × 4 × 5 = 100 combinations. Generated high-resolution pumpkin art is composited with shell rims, clipped cavity shading and warm inner light. No external JS libraries or build dependencies.

Mouse, touch and keyboard: Tab/Enter for all controls; arrow keys, Home and End move and select within each pattern drawer. Reduced motion disables flicker and sparkles. Sound defaults off; the toggle enables genuine synthesized magical tones. No microphone access. PNG export is 1800 × 1980 with only the lantern, frame and name. All image assets are same-origin.

Progress is stored under `hotel-transylvania:mission04:frank:v1`: stage, shuffled order, correct memories, face, lighting, name, sound preference and completion. Starting again resets the active activity but preserves an already-earned collectible. No counters or duplicate collectible records are created. Private/blocked storage shows a warning and keeps the current game running in memory.

## Integrating the hotel map

No parent project, hotel map URL or mission-code format was provided. Continue Adventure opens a local collection handoff and dispatches this event in the game window:

```js
window.addEventListener('hotel:mission-complete', event => {
  // event.detail = { mission: '04', collectible: 'magic-pumpkin-lantern' }
  // Navigate using your existing quest's established mechanism here.
});
```

For a separately hosted Genially parent, configure the parent integration in your own host; the game does not send messages to arbitrary parent origins or invent a destination. The collectible is already persisted before the handoff.

## Artwork

Built-in Imagegen generated the project-bound art, saved locally in `assets/workshop-background.png` and `assets/pumpkin/base.png`. Frank is part of the workshop background, so no separate character layer is needed. Prompts are recorded in `assets/ART_PROMPTS.md`. Miniature previews, carving masks, rim shading and glow are rendered by Canvas. Magical sounds are synthesized, so the props and SFX folders need no downloaded files.

## Validation

Browser QA uses headless Chrome at 1920 × 1080, 768 × 1024 and 390 × 844. It checks all six keys, wrong-answer retries, completion, all 100 face combinations, refresh persistence, real PNG download, and horizontal overflow. See `tests/QA.md` for results and limits.
