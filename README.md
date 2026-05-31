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

A zero-build static site — plain HTML, CSS, and vanilla JS, with [GSAP](https://gsap.com/) loaded from a CDN for the interaction layer. No bundler, no framework.

| File | Purpose |
|------|---------|
| `index.html` | Landing page — hero, the scale, how it works, features, the Digital Curtain demo |
| `research.html` | Case study page — problem framing, field interviews, insights, benchmarks, persona |
| `styles.css` | Design system + components (hybrid light bands + dark product sections) |
| `app.js` | Nav state, scroll-progress, counters, the feature switcher, the Digital Curtain demo |
| `interactions.js` | GSAP enhancement layer — hero entrance, floating/tilting phone, 3D-tilt cards (progressive enhancement) |
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
