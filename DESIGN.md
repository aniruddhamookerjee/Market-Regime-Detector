# Design System: RegimeRadar
**Project ID:** 14971424329467383083

## Color Tokens
- `--regime-bull`: #10B981 (Emerald Green)
- `--regime-bear`: #EF4444 (Crimson Red)
- `--regime-sideways`: #86948A (Slate Gray)
- `--regime-volatile`: #E29100 (Amber Warning)
- `--background`: #0f131d (Very Dark Slate)
- `--surface-card`: #1c1f2a (Dark Elevated Surface)
- `--border-subtle`: #313540 (Inner Borders)
- `--text-primary`: #dfe2f1 (Frost White)
- `--text-secondary`: #bbcabf (Cool Gray)
- `--primary-cta`: #4edea3 (Teal/Emerald active)

## Typography
- **Primary Font**: `Inter` (sans-serif)
- **Monospace Font**: `JetBrains Mono`
- **Label Font**: `Space Grotesk`
- **Size Scale**: Base 16px. `label-sm` (0.6875rem), `display-lg` (3.5rem)
- **Weight Scale**: Regular (400) for body, Medium (500) for labels, Bold (700) for headers.
- **Line Heights**: Relaxed (1.5) for text, tighter (1.2) for metrics.

## Spacing & Layout
- **Spacing Scale**: Base 4px scale. `spacing-2` (8px/0.5rem), `spacing-4` (16px/1rem).
- **Grid Columns**: Intentional asymmetry, flexible grid columns focused on data widths rather than rigid 12-col.
- **Breakpoints**: Mobile-first fluid scaling (sm: 640px, md: 768px, lg: 1024px, xl: 1280px).
- **Card Padding**: Minimal padding (12px to 16px) for data density.
- **Section Gaps**: Generous vertical whitespace between major sections.

## Component Specs
* **RegimeCard**: Minimal padding, glass texture, #1c1f2a background. 1px inner border. Active pulse border on high confidence.
* **PriceChart**: Full-width container. Background bands use semantic regime colors at 15% opacity.
* **MetricCard**: No borders for dividers, uses tonal background shifts (#171b26 vs #0a0e18). Monospace for numbers.
* **RegimeTimeline**: Pill-shaped (`rounded-full`) horizontally scrolling chips. Background at 15% opacity. Solid 1px border for active chip.
* **StrategyPanel**: Tonal layered elevation. Bottom border "Ghost Border" at 15% opacity.
* **RegimeBadge**: Pill-shape, 15% background opacity of regime color, solid text.
* **ConfidenceBar**: Linear gradient fill using `--primary`, animated horizontal progress.

## Motion & Animation
- **Transition Durations**: Fast (150ms) for hovers, Medium (300ms) for layout shifts.
- **Easing Curves**: ease-in-out (`cubic-bezier(0.4, 0, 0.2, 1)`).
- **Pulsing Regime Border Keyframe**: 
  ```css
  @keyframes pulse {
    0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); }
    70% { box-shadow: 0 0 0 4px rgba(16, 185, 129, 0); }
    100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
  }
  ```

## Data Display Rules
- **Decimals**: Standardize to 2 decimal places (e.g. 1.25%).
- **Percentage Sign**: Include `%` on all percentage metrics.
- **Color Thresholds**: 
  - Positive Returns (>0): `--regime-bull` (#10B981)
  - Negative Returns (<0): `--regime-bear` (#EF4444)
  - Neutral/Zero (0): `--text-secondary` (#bbcabf)
