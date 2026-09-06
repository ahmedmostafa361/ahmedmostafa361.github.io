# IronPulse Design System

A complete visual language for **IronPulse** — a premium fitness and performance brand. Strength, discipline, transformation, measured progress. The system is built to read like a high-end sports brand and a performance club, not a gym: cinematic dark ground, one hot signal colour, oversized wide display type, hairline structure, photographic depth, and a reactive atmospheric background.

The target reaction is *"this doesn't look like a normal gym website."*

---

## Index

| Path | What it holds |
| --- | --- |
| `styles.css` | The single entry point consumers link. Imports every token file and the component stylesheets. Nothing but `@import` lines. |
| `tokens/` | `fonts.css`, `colors.css`, `typography.css`, `spacing.css`, `radius.css`, `elevation.css`, `motion.css`, `effects.css`, `base.css` |
| `components/` | React primitives, grouped `core/`, `forms/`, `feedback/`, `navigation/`, `brand/` — plus the three class stylesheets they use (`ironpulse-components.css`, `ironpulse-forms.css`, `ironpulse-brand.css`) |
| `ui_kits/ironpulse-web/` | Click-through recreation of the IronPulse website — see its own `README.md` |
| `guidelines/` | 22 specimen cards for colour, type, spacing and brand foundations |
| `assets/img/` | Brand photography (see *Assets* below) |
| `templates/landing-film/` | Starting template: cinematic film hero + editorial section |
| `SKILL.md` | Agent-skill wrapper so this system can be used from Claude Code |
| `thumbnail.html` | Homepage tile |

### Components

**core** — `Button`, `IconButton`, `Badge`, `Tag`, `Card`, `Tooltip`
**forms** — `Input`, `Select`, `Checkbox`, `Radio`, `Switch`
**feedback** — `Dialog`, `Toast`
**navigation** — `Tabs`, `NavBar`
**brand** — `SectionLabel`, `StatFigure`, `MediaFrame`, `RevealText`, `Marquee`, `ReactiveField`

No source design file or codebase defined a component inventory, so this is a standard primitive set sized to the brand. **Intentional additions** (the five in `brand/`) exist because the brief's motion and atmosphere requirements cannot live in a Button: `SectionLabel` (the numbered eyebrow that opens every section), `StatFigure` (the oversized numeral moment), `MediaFrame` (owns the wipe reveal, parallax, grain and scrim for all photography), `RevealText` (the masked line-rise headline entrance), `Marquee` (section seam), `ReactiveField` (the cursor- and scroll-reactive background). `NavBar` is also an addition — the site header is a fixed part of the language, not a per-page composition.

---

## Sources given

- **Reference screenshots** (`uploads/Screenshot 2026-09-05 *.png`) — captures of two competitor sites, **Gold's Gym** and **Crunch Fitness**, supplied as inspiration only. Nothing from either brand is reproduced here: their black-and-yellow and orange-gradient identities, logos, condensed grotesk wordmarks and card-grid layouts were deliberately *not* carried over. What was taken forward, at the level of principle: full-bleed film heroes, oversized all-caps display type, mono caps utility labels, and hard-edged buttons.
- **Brand photography** (`uploads/*.webp`, `og-image.jpg`) — 14 images: dark gym interiors with violet/blue truss lighting and warm practical accents (`hero-athlete`, `about-weights`, `about-gym-floor`), five programme shots, four coach portraits, two social crops. Copied into `assets/img/` with programme/coach naming.
- **`uploads/video gym hero section.mp4`** — a 42-second cinematic hero film was described in the brief but **was not present on the filesystem**. The hero is designed around it: `ui_kits/ironpulse-web/HeroFilm.jsx` points a `<video>` at `assets/video/hero.mp4` and falls back to the `hero-athlete.webp` poster. Drop the file at that path and the hero becomes the film with no code change.
- No Figma file, repository or existing codebase was attached. No logo, icon set or font binaries were supplied.

---

## Content fundamentals

**Voice.** Flat, declarative, technical. The brand states facts about training and lets the numbers carry the emotion. It never shouts encouragement, never uses hype adjectives ("amazing", "ultimate", "insane"), never issues a challenge at the reader ("no excuses"), and never jokes.

**Person.** Mostly no person at all — statements of fact about the club: *"Nothing here is decorative."* When the reader is addressed it is second person, matter-of-fact and slightly restrictive: *"You will never queue for a rack."* Never first-person plural marketing ("we believe…"). Never "I".

**Casing.** Copy is **written in sentence case and set in caps by CSS**, never typed in caps. This matters: contributors write `Claim three days`, the display and mono roles uppercase it. Headlines take no terminal full stop unless the line is a complete sentence used as a statement — *"Power is practised."* keeps its stop because the stop is the point.

