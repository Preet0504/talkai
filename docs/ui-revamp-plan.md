**TalkAI UI Revamp Plan (Phase 0)**

**Audit Summary**
- App structure is split across `src/app/(public)`, `src/app/(auth)`, `src/app/(dashboard)`, with UI shared between `src/components` and `src/modules/*/ui`.
- Duplicate dashboard UI exists in both `src/components/ui/dashboard-*` and `src/modules/dashboard/ui/components/*` (sidebar, user button, trial, navbar). Only the module version is currently wired in `src/app/(dashboard)/layout.tsx`.
- Duplicate table + pagination components exist in `src/components` and `src/modules/agents/ui/components` with minor style drift.
- Duplicate agent search filters and hooks: `agent-search-filter.tsx` vs `agents-search-filter.tsx`, and `use-agent-filters.ts` vs `use-agents-filters.tsx`.
- `next-themes` is used (`src/components/ui/sonner.tsx`, `src/components/ui/world-map.tsx`) but there is no ThemeProvider in `src/app/layout.tsx`, so theme-dependent UI can desync.
- Global tokens reference Geist fonts, but `src/app/layout.tsx` uses Inter. Typography is inconsistent.
- Hard-coded surface colors (`bg-white`) appear in dashboard views (e.g., meetings completed view), which will conflict with dark/high-contrast themes.
- Branding still says “Meet AI” across layout, auth, home, and legal pages.
- Some components appear unused or legacy (e.g., `src/components/ui/dashboard-navbar.tsx` and `src/components/ui/dashboard-search.tsx` are not imported elsewhere).

**IA / Navigation Decisions**
- Keep three top-level shells: Public marketing, Auth, App.
- App shell: persistent left sidebar + compact topbar for global actions and command palette.
- Primary app nav: Meetings, Agents, Usage/Insights (new dashboard overview), Upgrade.
- Agent detail gets a tabbed layout: Overview, Media (voice + face), Settings, Activity.
- Meetings detail keeps state tabs but aligns layout with global cards and status banner.
- Call view becomes an immersive mode with minimal chrome and a quick-access drawer.
- Add a Settings area for Theme, Sound, Media feature flags, and account preferences.

**Visual Language Decisions**
- Typography: pair a confident display font with a neutral UI font (e.g., `Space Grotesk` for headings + `Instrument Sans` for body) and a distinct mono for code.
- Color system: high-contrast graphite neutrals with a vivid accent (teal/green) and a warm secondary highlight; all mapped to semantic tokens in `globals.css`.
- Surfaces: layered panels with soft borders, subtle glass, and depth via shadow tokens.
- Iconography: Lucide stays, but sizes + stroke weight are normalized.
- Backgrounds: atmospheric gradient + subtle noise texture on marketing and dashboards, toned down in the call view.
- Accessibility: explicit high-contrast theme, stronger focus rings, and larger default tap targets.

**Motion / Sound Principles**
- Motion is purposeful: fast cross-fades and 8–12px lifts for cards, 120–220ms durations, easing tokens, and list stagger.
- Respect `prefers-reduced-motion` globally; disable non-essential animation and disable auto-smooth scrolling.
- Page transitions only on major route changes; avoid animating layout shifts.
- Sound is opt-in, muted by default, persisted per user.
- Sound cues limited to key events: join/leave call, success/error toast, new message/notification.
- All audio uses short, soft samples and respects global volume and OS mute.

**Component Cleanup List**
- Consolidate dashboard UI into a single source of truth (prefer `src/modules/dashboard/ui/components`).
- Remove duplicate DataTable/DataPagination in agents module and standardize on shared components.
- Collapse duplicate agent search filters and filter hooks into one implementation.
- Remove or repurpose unused `src/components/ui/dashboard-navbar.tsx` and `src/components/ui/dashboard-search.tsx`.
- Replace hard-coded surface colors (`bg-white`) with semantic tokens.
- Audit unused UI primitives in `src/components/ui` and remove those not referenced.

**Migration Risks**
- Theme provider integration may introduce hydration mismatches; must add `suppressHydrationWarning` and avoid SSR theme flicker.
- Tokenized color changes can expose hard-coded colors and contrast issues across views.
- Consolidating components requires careful import updates to avoid runtime errors.
- Agent schema expansion (voice/face) needs safe defaults for existing agents and DB migrations.
- Media uploads require storage credentials; missing provider keys need robust local fallback.
- Real-time avatar/lip-sync depends on provider capability; must remain behind feature flags with a static avatar fallback.
- Adding sound preferences may require a new user settings store; ensure backward compatibility.
