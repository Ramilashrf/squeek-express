# Squeek Express

A playable pixel railway game powered by hamster movement from Squeekchain. Wake an engineer, choose cargo and a route, grow a locomotive fleet, and send spare crew on expeditions.

## Run locally

Requires Node.js 20 or newer. No dependency installation or build step is needed.

```sh
npm start
```

Open http://localhost:4173. A different port can be supplied through `PORT`.

```sh
npm run check
npm test
```

## Publish

Serve the contents of `dist/` from any static HTTPS host. `dist/index.html` is the entrypoint. All application imports are relative. The package does not depend on ChatGPT or its sign-in screen. Game source files are the files in `dist/`; they are hand-maintained browser modules, not generated build output.

## Gameplay

- Five engineers with distinct outfits and useful rarity-based perks.
- Four purchasable locomotives with speed, revenue, and energy tradeoffs.
- Five stations, including destinations unlocked through completed deliveries.
- Seeds, Express Mail, Ore, and Crystal cargo.
- Eight one-time quests; crafting, resource exchange, and crew expeditions.
- Fixed rails with a moving locomotive.
- English interface, optional sound, and reduced-motion support.

## Squeekchain integration

Live mode polls the official `https://api.squeekchain.com/v1/status` endpoint every five seconds with an eight-second request deadline. Fresh positive `measurement.cumulativeWorkUnits` deltas generate game energy. `measurement.rpmMilli` controls the engineer animation and boost availability. The base conversion is 0.5 energy per newly observed work unit, adjusted by active engineer and generator perks.

The first reading is only a baseline. Duplicate readings, counter decreases, installation/epoch changes, stale readings, reloads, and visibility changes cannot credit lifetime history as new energy. Counter subtraction uses BigInt. Missing data is unknown, not a fabricated zero. Live measured work is not represented as finalized onchain settlement.

Practice mode uses explicitly simulated hamster activity and a separate save. Energy snacks are an independent game mechanic, not a claim about real wheel work.

## Profiles and rankings

Players enter a local engineer name; no X account, wallet, or password is required. Names are not verified or globally reserved. Each name has separate Practice and Live progress in this browser. No data syncs across devices.

The leaderboard ranks profiles saved in the current browser. It is not global. Score is 100 per completed delivery, plus floor(distance in km × 10), 25 per claimed quest, and 40 per completed expedition. Spending stars does not reduce score. There are no seeded fake players.

Existing v2/v3 preview progress is carried into the first local profile. No offline or hidden-tab game progression is awarded.

## Streaming

`?mode=overlay` is an independent ambient live view. It follows the real hamster but does not synchronize a player’s delivery state across OBS and browser profiles.

## Structure

- `dist/index.html`, `dist/style.css`: interface and layout.
- `dist/app.js`: application controls, live feed, and UI state.
- `dist/engine.mjs`: gameplay rules, economics, progression, and telemetry validation.
- `dist/profiles.mjs`: local profiles and leaderboard calculations.
- `dist/scene.mjs`: original procedural canvas art and animation.
- `check.mjs`, `check-profiles.mjs`: executable rule and persistence checks.
- `scripts/serve.mjs`: dependency-free local preview server.

## Current limitations

Single-player browser saves are editable by the player and are not suitable for competitive prizes. Global rankings and authenticated server-side progression are not implemented. Live mode depends on API availability and browser CORS access. Progress is local; clearing browser storage deletes it. Stars and owned items have no real-money, token, or NFT value.