**Length.** Headlines 2–5 words per line, hand-broken across two or three lines. Body paragraphs 1–2 sentences, 44–64 characters wide. Button labels 1–3 words. Mono labels under 26 characters. Nothing is padded to fill a column; empty space is the composition.

**Numbers.** Always specific, always with a unit, never rounded to marketing figures: `128 kg`, `96%`, `24/7`, `62% capacity`, `£139/mo`. Units are set in ember at a third of the numeral size. Prefer a measured number over an adjective.

**Vocabulary.** *floor* (not "gym area"), *session* (not "workout"), *programme* (not "plan"), *coached* (not "trained"), *club* (not "location"), *testing* (not "assessment day"), *plate*, *platform*, *rack*, *load*. British spelling: *programme*, *practised*, *centre*.

**Emoji.** Never. Not in UI, not in social copy, not as list bullets. Bullets are an em dash or an ember hyphen.

**Examples.**

> Power is practised. — hero
> Nothing here is decorative. — section headline
> Three floors of calibrated plate, platforms that take a drop, and coaches who write the session before you arrive. — body
> Coached, not supervised. — section headline
> One email a week: the sessions, the numbers, the reading. — newsletter
> Three days confirmed. Check your inbox for the pass. — toast
> Floor open · 62% capacity · Riverside — live telemetry

---

## Visual foundations

### Colour
Dark-first and cool. The ground is a near-black ink ramp with a blue bias (`--ink-000 #05060A` → `--chalk #F4F6FA`), read directly off the supplied photography. **One hot signal colour**: Ember (`--ember-500 #FF4A17`) for actions, active rules, indices, units and live data — never as a fill for large areas, never in a gradient with a second hue. **One atmosphere colour**: Pulse (`--pulse-500 #5346FF`), the violet of the gym's truss lighting, used only in light fields, glows and the occasional badge — never on a button. Semantic colours (`--green-500`, `--amber-500`, `--red-500`) are for status only. Maximum two background values per view: `--surface-void` and one of base/card.

### Type
Three faces. **Display**: Archivo variable at width **125** and weight **900**, uppercase, tracking `-.03em` to `-.045em`, leading `.82`–`.88` — the wide-and-heavy setting is the brand's signature and separates it from the condensed grotesk every gym uses. **UI**: Instrument Sans, 400/500/600, leading 1.55. **Mono**: IBM Plex Mono, uppercase, tracking `.14em`–`.22em`, for eyebrows, captions, nav, metadata and all telemetry. Display and mono do the talking; the UI face stays quiet. Body copy never goes below 14px; slide/hero type is set from `--fs-display-*` and `--fs-mega` clamps.

### Spacing and layout
A 4px base scale to 128px, doubling after 32. Twelve columns, `--grid-gap`, capped at 1680px, with `--gutter` at the page edges. **Compositions are asymmetric on purpose**: a 7-column headline against a 4-column text block starting at column 9; media frames offset vertically by `--space-9` or `--space-11` so a row never lines up; sections separated by `--section-pad-y` (96–192px). Text columns never centre. Negative space is left empty rather than filled. Fixed elements: the sticky `NavBar` (76px, glass then solid) and toasts bottom-right.

### Backgrounds
No decorative gradients and no pattern fills. Sections sit on flat ink and get depth from four stacked layers, all in `ReactiveField`: a cursor-tracked ember light field, a violet counter-field that answers it, a four-column hairline grid, and a vignette — over a 5.5% SVG grain. Full-bleed photography and full-viewport film carry the hero and section transitions. Background response is tied to cursor position and **scroll velocity** (fields brighten as the page moves), so the environment feels alive without moving on its own.

### Photography
Cool, dark, cinematic interiors: violet/blue ambient light with warm practical accents. Treatment is fixed — `saturate(.85) contrast(1.12) brightness(.92)` plus grain, and always a bottom scrim under any type. Portraits are 3/4, floor shots 16/9, and ratios are mixed within a section. A `mono` treatment (grayscale, contrast 1.2) is available for archival or secondary imagery. Photography is never rounded, never bordered, never dropped on a white card.

### Motion
One easing family — `cubic-bezier(.16,1,.3,1)` and its in-out sibling — six durations (80 / 180 / 320 / 640 / 900 / 1600ms) and a 70ms stagger. The language: display type **rises behind a mask** line by line, images **wipe** open via `clip-path`, numerals **count up**, media **drifts** with parallax at .06/.14/.28, the hero **scales and darkens** with scroll, the nav **transitions from glass to solid**, marquees carry the seam between sections. No bounce, no spring, nothing scaling up from zero, and never the same fade-in on every section. All of it collapses under `prefers-reduced-motion`.

