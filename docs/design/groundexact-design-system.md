# GroundExact Design System

## Design thesis

GroundExact should feel like a premium home-improvement publication with a precise utility workspace embedded inside it. It must not resemble a generic SaaS dashboard or a template-heavy AI-generated site.

## Visual character

- Warm editorial background rather than pure white across the whole canvas.
- Dark botanical text and restrained green accents.
- High-contrast numeric results.
- Crisp 1px borders instead of heavy card shadows.
- Technical measurement cues are welcome; decorative gradients and glass effects are not.
- Photography is optional and should never compete with the calculator.
- Icons should be consistent line icons if introduced.

## Existing tokens

The site config is authoritative for brand colors:

- background: `#f5f1e8`
- surface: `#fffdf8`
- text: `#183126`
- muted text: `#617067`
- accent: `#4e6c50`
- accent strong: `#2f4a35`
- border: `#d9d2c5`

Do not introduce a second unrelated palette.

## Typography

Use an editorial display face or a system-safe serif for major headings and a highly readable sans-serif for controls/body content. Typography should carry hierarchy so the UI does not depend on excessive containers.

Requirements:

- H1: visually dominant, tight tracking, short line length.
- Calculator result: largest numeric element in the workspace.
- Labels: direct and specific, never placeholder-only.
- Helper text: smaller but still WCAG-readable.
- Body copy: comfortable line length around 60–72 characters where practical.

## Calculator workspace

Desktop:

`input panel | result panel`

Mobile:

`input panel`
`result panel`

The result must appear immediately after the inputs on small screens. Do not move it below methodology or advertising.

### Result hierarchy

1. Practical purchase recommendation.
2. Raw calculated need.
3. Waste-adjusted amount.
4. Package/weight/coverage equivalent where relevant.
5. Assumptions or supplier-specific caveats.

## Inputs

- Visible `<label>` for every field.
- Unit written in the label or adjacent unit control.
- Appropriate numeric keyboard via `inputmode`.
- Sensible `min`, `max`, and `step` attributes.
- Never silently coerce invalid input to a plausible result.
- Supplier-specific values should state where the user can find them (product label, supplier listing, packaging).

## Buttons

Primary: calculate/update the result.
Secondary: reset or clear.
Tertiary actions: print, share, compare.

Avoid a row of equally prominent buttons.

## Advertising

Ads are monetization, not visual hierarchy.

- Never place an ad between a field label and its input.
- Never visually style an ad like a calculator result or navigation control.
- Reserve ad dimensions to reduce layout shift.
- Do not place an ad where it could be mistaken for the next step in the workflow.
- Initial calculator usability must remain intact with ads blocked.

## Responsive targets

Explicitly QA at approximately:

- 360px
- 390px
- 768px
- 1024px
- 1440px

No horizontal page scrolling is permitted.

## Accessibility

- Keyboard-complete calculator flow.
- Visible focus styles.
- Results announced through a restrained `aria-live` region.
- No meaning conveyed by color alone.
- Minimum interactive target approximately 44×44 CSS pixels where practical.
- Respect reduced-motion settings if motion is introduced later.

## Anti-patterns

Do not use:

- gradient blob backgrounds
- glassmorphism
- neon glows
- excessive pill components
- dashboard sidebars for a public calculator site
- fake reviews or fake usage counters
- dozens of indistinguishable feature cards
- giant rounded containers around every paragraph
- stock AI imagery used as filler

## North-star interaction

**Measure → Calculate → Adjust → Buy**

Every design decision should make that path faster and more understandable.
