# Sarga Motorsport 3D F1-style car experience

## Objective

Add a premium interactive Formula-style hero machine experience to the approved
`frontend-motorsport/` homepage without rewriting the existing page or making it
feel like a game UI.

## Placement decision

The 3D experience is placed in the **homepage hero** as the primary wow layer.

Why this location was chosen:

- the existing hero already carries the strongest cinematic motorsport context;
- the right side of the hero has depth room for a machine-layer without harming
  headline readability on the left;
- this lets the 3D feature feel native to the approved design instead of
  appended as a disconnected showcase block.

Mobile uses a lighter premium fallback to keep the first viewport clean.

## Architecture

Implemented files:

```text
frontend-motorsport/src/components/3d/
  F1CarExperience.tsx
  F1CarCanvas.tsx
  F1CarModel.tsx
  F1CarLighting.tsx
  F1CarFallback.tsx
  useReducedMotion.ts

frontend-motorsport/src/components/sections/
  motorsport-hero-3d.tsx

frontend-motorsport/src/lib/3d/
  performance.ts
  model-paths.ts

frontend-motorsport/src/styles/
  motorsport-3d.css
```

## Behaviour

### Desktop

- lazy-loads the hero sequence when the canvas nears the viewport;
- renders a cinematic frame-sequence built from exported motorsport frames;
- uses a right-side framed canvas layer;
- supports light pointer-reactive parallax drift;
- adds smooth scroll-based frame progression with subtle idle motion;
- keeps headline/CTA priority on the left.

### Tablet / mobile

- falls back to the premium poster treatment;
- avoids loading the full desktop sequence in the first viewport;
- preserves clean text and CTA readability.

### Reduced motion

- disables the live motion sequence;
- shows the premium fallback instead.

## Fallback strategy

The homepage no longer requires an external `.glb` file.

If reduced motion is enabled, the device is likely low-end, or the viewport is
below the desktop threshold, the experience
gracefully renders:

```text
/public/images/motorsport/f1-car-fallback.jpg
```

No broken canvas, no crash state, and no blocked hero render.

## Optional future model replacement

If the team later wants a bespoke hero machine, a real-time model can still be
introduced as a future enhancement. The current frame-sequence build is the
default and requires no external 3D asset to ship.

Any future replacement should still follow these rules:

- generic formula / F1-style silhouette only;
- no Ferrari, Red Bull, Mercedes, McLaren, FIA, or other licensed marks;
- target `3-6MB`, hard max `10MB`;
- geometry simplified enough for mobile fallback scenarios;
- compressed textures preferred.

See:

```text
frontend-motorsport/public/models/README.md
```

for replacement and optimization notes.