### Interaction states
**Hover** — solid buttons lighten to `--ember-400` and lift 2px with an ember glow; ghost buttons take an ember border, ember text and a 7% ember wash; links go chalk → ember; cards raise 4px and their border goes hairline → strong while the image scales 1.04; nav links grow a 1px ember underline from the left; coach names go ember. **Press** — `translateY(0) scale(.985)` on buttons, `scale(.94)` on icon buttons: things compress, never bounce. **Focus** — a two-ring `--glow-focus` (2px ink, then 2px ember-400); inputs take an ember border and a 3px 16%-ember halo. **Disabled** — 38% opacity, no pointer events. **Selected** — ember border, ember text, 8% ember wash.

### Edges, borders, shadows
Square is the default (`--radius-default: 0`). Controls take 2px; only radio, switch and status dots are pill. Structure is drawn with 1px hairlines (`--line-hairline` 10% chalk, `--line-strong` 24%) — a welded grid of cards is `gap: 1px` on a hairline background. Shadows are deep, wide and cool (`--shadow-lift`/`panel`/`modal`) and used only for panels that float: dialogs, toasts, hovering cards. Depth otherwise comes from light and scrim, not from shadow. Ember glow is emission, reserved for live or primary elements.

### Cards
Flat `--surface-card` ground, 1px hairline border, **no radius, no drop shadow at rest, no coloured left border**. Optional media area with a built-in bottom scrim; body is a mono index, a display-face uppercase title, and one muted line. Hover lifts 4px. Glass variant (`--surface-glass` + blur) exists only over photography or film.

### Transparency and blur
Blur is used in exactly three places: the nav over media, the dialog scrim, and `--surface-glass` panels over imagery. Never behind body copy on flat ink, and never as decoration. Scrims (`--scrim-bottom`, `--scrim-top`, `--surface-scrim`) are the protection mechanism for type over media — text is always full-opacity ink over a scrim, never alpha-faded to "soften" it.

---

## Iconography

No icon font, sprite or SVG set was supplied with the brand assets.

- **Substitution flagged:** [Lucide](https://lucide.dev) `0.451.0` from CDN (`https://unpkg.com/lucide@0.451.0/dist/umd/lucide.js`), chosen for its 2px stroke and square terminals, which match the system's hard edges. Every card and kit that needs glyphs loads it from that URL. **If IronPulse has its own icon set, drop it in `assets/icons/` and it replaces Lucide wholesale.**
- **Sizes:** 14px inside `sm` controls, 16px default, 20px standalone. Stroke width 2, `stroke-linecap: square`. Icons inherit `currentColor` and never carry their own colour.
- **Two exceptions** are drawn inline in component source rather than loaded, because they are structural UI marks and must exist without a network dependency: the `Select` chevron and the `Checkbox` tick (plus the `Dialog` close cross). They are drawn to the same 2px/square spec.
- **Permitted "fitness" glyphs:** `dumbbell`, `activity`, `flame` only. Everything else is directional or utilitarian (`arrow-right`, `arrow-up-right`, `play`, `pause`, `volume-2`, `plus`, `minus`, `x`, `chevron-down`, `calendar`, `clock`, `map-pin`, `users`).
- **No emoji, ever.** Unicode is used typographically, not as iconography: `·` as a metadata separator, `—` as a bullet, `◆` as the marquee separator, `→` in text-only actions.
- Iconography is sparse by design. A section gets at most one or two glyphs; numbers and type do the signalling.

---

## Assets

`assets/img/` — 15 files copied from the supplied set:
`hero-athlete.webp`, `about-weights.webp`, `about-gym-floor.webp`, `program-strength.webp`, `program-conditioning.webp`, `program-cardio.webp`, `program-classes.webp`, `program-nutrition.webp`, `coach-sara.webp`, `coach-omar.webp`, `coach-nour.webp`, `coach-ahmed.webp`, `social-2.webp`, `social-6.webp`, `og-image.jpg`.

**No logo was supplied, so none was created.** Wherever a mark belongs, the name is set in the display face — two-tone (`Iron` chalk + `pulse` ember) in nav and footer, solid chalk over photography, hollow stroke at mega scale. See `guidelines/brand-wordmark.card.html`. Supply a real logo and it replaces the wordmark in `NavBar` and the footer.

**Font binaries were not supplied.** Archivo, Instrument Sans and IBM Plex Mono are loaded from Google Fonts in `tokens/fonts.css` as the nearest available matches — Archivo specifically because its variable width axis reaches 125% and can hold the wide-and-heavy display setting. Swapping in licensed binaries touches only that one file.

Photography note: the coach portraits and several programme shots are visibly brighter and greener than the hero and floor images, and they carry a different gym's branding on the walls and kit. They work behind the brand filter but they are not on-palette. A dark, cool reshoot of the coaches would lift the whole system.
