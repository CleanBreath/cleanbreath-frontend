---
inclusion: always
---

# Project Rules: CleanBreath FrontEnd

## 1. Tech Stack & Core Principles

- **Framework**: Next.js 16+ (App Router) with React 19.
- **Styling**: Tailwind CSS v4 (CSS-first configuration).
- **Compiler**: React Compiler (Automatic Memoization).
- **Animation**: Motion (v12, formerly Framer Motion) & tw-animate-css.
- **Icons**: Lucide React.
- **Strictness**: No `any` types, Strict TypeScript.

## 2. React 19 & Next.js 16 Guidelines

- **Server Components**: By default, all components are Server Components.
- **Client Components**: Add `'use client'` only when using hooks (`useState`, `useEffect`) or event listeners.
- **No `forwardRef`**: In React 19, `forwardRef` is not needed. Pass `ref` directly as a prop.
- **Async Components**: Use `async/await` in Server Components for data fetching.

## 3. Internationalization (next-intl) Strategy

- **Folder Structure**: All page routes must be inside `app/[locale]/`.
  - Example: `app/[locale]/page.tsx`, `app/[locale]/projects/page.tsx`.
- **Translations**:
  - Use `useTranslations` hook in Client Components.
  - Use `getTranslations` in Server Components/Metadata.
  - Keep translation keys grouped by feature (e.g., `HomePage.title`).

## 4. Styling (Tailwind v4)

- **No Config JS**: Tailwind v4 uses CSS-native configuration. Do NOT ask for or create `tailwind.config.js` unless necessary for legacy plugins.
- **Dynamic Classes**: Always use `cn()` (clsx + tailwind-merge) for conditional classes.
  - _Good_: `className={cn("p-4", isActive && "bg-blue-500")}`
- **Animation**:
  - Use `motion/react` for complex, physics-based animations (layout transitions, gestures).
  - Use `tw-animate-css` utility classes for simple, one-off entrance animations (e.g., `animate-fade-in`).

## 5. Content & Data (Portfolio Specific)

- **Separation**: Do not hardcode text. Use `src/data/*.ts` or translation files (`messages/*.json`).
- **Images**: Use `next/image`. All local images go to `public/images/`.

## 6. Code Style

- **Imports**: Use `./` alias for imports.
- **Naming**: kebab-case for files (e.g., `project-card.tsx`), PascalCase for components.
- **Export**: Use named exports (e.g., `export function Hero() {...}`).

## 7. Motion (Animation) Rules

- Import from `motion/react` (NOT `framer-motion`).
- Example pattern for component entry:

  ```tsx
  import * as motion from "motion/react-client";
  // or strict client import if needed, generally 'motion/react' works in 'use client' files.

  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
    {children}
  </motion.div>;
  ```

## 8. UI Component System (shadcn/ui)

- **Location**: All base UI components (buttons, inputs, cards, etc.) must be located in the `src/components/ui` directory.
- **Reuse Principle**: Do not create new UI components from scratch; leverage and compose existing components from `src/components/ui` as much as possible.
- **Tailwind v4 Compatibility**:
  - shadcn components must rely on CSS variables (e.g., `--primary`, `--muted`).
  - Color definitions are managed in `src/app/globals.css` within `@theme` blocks or `:root` variables, NOT in `tailwind.config.js`.
  - _Bad_: Looking for `colors: { primary: ... }` in a config file.
  - _Good_: Using `bg-primary` classes, assuming actual colors are referenced from the CSS file.
- **Structure**: Strictly follow Radix UI Primitives and the `cva` (class-variance-authority) pattern.

## 9. MCP Tool Usage Guidelines

Actively utilize the following MCP tools when relevant to the user's request:

- **shadcn**: Use this tool to add, update, or check documentation for shadcn/ui components.
- **chrome-devtools**: Use for debugging CSS/layout issues, inspecting the DOM, or analyzing network activity.
- **next-devtool**: Use for debugging Next.js specific features like App Router, Caching, or Server Actions.
- **puppeteer**: Use for verifying UI rendering, scraping necessary data, or simulating user interactions for testing.
