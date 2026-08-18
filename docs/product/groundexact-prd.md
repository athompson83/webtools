# GroundExact MVP Product Requirements

## Product thesis

GroundExact is an outdoor-project planning utility site. It is not a generic calculator directory. Its promise is to transform project measurements into an actionable purchase recommendation.

Core journey:

**Measure → Calculate → Adjust → Buy**

## MVP audience

Primary:
- DIY homeowners
- home-improvement shoppers
- small landscaping/property-maintenance operators

Secondary:
- garden-center and material-yard customers
- small contractors needing quick field estimates

## MVP tools

1. Mulch calculator
2. Gravel/stone calculator
3. Topsoil calculator
4. Sod calculator
5. Paver calculator
6. Retaining-wall calculator
7. Fence-material calculator
8. Fertilizer-coverage calculator
9. Grass-seed calculator
10. Cubic-yard/material-volume calculator

## Result contract

Every tool should distinguish:

- raw calculated need
- assumptions
- waste/extra allowance
- adjusted need
- recommended purchase/order quantity
- relevant package/unit equivalents
- limitations

Do not collapse these into one unexplained number.

## Product-specific rules

### Mulch/topsoil
Use area × depth volume. Show cubic yards and bag equivalents where a user supplies/selects package size.

### Gravel/stone
Do not assume one universal density. Volume can be calculated directly; weight requires an explicit density/tons-per-cubic-yard assumption that is visible and editable.

### Sod
Calculate project area and waste-adjusted area. Roll/pallet counts require user-selected or explicit product coverage values.

### Pavers
Paver count must derive from usable face dimensions and project area. Waste is explicit. Do not assume one standard paver size.

### Retaining walls
Base result requires wall length, wall height, block face dimensions, and explicit course/coverage logic. Cap blocks and buried base course must be separately explained assumptions.

### Fence
Separate linear footage, posts, sections/panels, rails/pickets where applicable. Product spacing and panel width are user-visible assumptions.

### Fertilizer
Never infer a universal application rate. The user enters product-label coverage or application rate.

### Grass seed
Never infer a universal seeding rate. The user enters the product-label rate and chooses whether the job is new seeding or overseeding only if the selected product provides distinct values.

### Cubic yards
Support rectangular dimensions and area+depth at minimum. Additional shapes can follow after MVP.

## SEO content contract

Each calculator page includes:

- unique page title and meta description
- one descriptive H1
- calculator above the fold
- 3–5 step instructions
- formula/methodology explanation
- assumptions/limitations
- one independently testable worked example
- useful FAQ content
- related tools
- reviewed/updated date
- citations/sources only for external claims or product-independent reference facts

## UX contract

Mobile-first. A user must be able to complete a calculator while standing in a yard or retail store.

- large tap targets
- numeric keyboards on mobile
- unit labels adjacent to inputs
- plain-language errors
- no forced signup
- no modal before calculation
- no ad between the label and its input
- shareable URL state when practical
- print-friendly result in Beta

## MVP exclusions

- accounts
- authentication
- saved projects
- AI chat
- supplier price APIs
- ecommerce checkout
- live local pricing
- contractor CRM
- lead marketplace
- uploaded images
- database

## Monetization architecture

MVP must be ad-ready but ads can remain disabled until appropriate.

Allowed future revenue:
- display ads
- contextually relevant affiliate links
- supplier sponsorships
- local lead generation after explicit legal/product review
- printable/downloadable professional project reports

Tool usability must not depend on monetization interaction.

## MVP release criteria

- all 10 calculation modules implemented
- formula tests pass
- no placeholder indexable tool pages
- desktop/mobile browser QA passes
- sitemap/robots/canonicals reviewed
- accessibility pass on core flows
- legal pages match actual data use
- performance does not materially degrade from ad placeholders
- analytics events validated when analytics is enabled
