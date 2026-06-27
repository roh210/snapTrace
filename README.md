# SnapTrace

> A URL shortener with real-time click analytics, pushed to the browser via Server-Sent Events as they happen.

> [DEMO GIF GOES HERE — 20-30 seconds: create a URL, open the stats view, click the short link in another tab, watch the count update live. This is the single highest-value thing in this whole document. Record it once everything's stable — Loom, or macOS screen recording trimmed in QuickTime, both work fine for a quick GIF via ezgif.com or similar.]

> [LIVE DEMO LINK — once deployed]

## Why this exists

Reading about distributed systems felt hypothetical until I built this. I wanted to implement the theoretical side myself to explore the engineering decisions directly, for example when eventual consistency is appropriate rather than always committing straight to a database write.

I could have reached for Next.js, where frontend and backend live in one framework and a lot of the routing and request handling is abstracted away. I wanted the opposite: to understand the lifecycle of a backend system from first principles. That's why I added Server-Sent Events specifically to learn how server-push actually works, not just use a library. That single decision pulled in pub/sub, write-behind buffering, and an SSE registry.

The frontend was the smaller focus here. Most of my time went into the backend.

## Technical depth

Three things in this build required deep understanding:

- **A write-behind buffer with two consistency models** — click counts tolerate staleness, URL mappings don't
- **An SSE registry holding HTTP Response objects** — after the request that created them has already returned
- **Pub/sub via Node's EventEmitter** — keeping the analytics layer and the real-time layer with zero knowledge of each other

Full breakdown: [ARCHITECTURE.md](ARCHITECTURE.md)

## What I learned

**Distributed systems** — Throughout this project I developed my understanding of distributed systems and how system components interact at large scale. My interest in backend engineering pushed me to look beyond syntax and explore how languages actually work under the hood.

**Node's module cache** — Node caches module exports after first load. The module cache gives you a singleton for free — no class, no `getInstance()`, nothing extra to write. This clicked when tracing why two files importing the same module got the same EventEmitter instance: the cache is keyed by file path.

**Project structure & layering** — "Separation of concerns is good practice" is something we hear often, but seeing this from an architecture perspective made it real. Each file has a single responsibility: routes → controllers → services (business logic) → config. This made things testable and easy to extend.

**Design patterns, applied not memorized** — Instead of using a class for the registry, I used the factory pattern because no inheritance was required. Factory pattern uses closures, which enforces true privacy at runtime in a way TypeScript's `private` keyword doesn't.

**Express conventions** — Order matters more in Express than I expected. Middleware runs top to bottom, and registering the error handler before your routes means every request gets caught before reaching your actual logic.

**Code practices** — Sets turned out to be the right structure for holding open SSE connections. Idempotent inserts mean a reconnecting client can't register twice for the same `shortCode`.

## What I got wrong

There were several challenges along the way:

1. **async/forEach bug** — During the flush in `analytics.service.ts`, I used `forEach` with an async callback. `forEach` doesn't await anything—it fires all promises and moves on. The function looked finished before any database writes happened. Fix: `Promise.all`, which awaits every promise and rejects the whole batch if one fails.

2. **TypeScript `as` cast on expiresAt** — I cast `expiresAt` from Redis as `Date` using `as Date`. At runtime, `as` does nothing—TypeScript erases it at compile time. Redis returns a plain string, so calling `.getTime()` threw immediately. Fix: explicit `new Date(...)` conversion.

3. **Using `closeAll` instead of `remove` in `req.on('close')`** — In the events route, I called `closeAll` instead of `remove` when a client disconnected. `closeAll` ends every connection in the Set for a shortCode. If three clients watched the same URL and one navigated away, the other two lost their streams with no warning. Fix: use `remove` to disconnect only that client.

## Tech Stack

TypeScript · Express · PostgreSQL · Prisma · Redis · Server-Sent Events · Vanilla JS

## Running locally

```bash
npm install
# .env: DATABASE_URL, REDIS_URL, PORT, FLUSH_INTERVAL_MS
npx prisma migrate dev
npm run dev
```

## Links

- [ARCHITECTURE.md](ARCHITECTURE.md) — system design, flows, and decisions in depth
