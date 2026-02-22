# WHE Fest — Style Guide
## Women Health Empowerment Festival · Washington, DC 2026

---

## Brand Identity

**Event Name:** WHE Fest
**Full Name:** Women Health Empowerment Festival
**Tagline:** *Where Women's Intuition Becomes Impact*
**Location:** Washington, DC
**Affiliated:** Moms Across America · MAHA Initiative

---

## Color Palette

| Name            | Hex       | Usage                                      |
|-----------------|-----------|--------------------------------------------|
| Midnight Blue   | `#0B1C2D` | Primary background                         |
| Deep Blue       | `#071422` | Dark sections, hero bg                     |
| Blue Medium     | `#132E47` | Card backgrounds, subtle fills             |
| Deep Gold       | `#C6A75E` | Primary accent, CTAs, highlights           |
| Gold Light      | `#D4BA78` | Gold hover states                          |
| Gold Shimmer    | `#E8D5A0` | Gold gradient highlight point              |
| Gold Dark       | `#A8893E` | Gold gradient shadow point                 |
| Soft White      | `#F8F6F2` | Primary text on dark                       |
| Pure White      | `#FFFFFF` | Headings, max contrast                     |
| Warm Gray       | `#B8B2A8` | Body text, secondary copy                  |
| Muted Gray      | `#6B6560` | Placeholder text, tertiary                 |
| Rich Black      | `#111111` | Section accent bg, button text on gold     |

**Gold Gradient:**
`linear-gradient(135deg, #C6A75E 0%, #E8D5A0 40%, #C6A75E 60%, #A8893E 100%)`

**Gold Shimmer Sweep (horizontal):**
`linear-gradient(90deg, #A8893E 0%, #E8D5A0 40%, #D4BA78 70%, #A8893E 100%)`

---

## Typography

### Font Stack

| Role      | Font                            | Fallback                    |
|-----------|---------------------------------|-----------------------------|
| Headings  | Playfair Display (700, 800)     | Georgia, serif              |
| Body      | Inter (400, 500, 600, 700)      | Helvetica Neue, sans-serif  |
| Accent    | Cormorant Garamond (300 italic) | Georgia, serif              |
| Bold Hero | Impact / Arial Black (900)      | Helvetica Neue, sans-serif  |

### Type Scale (fluid)
- **Hero:** `clamp(5rem, 14vw, 11rem)` — event name display
- **H1:** `clamp(2.5rem, 6vw, 5rem)` — page titles
- **H2:** `clamp(2rem, 4vw, 3.5rem)` — section headings
- **H3:** `clamp(1.5rem, 2.5vw, 2.2rem)` — card headings
- **Body:** `clamp(0.95rem, 0.9rem + 0.3vw, 1.1rem)` — paragraph text
- **Label:** `0.7-0.8rem`, `letter-spacing: 0.25em`, uppercase

### Typography Rules
- Headings: Playfair Display, confident, never condensed
- Accent text: Cormorant Garamond italic, use sparingly for poetry moments
- Body: Inter, clean and legible, `line-height: 1.7–1.9`
- Label/Eyebrow text: Inter Bold, all-caps, tracked, gold color
- Never use script fonts as primary display

---

## Logo System

### Primary Logo
- **"WHE"** — Impact/bold sans, white with gold border, glow effect
- **"fest"** — Cormorant Garamond italic, gold gradient
- **Shield background** — Midnight blue, gold outline
- **5 stars** — Centered above letterforms, gold gradient
- **Subtext** — "WOMEN HEALTH EMPOWERMENT" in small-caps, tracked

### Versions
| Version       | File              | Use Case                          |
|---------------|-------------------|-----------------------------------|
| Primary       | logo.svg          | Website hero, print collateral    |
| Horizontal    | logo-horizontal.svg | Email headers, site nav         |
| White/Light   | logo-white.svg    | Dark print, merchandise           |
| Favicon       | favicon.svg       | Browser tab, app icon             |
| Monochrome    | (TBD by designer) | Single-color print applications   |

### Logo Clear Space
- Minimum clear space: equal to the height of the "F" in "Fest" on all sides
- Minimum digital size: 120px wide
- Never stretch, rotate, or recolor the logo
- Never place on busy photographic backgrounds without overlay

---

## Effects & Motion

