# CULTURAFT Design System — Phase 2

## Design Direction: Warm Editorial + Contemporary Luxury

The website feels like an established premium furniture company, not a generic ecommerce template.

### Color System

| Token | Value | Usage |
|-------|-------|-------|
| `color.background.warm-ivory` | `#F7F5F0` | Page backgrounds |
| `color.background.soft-cream` | `#EAE5DB` | Section backgrounds, card backgrounds |
| `color.text.deep-espresso` | `#302820` | Primary body text, headline color |
| `color.text.warm-charcoal` | `#393631` | Secondary text, metadata |
| `color.accent.muted-olive` | `#77775D` | Borders, dividers, subtle accents |
| `color.border.subtle` | `rgba(119, 119, 93, 0.1)` | Light borders |
| `color.border.medium` | `rgba(119, 119, 93, 0.25)` | Medium borders |
| `color.background.white` | `#FFFFFF` | White elements, cards |

### Typography Scale

| Token | Value | Usage |
|-------|-------|-------|
| `font.display` | `Cormorant Garamond, Georgia, serif` | Headlines, hero titles |
| `font.body` | `DM Sans, system-ui, sans-serif` | Body text, descriptions |
| `font.serif.heading` | `font-serif font-bold text-3xl lg:text-4xl font-medium leading-snug` | Major section headings |
| `font.serif.subheading` | `font-serif font-medium text-lg` | Subsection headings |
| `font.sans.body` | `font-sans text-base leading-relaxed` | Body paragraphs |
| `font-sans-small` | `font-sanse-sm text-sm` | Small body text, metadata |

### Spacing Scale

| Token | Value | Usage |
|-------|-------|-------|
| `space[1]` | `0.25rem` (4px) | Tight spacing |
| `space[2]` | `0.5rem` (8px) | Small spacing |
| `space[3]` | `0.75rem` (12px) | Medium spacing |
| `space[4]` | `1rem` (16px) | Base spacing |
| `space[5]` | `1.25rem` (20px) | Section spacing |
| `space[6]` | `1.5rem` (24px) | Large spacing |
| `space[8]` | `2rem` (32px) | Section margins |

### Layout Widths

| Token | Value | Usage |
|-------|-------|-------|
| `max-width.container` | `1600px` | Maximum container width |
| `container.padding` | `1.5rem` (24px) | Horizontal padding inside container |
| `section.gap` | `2rem` (32px) | Grid gap between items |

### Border and Shadow Rules

| Token | Value | Usage |
|-------|-------|-------|
| `border.radius.large` | `rounded-xl` | Product cards, modals |
| `border.radius.medium` | `rounded-lg` | Section containers |
| `border.radius.small` | `rounded-md` | Form elements |
| `border.subtle` | `border-border/10` | Light separators |
| `border.medium` | `border-border/25` | Medium emphasis borders |
| `shadow.elevated` | `shadow-sm` | Subtle elevation on hover |
| `shadow.none` | `none` | Avoid card shadows per design direction |

### Image Aspect Ratios

| Token | Value | Usage |
|-------|-------|-------|
| `image.aspect[4/3]` | `aspect-[4/3]` | Product card images |
| `image.object-cover` | `object-cover` | Image fill mode |
| `image.object-contain` | `object-contain` | Logo/image containment |

### Layout Breakpoints

| Token | Value | Usage |
|-------|-------|-------|
| `breakpoint.xs` | `360px` | Mobile smallest |
| `breakpoint.sm` | `640px` | Mobile |
| `breakpoint.md` | `768px` | Tablet |
| `breakpoint.lg` | `1024px` | Laptop |
| `breakpoint.xl` | `1280px` | Laptop/desktop |
| `breakpoint.2xl` | `1440px` | Desktop |

### Button Variants

| Variant | Background | Color | Hover |
|---------|-----------|-------|-------|
| `primary` | `bg-primary` | `text-primary-foreground` | `hover:bg-primary/90` |
| `secondary` | `bg-background/50` | `text-text` | `hover:bg-background/60` |
| `outline` | `border` | `text-text` | `hover:bg-primary/10` |
| `ghost` | `none` | `text-primary` | `hover:bg-primary/5` |

### Product Card Image Rules

- Primary image: `product.images[0]` (first local product image)
- Aspect ratio: `aspect-[4/3]`
- `object-cover` fill mode
- Hover: subtle scale-up `group-hover:scale-105`
- No artificial backgrounds
- Consistent ratios across all cards

### Navigation Links

- Text: `text-sm font-medium` on desktop, `text-sm font-medium` on mobile
- Hover: `hover:text-primary`
- Active/selected state: subtle background highlight
- Mobile drawer: overlay transition

### Focus States

- `focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2`
- `focus-visible:outline-none` used sparingly only when focus ring is provided

### Reduced Motion

- `motion-reduce: transition-duration-0` / `motion-safe: transition-duration-300`
- Applied to all transitions for reduced-motion support

### Interaction Patterns

- **Navigation transitions**: `transition-colors duration-300`
- **Button hover**: `transition-opacity duration-150`
- **Product card image hover**: `transition-transform duration-500 group-hover:scale-105`
- **Focus ring**: `focus-visible` states on all interactive elements
- **Mobile menu**: slide-in overlay with `transition-transform duration-300`

### Accessibility

