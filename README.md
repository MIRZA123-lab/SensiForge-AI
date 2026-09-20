# SensiForge AI — Final

## What this version fixes
The generator is now an actual deterministic optimization engine instead of a static preset:
- Device model contributes a stable device fingerprint and brand tuning bucket.
- DPI, screen size and refresh rate modify the profile when supplied.
- Role, weapon and 2/3/4-finger setup have separate optimization effects.
- Output is constrained to a coherent 0–200 profile rather than six unrelated values.
- "Re-optimize Pass" performs another controlled optimization pass.
- Real-game calibration buttons apply directional corrections:
  - above head -> reduce relevant aim values
  - below head -> increase relevant aim values
  - overshoot -> reduce fine-aim values
  - too slow -> increase tracking/aim values
- HUD upload is optional and enables a small HUD-aware tuning factor.

## Important engineering limitation
No browser-only calculator can honestly guarantee a universally perfect sensitivity for every player. Actual feel also depends on touch latency, FPS stability, screen protector/friction, device software, network conditions and player technique. This app therefore produces a **near-perfect starting profile** and improves it through calibration.

The phone list is a broad built-in catalog, not a claim that it contains literally every model ever released. For production, replace the array with an updateable device database.

## Run
npm install
npm run dev

## Build
npm run build