### Animations
- **Hero canvas:** Particle field (gold + white particles rising) with light rays
- **Scroll reveal:** Elements fade up with `opacity 0 → 1`, `translateY(30px → 0)`, 0.8s cubic-bezier
- **Gold dividers:** Expand from width:0 → full on scroll entry
- **CTA shimmer:** Diagonal light sweep on hover, 0.6s
- **Sponsor carousel:** Infinite horizontal auto-scroll, pauses on hover
- **Bounce:** Map pin gentle vertical oscillation

### Hover States
- Cards: `translateY(-4px)`, border-color → `#C6A75E`, box-shadow glow
- Buttons: `translateY(-2px)`, enhanced gold glow
- Nav links: Gold underline expands from left

### Transitions
- Fast (interactive feedback): `0.2s ease`
- Base (cards, UI): `0.3s ease`
- Dramatic (reveals): `0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)`

---

## Spacing System

| Token     | Value  | Usage                          |
|-----------|--------|--------------------------------|
| `--xs`    | 0.25rem | Tight inline gaps             |
| `--sm`    | 0.5rem  | Icon-to-text, small padding   |
| `--md`    | 1rem    | Standard padding, gaps        |
| `--lg`    | 2rem    | Card padding, section gaps    |
| `--xl`    | 3rem    | Large padding                 |
| `--2xl`   | 5rem    | Between major sections        |
| `--3xl`   | 8rem    | Hero breathing room           |
| Section padding | `clamp(4rem, 6vw, 8rem)` | Top/bottom per section |

---

## Component Library

### Buttons
- **Primary (Gold):** `bg: #C6A75E`, `color: #111`, shimmer hover, `border-radius: 4px`
- **Outline:** `bg: transparent`, `border: 1px solid #C6A75E`, `color: #F8F6F2`
- **Glow:** Gold bg + `box-shadow: 0 0 20px rgba(198,167,94,0.3)`
- All buttons: uppercase, tracked, font-weight 600

### Cards
- Background: `rgba(11,28,45,0.9)`
- Border: `1px solid rgba(198,167,94,0.2)` → `#C6A75E` on hover
- Border radius: `8px`
- Hover lift: `translateY(-4px)` with gold glow shadow

### Section Labels (Eyebrows)
- Font: Inter 600
- Size: `~0.75rem`
- Color: `#C6A75E`
- Letter-spacing: `0.25em`
- Transform: uppercase
- Usage: Above every section heading

### Track Tags
| Track       | Background                  | Text Color |
|-------------|----------------------------|------------|
| Keynote     | `rgba(198,167,94,0.2)`      | `#C6A75E`  |
| Health      | `rgba(76,175,80,0.12)`      | `#81C784`  |
| Policy      | `rgba(33,150,243,0.12)`     | `#64B5F6`  |
| Empowerment | `rgba(156,39,176,0.12)`     | `#CE93D8`  |
| Nonprofit   | `rgba(255,152,0,0.12)`      | `#FFCC80`  |

---

## Photography & Imagery Direction

### Style
- **Tone:** Warm but powerful. Natural light. Women in motion and in connection.
- **Color treatment:** Photos should be slightly desaturated with gold-warm tone applied as overlay
- **Subjects:** Diverse women in positions of leadership, community, and health
- **Avoid:** Stock photo clichés, overly styled "corporate women" imagery, purely white backgrounds

### Overlay Treatment
For hero images: `rgba(7, 20, 34, 0.7)` gradient overlay, darker at edges

---

## Voice & Tone

| Attribute     | Description                                           |
|---------------|-------------------------------------------------------|
| Confident     | We don't hedge. This matters. She belongs here.       |
| Elevated      | Sophisticated, not academic. Luxe, not cold.          |
| Empowering    | Affirms strength the reader already has               |
| Mission-driven| Every word serves the why                             |
| Non-political | Health sovereignty, not partisan alignment            |
| Warm          | Community over competition                            |

### Power Words
- Sovereign · Intuition · Leadership · Courage · Wisdom
- Community · Movement · Impact · Wellness · Strength
- Transformation · Gather · Empower · Rise · Clarity

### Avoid
- "Grassroots" (connotes small/scrappy)
- Aggressive political framing
- Victim language or fear-based messaging
- Jargon without explanation

---

## Accessibility Standards

- Color contrast: Minimum WCAG 2.1 AA (4.5:1 for body text)
- All images: descriptive `alt` attributes
- All interactive elements: keyboard navigable
- Focus indicators: visible gold ring (`outline: 2px solid #C6A75E`)
- ARIA labels on nav, regions, and icon-only buttons
- Animations respect `prefers-reduced-motion`
