# Codex Prompt: Sarga Motorsport Interactive 3D F1 Car Experience

Create a premium interactive 3D F1-style car experience for the Sarga Motorsport website.

Before doing any implementation, create a new branch:

```bash
git checkout -b feature/motorsport-3d-f1-experience
```

## Role

You are acting as a senior creative frontend engineer, premium UI/UX designer, and WebGL performance engineer.

Use the existing project workspace skills, especially:

```text
.agents/skills/premium-frontend-ui
```

Also inspect any other frontend/design-related skills available under:

```text
.agents/skills/
```

## Project Context

This repository contains multiple Sarga websites:

```text
frontend-gateway/
frontend-motorsport/
frontend-horsesport/
cms/
docs/
prompts/
reference/
assets/
```

This task is only for:

```text
frontend-motorsport/
```

Do not modify `frontend-gateway/`, `frontend-horsesport/`, or `cms/` unless a very small shared documentation/config update is necessary.

The current Motorsport website is already designed and approved. The only goal is to add a premium interactive 3D F1-style car experience that makes the website feel more advanced, memorable, high-end, and international.

## Important Brand Direction

Keep the existing Sarga Motorsport visual language:

- Dark premium background
- Racing red/orange energy
- Teal/blue accent glow
- Bold display typography
- Motorsport editorial photography
- Aggressive but refined racing atmosphere
- High-performance / high-adrenaline tone

Do not make it look like a game UI.
Do not make it childish.
Do not make it too heavy, noisy, or gimmicky.
The final result should feel like a premium racing technology experience.

## Recommended Libraries

Install only what is needed:

```bash
cd frontend-motorsport
pnpm add three @react-three/fiber @react-three/drei gsap
pnpm add -D @types/three
```

Use:

- `three`
- `@react-three/fiber`
- `@react-three/drei`
- `gsap`
- `ScrollTrigger` from GSAP only if needed for scroll-based animation

Do not introduce Spline, Babylon.js, PlayCanvas, or another 3D engine.

## 3D Asset Strategy

Use a generic F1-style / formula racing car model.

Do not use real Formula 1 team logos, Ferrari, Red Bull, Mercedes, McLaren, FIA, or any licensed brand marks.

Expected asset location:

```text
frontend-motorsport/public/models/f1-car.glb
```

If no real GLB model exists yet, create a safe placeholder system:

```text
frontend-motorsport/public/models/README.md
```

Explain that the user must place an optimized generic `f1-car.glb` there.

The implementation must not crash when the model is missing. It must show a premium fallback visual instead.

## Asset Optimization Requirement

Add documentation for model optimization.

Target model requirements:

```text
Format: .glb
Recommended max size: 3-6MB
Hard max size: 10MB
Textures: compressed where possible
Geometry: simplified enough for mobile
No licensed logos
No unnecessary animations baked into model
```

Add optional optimization command examples using `gltf-transform`, but do not require global tools to run the app.

Suggested docs location:

```text
frontend-motorsport/public/models/README.md
docs/motorsport/3d_f1_car_experience.md
```

## Where to Place the 3D Experience

Do not randomly insert the 3D car everywhere.

### Primary Placement: Hero Section

Add a 3D F1 car experience inside the homepage hero area.

The current hero already has strong racing visuals. The 3D car should enhance it, not destroy the approved design.

Desktop behavior:

- Place the 3D car mainly on the right side / background depth layer.
- Keep headline and CTA readable on the left.
- Car should feel like it is emerging from the track/light.
- Use subtle lighting, reflection, and motion.
- Add cursor-reactive rotation/tilt.
- Add scroll-reactive camera movement if performance allows.
- Keep it cinematic and controlled.

Mobile behavior:

- Do not overload the first viewport.
- Use a simplified 3D canvas, or fallback to a static optimized poster image.
- Avoid blocking text or CTA.
- Disable expensive effects on low-end devices.

### Secondary Placement: Optional "Engineering the Thrill" Section

If the hero becomes too crowded, create a dedicated section after the first hero or after the first event block:

```text
Engineering the Thrill
```

This section can showcase:

- Interactive 3D car rotation
- Small technical stat cards
- "Drag to inspect"
- "Scroll to ignite"
- Premium racing-tech visual treatment

Do not add both hero and section if it makes the page too heavy. Choose the best UX.

## Interaction Design

Create a memorable but clean experience.

Desktop:

- Cursor movement subtly rotates the car.
- Scroll moves camera slightly from front-quarter view to side/rear-quarter view.
- Hover/tap can trigger light pulse or engine glow.
- Optional small "Drag to explore" hint.
- Subtle wheel rotation illusion if practical.
- Red rear light glow or underbody glow, not excessive.

Mobile:

- Touch drag rotates the car lightly, or keep it static with subtle auto-rotation.
- Reduce DPR and effects.
- Disable scroll-jacking.
- Never block page scroll.

Accessibility:

- Respect `prefers-reduced-motion`.
- If reduced motion is enabled, disable auto-rotation and scroll animation.
- Canvas must be decorative unless it has controls.
- Provide fallback content/image.
- Do not trap keyboard focus inside canvas.

## Visual Quality Requirements

The 3D section should look premium and integrated with the existing design.

Use:

- Studio-like lighting
- Dark asphalt environment
- Soft red/orange rim light
- Teal/blue accent light
- Subtle reflective ground
- Minimal racing grid/track line pattern
- Premium shadows
- Low-opacity background gradients
- Slight noise/grain overlay if already used in the design system

Avoid:

- Cartoon materials
- Over-bright neon
- Cheap glow
- Overly reflective chrome
- Uncontrolled spinning
- Heavy post-processing
- UI clutter

## Performance Requirements

This must work smoothly on desktop and mobile.

Implement:

- Dynamic import with SSR disabled for the 3D canvas.
- Lazy-load the 3D experience only when near viewport.
- Suspense fallback.
- Error boundary fallback if GLB fails.
- Adaptive DPR.
- Reduced motion support.
- Mobile fallback or simplified settings.
- No unnecessary client components outside the 3D module.
- No layout shift while loading.

Target:

```text
Desktop: smooth interaction
Mobile: clean fallback or lightweight scene
Initial page load: should not be blocked by 3D asset
```

## Proposed File Structure

Create this structure inside `frontend-motorsport/`:

```text
frontend-motorsport/
├── public/
│   ├── models/
│   │   ├── README.md
│   │   └── f1-car.glb
│   └── images/
│       └── motorsport/
│           └── f1-car-fallback.jpg
├── src/
│   ├── components/
│   │   ├── 3d/
│   │   │   ├── F1CarExperience.tsx
│   │   │   ├── F1CarCanvas.tsx
│   │   │   ├── F1CarModel.tsx
│   │   │   ├── F1CarLighting.tsx
│   │   │   ├── F1CarFallback.tsx
│   │   │   └── useReducedMotion.ts
│   │   └── sections/
│   │       ├── MotorsportHero3D.tsx
│   │       └── EngineeringTheThrill.tsx
│   ├── lib/
│   │   └── 3d/
│   │       ├── performance.ts
│   │       └── model-paths.ts
│   └── styles/
│       └── motorsport-3d.css
└── docs/
    └── 3d-f1-car-experience.md
```

Follow existing project conventions if the current structure differs.

## Component Architecture

### `F1CarExperience.tsx`

Top-level client component.

Responsibilities:

- Dynamically render the 3D canvas.
- Decide mobile/fallback behavior.
- Handle reduced motion.
- Provide loading state.
- Provide fallback poster if model fails.

### `F1CarCanvas.tsx`

Canvas wrapper.

Responsibilities:

- Configure `<Canvas>`.
- Configure camera.
- Set DPR.
- Add adaptive performance helpers.
- Add Suspense.
- Add environment/lights.
- Render `F1CarModel`.

### `F1CarModel.tsx`

Model component.

Responsibilities:

- Load `/models/f1-car.glb`.
- Use Drei `useGLTF`.
- Scale and position model.
- Apply subtle material adjustments if safe.
- Animate rotation/position using `useFrame`.
- React to cursor/touch input.
- Never mutate global state.

### `F1CarLighting.tsx`

Lighting setup.

Responsibilities:

- Red/orange key light.
- Teal/blue rim light.
- Soft fill light.
- Ground/reflection effect if performance allows.

### `F1CarFallback.tsx`

Fallback component.

Responsibilities:

- Show premium static visual if WebGL/model unavailable.
- Show no broken UI.
- Keep hero beautiful even without 3D.

## Integration Rules

Integrate into the Motorsport homepage carefully.

Find the current homepage implementation inside:

```text
frontend-motorsport/src/
```

Likely areas:

```text
app/page.tsx
components/sections/
components/home/
```

Add the 3D experience without rewriting the whole page.

Preserve:

- Existing approved layout
- Existing copy
- Existing CMS integration
- Existing navigation
- Existing CTA behavior
- Existing responsive layout

Improve only where necessary to make the 3D feature look native.

## UX Copy Suggestions

Use minimal labels only:

```text
INTERACTIVE TRACK EXPERIENCE
Drag to inspect the machine
Scroll to ignite the grid
```

Optional section title:

```text
ENGINEERING THE THRILL
```

Optional supporting copy:

```text
A digital trackside moment built for speed, precision, and spectacle.
```

Keep copy short and premium.

## Implementation Steps

1. Create new branch:

   ```bash
   git checkout -b feature/motorsport-3d-f1-experience
   ```

2. Inspect current Motorsport homepage and component structure.

3. Inspect available skills:

   ```text
   .agents/skills/premium-frontend-ui
   ```

4. Install required packages.

5. Add 3D component architecture.

6. Add model asset placeholder and documentation.

7. Integrate the 3D experience into the best location:

   - Prefer hero right side if layout supports it.
   - Otherwise create "Engineering the Thrill" section.

8. Add responsive behavior:

   - Desktop full interactive.
   - Tablet simplified.
   - Mobile static or lightweight.

9. Add accessibility and reduced-motion support.

10. Test locally.

11. Provide summary and changed files.

## Testing

Run:

```bash
cd frontend-motorsport
pnpm install
pnpm lint
pnpm build
pnpm dev
```

Also test via Docker if this repo uses Docker Compose:

```bash
docker compose up --build
```

Check:

```text
http://localhost:3001
```

Validate:

- Homepage loads without model.
- Homepage loads with model.
- No build error.
- No hydration error.
- No mobile layout break.
- No text readability issue.
- Reduced motion works.
- Fallback works.
- 3D canvas does not block initial page load.

## Acceptance Criteria

The feature is accepted only if:

- A new branch is created for the work.
- The 3D car experience feels premium, modern, and international.
- The feature is visually aligned with Sarga Motorsport brand.
- It does not break the approved homepage layout.
- It works responsively on desktop, tablet, and mobile.
- It has graceful fallback if WebGL or model loading fails.
- It respects reduced motion.
- It does not introduce licensed racing team logos.
- It does not heavily degrade performance.
- It has clear documentation for replacing/optimizing the GLB model.
- The final summary explains where the 3D experience was placed and why.

## Final Recommendation

Prefer placing the 3D car in the hero area on desktop, behind or to the right of the headline, as the primary "wow layer." Use a lighter fallback poster or simplified static treatment on mobile.

The current Motorsport homepage already has a strong racing concept, so the 3D car should enhance the approved design rather than replacing it.
