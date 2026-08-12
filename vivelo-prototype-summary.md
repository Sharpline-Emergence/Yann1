# Vivelo — Prototype Summary & Call Prep

## What Yann built

A single self-contained HTML file (`prototype.html`, ~760 lines, no framework, no backend) for a product called **Vivelo**. It's a retirement *lifestyle* planner — not a financial tool. Concept: map a retiree's strengths, wishes, and habits across four "pillars," then sell them a weekly activity plan.

### The four pillars
- **Purpose** (gold) — direction, meaning, what you're building toward
- **Connections** (blue) — relationships, social life
- **Mind** (purple) — curiosity, learning
- **Body** (sage green) — physical energy, habits

### Flow (3 fake "pages" toggled via JS, all client-side, nothing persists)
1. **Home** — marketing landing page: hero with animated canvas diagram, stats bar, pillar explainer, "how it works," an inline mini-demo (pick one pillar → see a small preview map), features grid, pricing, testimonials, FAQ, CTA, footer.
2. **Quiz** — 4-step questionnaire: strength chips, "wish you had more time for" chips + free text, social-life single-select + purpose free text, activity-level single-select + bucket-list free text.
3. **Result** — a canvas-drawn "life map": four labeled bubbles with sub-items, connector lines, a print button, and an upsell to "save & get my weekly plan" (no actual account system behind it).

### Pricing already sketched (not implemented, just displayed)
- Free — €0 forever: questionnaire + map + export
- Active — €9/mo: + AI weekly plan, reminders, check-ins
- Explorer — €15/mo: + location-based suggestions, challenge mode

### Design system (the reusable part)
- Fonts: Fraunces (serif, headings) + Inter (body)
- Palette: sage green (#3D6B5E) + gold (#C49A2E) as primary brand colors, plus a purple/blue accent pair for two of the four pillars
- Clean, warm, editorial feel — reads like it's aimed at 60s–70s retirees, not a fintech audience

### Technical state — be clear-eyed about this
- No backend, no database, no auth — the "create an account" and "save my plan" CTAs go nowhere
- No persistence — refresh and all quiz answers vanish
- Canvas-drawn diagrams are neat for a demo but not a real data visualization approach for production
- Pricing/paywall logic is described in copy only, not enforced anywhere
- It's a prototype in the true sense: proves the *feel* of the product, none of the mechanics

## Other things worth asking Yann

- Target audience: is this specifically for retirees (current copy assumes it), or broader (pre-retirement, younger life-planning)?
- Does he want this as a static site (fits your usual GitHub-delivery model) or does it need a real backend from day one (auth, saved profiles, payments) — the "app" ambition in your brief suggests yes eventually
- Any existing backend/data plans, or is this 100% greenfield?
- Does the four-pillar model stay fixed, or is it meant to be configurable/expandable?
- Timeline and what "MVP" means to him — full quiz-to-paid-plan flow, or just the free life-map piece first?
- Any brand/name decisions locked in (Vivelo, .com/.ca availability, etc.) or still open?

## Bottom line

The design language and quiz-to-visual-map interaction pattern are worth keeping — genuinely nice for the intended audience. Get clarity on the open questions above today and I can start real architecture work right after.
