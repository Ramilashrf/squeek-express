# Squeek Express — source and deployment requirements

Source: https://github.com/Ramilashrf/squeek-express

Preserve the existing English pixel railway game, username entry, fixed rails, crew and train perks, cargo, quests, crafting, expeditions and local save compatibility. The three advisory findings have already been fixed in source.

Version 0.4 adds a distinct Community Convoy: a 100-delivery shared daily goal and global daily leaderboard, computed by the Node/SQLite backend under server/. It uses the official live wheel data, separate server-owned energy, timed dispatch and server rewards. Practice or local-save scores must never enter the public board.

IMPORTANT: Hosting dist/ on IPFS alone does not run server/. Do not claim global rankings are live without deploying the persistent Node service, HTTPS, and a writable persistent SQLite disk. No external backend has been provisioned yet. Review this constraint with the owner before any paid deployment request. Static exports show an explicit community-unavailable state.

For a development job, inspect and improve the actual code, run npm run check and npm test, and deliver the updated source in a public GitHub repository with a concrete commit. A review-only or static-host-only job does not satisfy the requested code delivery. Preserve the privacy disclosures and do not invent players, prizes, finalized chain data, wallet requirements or campaign acceptance.
