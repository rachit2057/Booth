# Booth — *The booth comes to you.*

A concept platform for **remote digital voting in India** — a government-grade digital companion that carries the ritual, trust, and privacy of the polling booth to the 450 million voters living away from home.

> Independent civic design study · Not affiliated with the Election Commission of India.

## About

Booth reframes the problem that trust in voting is **physical, social, and ritual** — not digital. It enables remote participation while preserving that trust through:

- **Civic Identity** — Aadhaar/EPIC-verified onboarding that auto-detects your home constituency
- **Informed Choice** — candidate matching against manifesto points and voting records
- **The Digital Curtain** — environment lockdown, a 10-second intentional-friction confirm delay, and an anti-coercion re-vote override
- **The Social Ritual** — a non-fakeable digital ink badge

## Tech

A zero-build static site — plain HTML, CSS, and vanilla JS. No dependencies, no framework.

| File | Purpose |
|------|---------|
| `index.html` | All page markup |
| `styles.css` | Design system + components |
| `app.js` | Scroll reveals, counters, the interactive Digital Curtain demo |
| `logo.svg` | Brand mark |

## Run locally

Any static server works, e.g.:

```bash
npx serve .
```

## Deploy

Deployed on **Vercel** as a static site (framework preset: *Other*, no build step). Pushes to `main` auto-deploy.

---

Designed by **Shreya Patle** & **Rachit Kayath** · Group 12 — Emerging Technologies