- Semantic HTML: `<header>`, `<nav>`, `<main>`, `<footer>`, `<section>`, `<article>`
- Keyboard navigation: Tab order preserved, Escape closes mobile menu
- Visible focus indicators: focus-visible rings on all interactive elements
- Alt text: product name + brand description for product images
- Color contrast: minimum 4.5:1 for text, 3:1 for large text
- Reduced motion media query support

## Components Created/Updated

### 1. Global Styles (`src/index.css`)
- Tailwind base styles with custom color variables
- Typographic scale using Cormorant Garamond and DM Sans
- Focus-visible styles for all interactive elements
- Reduced motion defaults

### 2. Typography System
- Cormorant Garamond for serif headlines (editorial, refined)
- DM Sans for sans-serif body text (clean, contemporary)
- Appropriate font fallbacks: `Cormorant Garamond, Georgia, serif` and `DM Sans, system-ui, sans-serif`
- Careful hierarchy: headings scale from text-lg to text-4xl

### 3. Color Tokens (Tailwind CSS 4)
- Defined CSS custom properties in `:root`
- `warm-ivory`, `soft-cream`, `deep-espresso`, `warm-charcoal`, `muted-olive`, `white`
- Used via `color-token` utility pattern

### 4. Header (Premium Responsive)
- Logo/wordmark: CULTURAFT in serif font
- Desktop: horizontal navigation links
- Mobile: menu trigger button that opens drawer
- Search interaction: minimal, integrated
- All navigation links use React Router routes

### 5. Footer (Premium Responsive)
- Brand identity with wordmark
- Short brand introduction: "Premium handcrafted furniture since establishment. Each piece tells a story of traditional craftsmanship and contemporary design."
- Shop navigation (category links)
- Category links
- Contact navigation: Email only if configured, WhatsApp only when real number configured
- Copyright: `2026 CULTURAFT. All rights reserved.`

### 6. ProductCard (Polished Refinement)
- Consistent image aspect ratio `aspect-[4/3]`
- Object-fit: `object-cover`
- No card shadows per design direction
- Hover interaction: scale-up on image
- Price display: `₹` number formatting when available, "Price on Request" when null
- Name: serif font, moderate size
- Category shown when available
- "View Product" link

### 7. Buttons
- Primary: solid primary color
- Secondary: subtle background with text color
- Outline: bordered with text color
- Ghost: text-only with hover background

### 8. Section Container
- Max width: 1600px
- Horizontal margin: auto
- Generous padding: py-8 on desktop, adjusted on mobile
- Section divider: subtle bottom border

### 9. Editorial Headings
- Cormorant Garamond serif font
- Proper hierarchy: text-lg to text-4xl
- No excessive uppercase
- Line-height tuned for readability

### 10. Body Text
- DM Sans sans-serif
- Leading-relaxed for readability
- Text color: deep espresso or warm charcoal
- Size: text-base as base, scaled up/down as needed

## Responsive Breakpoints Test Points

Test at: 360px, 390px, 640px, 768px, 1024px, 1280px, 1440px

- Horizontal overflow: none allowed
- Navigation: collapses to mobile drawer below 768px
- Product grid: 1 column (mobile), 2 columns (tablet), 3 columns (desktop)
- Footer: 1 column (mobile), 2 columns (tablet), 4 columns (desktop)
- Headings: scaled appropriately at each breakpoint

## Mobile Deliberate Design

- Header: compact, menu trigger visible
- Navigation: slide-in drawer, not just compressed links
- Product grid: single column, generous touch targets
- Butons: full-width on mobile, tap-friendly
- Images: full-width, no awkward cropping
- Typography: scaled down but readable, touch-friendly

## Reduced-Motion Support

All transitions respect `prefers-reduced-motion`:
- `motion-reduce: transition-duration-0`
- `motion-safe: transition-duration-300`

This applies to:
- Navigation transitions
- Button hover states
- Product card image zoom
- Mobile menu transitions
- Focus ring animations

## Color Usage in Tailwind CSS 4

Tailwind CSS 4 uses a different approach than v3 - it's utility-first with CSS custom properties. The color tokens are defined as CSS custom properties in the `:root` selector and used via the `color()` function or directly as `bg-[color-token]` patterns.

Since Tailwind CSS 4 doesn't use the `theme.extend.colors` API the same way v3 does, we define the tokens as CSS custom properties:

```css
:root {
  --color-background-warm-ivory: #F7F5F0;
  --color-background-soft-cream: #EAE5DB;
  --color-text-deep-espresso: #302820;
  --color-text-warm-charcoal: #393631;
  --color-accent-muted-olive: #77775D;
  --color-border-subtle: rgba(119, 119, 93, 0.1);
  --color-border-medium: rgba(119, 119, 93, 0.25);
  --color-background-white: #FFFFFF;
}
```

Then used in CSS classes:
```css
.bg-warm-ivory { background-color: var(--color-background-warm-ivory); }
.text-deep-espresso { color: var(--color-text-deep-espresso); }
.border-muted-olive { border-color: var(--color-accent-muted-olive); }
```

In Tailwind 4 config, we can extend the config with:
```js
theme: {
  extend: {
    colors: {
      warmIvory: '#F7F5F0',
      softCream: '#EAE5DB',
      deepEspresso: '#302820',
      warmCharcoal: '#393631',
      mutedOlive: '#77775D',
    }
  }
}
```

And use via `bg-warmIvory`, `text-deepEspresso`, etc. But since Tailwind CSS 4 maps colors differently, we'll use a hybrid approach of CSS custom properties + Tailwind color extension.