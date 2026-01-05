# MulaBoard Design System (Typography & UI)

This document establishes the "Premium & Fun" design language for MulaBoard. All UI updates must adhere to these guidelines.

## 1. Typography

We use a modern, clean, and geometric sans-serif stack to ensure readability while maintaining a premium feel.

### Fonts
-   **Primary Font**: `Geist Sans` (Variable)
    -   Usage: Headings, Body, UI Elements.
    -   Why: Clean, modern, highly legible at small sizes (dashboard data) and impactful at large sizes.
-   **Monospace**: `Geist Mono` (Variable)
    -   Usage: Code snippets, IDs, Mula Meter calculations, Data tables (optional).

### Scale & Hierarchy
| Element | Size (Mobile/Desktop) | Weight | Tracking | Line Height | Usage |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **H1 (Display)** | `3rem` / `4.5rem` | `800` (ExtraBold) | `-0.02em` | `1.1` | Marketing Headlines |
| **H1 (Page)** | `2.25rem` / `3rem` | `700` (Bold) | `-0.01em` | `1.2` | Page Titles |
| **H2** | `1.875rem` / `2.25rem` | `600` (SemiBold) | `-0.01em` | `1.3` | Section Headers |
| **H3** | `1.5rem` / `1.875rem` | `600` (SemiBold) | `normal` | `1.4` | Card Titles |
| **Body (L)** | `1.125rem` | `400` / `500` | `normal` | `1.6` | Intro / Lead text |
| **Body (M)** | `1rem` | `400` (Regular) | `normal` | `1.5` | Default text |
| **Small** | `0.875rem` | `500` (Medium) | `0.01em` | `1.5` | Metadata, Helpers |
| **Tiny** | `0.75rem` | `600` (SemiBold) | `0.02em` | `1.5` | Badges, Captions |

## 2. Color Palette

Our colors should feel "fresh" and "organic" but grounded in a professional UI.

### Mula Rating Colors (The "Fun" Part)
Used for badges, the Mula Meter, and emphasis.
-   🌿 **Golden Mula**: `text-golden-mula` (#FFD700) on `bg-golden-mula-bg` (#FEF9C3)
-   🥕 **Fresh Carrot**: `text-fresh-carrot` (#FF6B35) on `bg-fresh-carrot-bg` (#FED7AA)
-   🍅 **Rotten Tomato**: `text-rotten-tomato` (#DC2626) on `bg-rotten-tomato-bg` (#FECACA)

### Core UI Colors (The "Premium" Part)
-   **Primary**: `emerald-500` (#10b981) - Success, Primary Actions.
-   **Background**: `white` / `zinc-950` (Dark Mode).
-   **Surface**: `zinc-50` / `zinc-900` (Cards).
-   **Border**: `zinc-200` / `zinc-800`.
-   **Text**:
    -   Primary: `zinc-900` / `zinc-50`
    -   Muted: `zinc-500` / `zinc-400`

## 3. Shadows & Depth (Glassmorphism)

To achieve the "Premium" look, use subtle shadows and glass effects.

-   **Card Shadow**: `shadow-[0_2px_8px_rgba(0,0,0,0.08)]` (Light) / `shadow-[0_2px_8px_rgba(0,0,0,0.4)]` (Dark)
-   **Hover Lift**: `hover:-translate-y-1 hover:shadow-lg transition-all duration-300`
-   **Glass Effect**: `bg-white/70 dark:bg-black/70 backdrop-blur-md border border-white/20`

## 4. Components

### Buttons
-   **Radius**: `rounded-lg` (Modern) or `rounded-full` (Playful). *Decision: `rounded-lg` for dashboard, `rounded-full` for landing page CTAs.*
-   **Padding**: `px-6 py-2.5` (Generous touch targets).
-   **Transition**: `active:scale-95` (Feedback).

### Cards
-   **Container**: `bg-card text-card-foreground rounded-xl border border-border shadow-sm`.
-   **Interactive**: Add hover effects for dashboard cards.

### Forms
-   **Inputs**: `h-11 rounded-lg border-input bg-background px-3 py-2 text-sm ring-offset-background`.
-   **Focus**: `focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`.

## 5. Spacing & Layout
-   **Section Padding**: `py-12` (Mobile) / `py-24` (Desktop).
-   **Gap**: Standardize on `gap-4` (Tight), `gap-8` (Section), `gap-12` (Loose).
-   **Container**: `container mx-auto px-4 sm:px-6 lg:px-8`. Max width `max-w-7xl`.

---
*Reference this document when updating any route to ensure consistency.*
