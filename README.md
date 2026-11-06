# Squeek Express

A playable pixel railway game powered by hamster movement from Squeekchain. Wake an engineer, choose cargo and a route, grow a locomotive fleet, and send spare crew on expeditions.

## Run locally

Requires Node.js 22.13 or newer (Node 24 recommended). No dependency installation or build step is needed.

```sh
npm start
```

Open http://localhost:4173. A different port can be supplied through `PORT`.

```sh
npm run check
npm test
```

## Publish

For the single-player game only, serve the contents of `dist/` from any static HTTPS host. For the Community Convoy, run the full Node server as described below. `dist/index.html` is the entrypoint. All application imports are relative. The package does not depend on ChatGPT or its sign-in screen. Game source files are the files in `dist/`; they are hand-maintained browser modules, not generated build output.

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

## Privacy and saved-data safety

Fonts use the device’s installed system fonts; no Google Fonts requests are made. Live mode and the stream view contact the official Squeekchain API as described above. Saved expedition names and rewards are restored from built-in definitions. Unknown or malformed expeditions are removed without resetting other valid progress, and expedition names are rendered as text. Local saves remain editable and are not trusted competition records.

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

Single-player browser saves are editable by the player and are not suitable for competitive prizes. The separate Community Convoy uses server-owned progression and global daily rankings when the included Node backend is running; it does not synchronize the main single-player saves. Live mode depends on API availability and browser CORS access. Progress is local; clearing browser storage deletes it. Stars and owned items have no real-money, token, or NFT value.

## Community Convoy (v0.4)

The main game now includes an opt-in, server-backed daily challenge. Everyone contributes toward 100 deliveries per UTC day. Clover costs 20 energy, takes 35 seconds, and earns 100 points; Pine costs 30 energy, takes 55 seconds, and earns 160. Each daily shift starts with 50 energy, capped at 100. New measured official wheel work adds 0.5 energy per unit. The first reading, API recovery, installation/epoch changes and counter decreases establish a baseline without granting historical energy. Dispatch pauses when the official feed is unavailable. A dispatched train finishes according to server time, including while its player is away.

The server computes timing, costs, rewards, daily totals and rankings. It never accepts client scores, browser saves, stars, claimed deadlines, or arbitrary rewards. Anonymous public reads finalize due deliveries exactly once. Practice and existing Live saves remain single-player and separate from this challenge. Top 50 daily finishers appear on the public board; ties sort by completed deliveries then stable player ID. The previous day's unfinished challenge does not carry into the new UTC day.

Community identity uses a random, HttpOnly, SameSite=Strict browser cookie; only its SHA-256 hash is stored. No wallet, password or X account is needed. Names are unverified display names, can be duplicated, and are shown with a short ID. Clearing the cookie loses access to that community identity. This is not a Sybil-proof competition and must not be used to award financial prizes. Registration is limited to ten new identities per IP per hour; actions are limited per identity. Public names and daily scores are stored on the host; Hashed IP addresses are used in expiring local rate-limit records. Use one server instance and a persistent local disk. Do not expose the SQLite database through static hosting.

### Run the full application

**Node 22.13+ is required** for the built-in SQLite database; Node 24 is recommended. No npm dependencies are needed.

```sh
npm start
# Production, behind an HTTPS reverse proxy:
HOST=0.0.0.0 NODE_ENV=production COMMUNITY_DB=/persistent/community.sqlite npm start
```

`PORT` defaults to 4173. Production cookies require HTTPS. Route `/api/community/*` and static `dist/` through the same public origin. Allow outbound HTTPS to `api.squeekchain.com`. Behind a trusted reverse proxy, set `TRUST_PROXY=1` only if it overwrites incoming `X-Forwarded-For`; otherwise leave it unset. The database must be on a persistent mounted disk; ephemeral/serverless filesystem deployments lose rankings on restart. Back up the database using SQLite's backup facilities. Do not run multiple replicas against separate database copies.

A Dockerfile is included. Mount a writable volume at `/app/data` owned by the container's `node` user and terminate HTTPS in front of the container.

**An IPFS-only/static deployment cannot run the community server.** Its community panel explicitly shows unavailable status and does not fabricate global data; the existing game and local rankings still work. Publishing updated `dist/` to IMD alone does not activate global rankings. A persistent Node host or a separately implemented compatible backend is required before claiming a live global service.

### Checks

`npm run check` checks browser and server syntax. `npm test` runs the game/save tests and an actual SQLite/HTTP integration suite covering two players, forged score fields, premature claims, duplicate rewards, API failure/recovery, restart persistence, UTC rollover, rate limits, origin enforcement, and cookie flags. Deterministic API samples are injected only into automated tests; the ordinary server uses the real Squeekchain endpoint.
