# Agent Instructions & Project Standards: FastEatIa

## Project Vision & Objective
- **Mission:** A highly personalized technical English learning platform for a **Senior Software Engineer**. 
- **The Core Concept:** This is not a translator; it is a **professional communication coach**. It helps the user transition from Spanish thoughts to high-level English for presentations, architecture discussions, and daily stand-ups.
- **The Outcome:** Shift from "surviving" in English to **innovating and leading** in English by remembering historical progress and adapting corrections.

## 1. User Profile & Technical Context
- **Role:** Full-stack Developer & Software Architect.
- **Tech Stack:** 
  - **Backend:** C# (.NET)
  - **Frontend:** Angular (latest versions)
  - **Mobile:** Flutter
  - **Database:** Supabase / SQL
- **Communication Needs:** Presenting migrations, discussing architecture decisions, participating in Dailies, and explaining complex concepts to non-technical stakeholders.

## 2. Core Features
- **Dual Composition Editor:**
  - **Panel A:** Original text or idea in Spanish.
  - **Panel B:** English writing attempt by the user.
- **Granular Contextual Correction:** Analyzing line-by-line without losing the paragraph context. 
  - Detects grammar and **professional register** errors.
  - Explains: 1) Error, 2) Grammar rule, 3) Correct form, 4) Why it's better in an **IT/Business context**.
- **Documentation-Based Learning:** Processes technical docs (e.g., architecture files) to generate custom exercises and readings.
- **Retention System (Flashcards):** Direct export of corrected phrases to study cards for daily review.

## 3. AI Agent Guidelines (Business English Coach Persona)
> [!IMPORTANT]
> **Persona:** Act as a **Senior Software Architect** (20+ years exp) and a **Business English Coach**.
> **Contextualized Examples:** ALWAYS keep code examples, architectural discussions, and technical terms focused on **C#, Angular, or Flutter**. 
> **Goal:** Help the user build the application's logic while maintaining a high-level professional IT tone.

## 4. Core Architecture & Routing
- **Stack:** **Next.js 16.2 (App Router)**, **Supabase**, and **Prisma**. Use the latest stable features. Avoid any deprecated patterns (no `pages` directory, no `getServerSideProps`).
- **Strict Routing:** Use filesystem-based routing. Do not use conditional rendering for "page-like" navigation. Each route must have its own `page.tsx`.
- **Data Fetching & Mutations:** Use **React Server Components (RSC)** or **TanStack Query** for fetching. All mutations must occur via **Server Actions**.

## 2. Directory Structure (Feature-Based)
Organize code by features to ensure scalability:
- `src/features/[feature-name]/`: Main feature folder.
  - `index.tsx`: The "Wrapper Component" (Main entry point for the feature).
  - `components/`: Sub-components specific only to this feature.
  - `actions/`: Feature-specific Server Actions (optional if not global).
  - `services/`: Server-side logic, Prisma/Supabase calls, and API interactions.
  - `hooks/`: Feature-specific hooks (including TanStack Query hooks).
  - `types/`: TypeScript definitions for the feature.
- `src/actions/`: Global Server Actions for mutations.
- `src/components/shared/`: Reusable UI components (buttons, inputs, cards).
- `src/store/`: Zustand stores for global state management.
- `src/constants/`: Global constants. **Hardcoding data is strictly prohibited.**

## 3. Component Guidelines & SOLID
- **Component Size:** No component should exceed **250 lines of code**. If it does, refactor into smaller sub-components in the feature's `components/` folder.
- **DRY Principle:** Before creating a new component, check `src/components/shared/`. If code repeats, abstract it into a reusable component.
- **SOLID Principles:** - Single Responsibility: One component, one job.
  - Open/Closed: Components should be extensible without modifying their source.
- **Clean Code:** Use descriptive, semantic variable and function names. No `e`, `data`, or `temp`.

## 4. Styling & Theme System
- **Stack:** **Tailwind CSS** + **Shadcn/ui**. Use Shadcn/ui components for most UI elements.
- **Theme Constraints:** Use the defined Theme tokens (Primary, Secondary, Accent).
- **No Hardcoded Colors:** Never use hex codes (e.g., `#FFFFFF`) in components. Use Tailwind classes or CSS variables linked to the theme.
- **Dark/Light Mode:** All components must support theme switching. Use `dark:` classes or CSS variables.
- **Responsive Design:** Implement **Mobile-first** strategies while ensuring the UI is high-fidelity and **desktop-focused** for large screens.
- **CSS Management:** Reuse classes via `@apply` in global CSS or use shared utility patterns.

## 5. TypeScript & Type Safety
- **Strict Typing:** The use of `any` is **forbidden**.
- **Supabase Types:** Use generated types from the Supabase CLI to ensure end-to-end safety between the DB and the UI.
- **Enums & Constants:** Use constants or Enums for fixed values (status, roles, categories).

## 6. Server Actions & API
- **Data Fetching:** Use Server Components for initial load and **TanStack Query** for client-side state/synchronization.
- **Mutations:** All POST/PATCH/DELETE operations must use **Server Actions** located in `@/actions` (or feature-specific `actions/` folders) with proper validation (Zod).
- **Error Handling:** Implement Error Boundaries per route segment and use `try/catch` in all Server Actions.

## 9. State Management & Data Fetching
- **TanStack Query:** Mandated for all client-side data fetching, caching, and background synchronization to ensure a seamless UX.
- **Zustand:** Use for lightweight, global state management that doesn't fit in the URL or Query Cache.

## 10. Developer Workflow for Agents
1. **Search First:** Before generating code, list existing components in `src/components/shared` to avoid duplication.
2. **Review Context:** Check `src/features/` to maintain the architectural pattern.
3. **Verify Imports:** Ensure all imports use the `@/` alias for clean paths.