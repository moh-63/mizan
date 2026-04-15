# Mizan (ميزان) — Software Architecture Document

> **Shared Household Expense Tracker**
> Version 1.0 | 2026

---


## Table of Contents

1. [Scope](#1-scope)
2. [References](#2-references)
3. [Software Architecture](#3-software-architecture)
4. [Architectural Goals & Constraints](#4-architectural-goals--constraints)
5. [Logical Architecture](#5-logical-architecture)
6. [Process Architecture](#6-process-architecture)
7. [Development Architecture](#7-development-architecture)
8. [Physical Architecture](#8-physical-architecture)
9. [Scenarios](#9-scenarios)
10. [Size and Performance](#10-size-and-performance)
11. [Quality](#11-quality)

[Appendices](#appendices)

---

## List of Figures

| Figure | Description |
|--------|-------------|
| Figure 1 | Entity Relationship Diagram (ERD) |
| Figure 2 | Sign-Up Sequence Diagram |
| Figure 3 | Add Expense Sequence Diagram |
| Figure 4 | Balance Calculation Algorithm |
| Figure 5 | Settle Flow Sequence Diagram |
| Figure 6 | Repository Structure |
| Figure 7 | Deployment Pipeline |
| Figure 8 | Physical Infrastructure Diagram |

---



## 2. References

| Reference | Description |
|-----------|-------------|
| Kruchten, P. (1995) | "The 4+1 View Model of Architecture", IEEE Software |
| Supabase Documentation | https://supabase.com/docs |
| Supabase RLS Guide | https://supabase.com/docs/guides/database/postgres/row-level-security |
| PostgREST Documentation | https://postgrest.org |
| Vercel Documentation | https://vercel.com/docs |
| Figma Design File | (https://www.figma.com/design/5SBe7HBIG1r4e95GMiPpPD/Mizan-UI-Frames?m=auto&t=3zatxUNPwl2I7H6T-1) |

---
---



## 3. Software Architecture

### 3.1 Overview

Mizan is a *serverless, client-rendered web application*. There is no custom application server. All pages are static HTML/CSS/JS files served from a CDN (Vercel), and all backend functionality — authentication, database queries, and security enforcement — is provided by Supabase as a managed service.



### 3.2 Architectural Style

The architecture follows a *thin-client, serverless* style:

- *No application server* — business logic runs in the browser
- *Direct database access* — via Supabase PostgREST with RLS enforcement
- *Static hosting* — no build step; files served as-is from Vercel CDN
- *JWT-based authentication* — sessions managed by Supabase Auth

---



## 6. Process Architecture

The Process View describes the runtime behaviour of the system — the dynamic flows between components.

### 6.1 Runtime Processes

Two processes are active at runtime:

1. *Browser process* — Executes HTML/CSS/JS. Handles rendering, user interaction, local state, and all business logic (balance calculation, client-side filtering/sorting).
2. *Supabase cloud services* — Hosts PostgreSQL, PostgREST API, and Auth. Managed service; no custom server code.

There is no application server process.

### 6.2 Sign-Up Flow

<img width="3730" height="2355" alt="HTML Presentation Layer Flow-2026-04-09-151548" src="https://github.com/user-attachments/assets/86e44b05-40d2-4336-bb89-69bcadc90470" />

Figure 3 — Sign-Up Sequence Diagram

### 6.3 Add Expense Flow

<img width="2995" height="1585" alt="HTML Presentation Layer Flow-2026-04-09-151834" src="https://github.com/user-attachments/assets/b4603667-4cb8-4fc0-bbf6-3ac4ec7188cf" />


Figure 4 — Add Expense Sequence Diagram

### 6.4 Settle Flow

<img width="4245" height="2455" alt="HTML Presentation Layer Flow-2026-04-09-152134" src="https://github.com/user-attachments/assets/f0b80cfb-a438-4ac3-a434-6d373844165c" />

Figure 6 — Settle Flow Sequence Diagram

### 6.5 Concurrency Model

Mizan has no application server, so there is no traditional concurrency concern. The PostgREST API handles concurrent requests from multiple users independently at the database level. PostgreSQL's transaction isolation prevents data corruption. However, *there is no real-time synchronisation* between browser sessions — a page reload is required to see changes made by other household members.

---






## 7. Development Architecture

The Development View describes the static organisation of the codebase, the tech stack, and how the system is built and deployed.

### 7.1 Repository Structure
```
mizan/
1. ├── index.html              # Landing page — CTA + redirect for logged-in users
2. ├── signup.html             # Registration form
3. ├── signin.html             # Login form
4. ├── household.html          # Create household (2 steps) or join with code
5. ├── household-join.html     # Shareable invite link landing page
6. ├── dashboard.html          # Main dashboard: balances, expenses, settle modal
7. ├── add-expense.html        # Add expense form
8. ├── expense_history.html    # Full history with search, filter, sort
9. ├── profile.html            # User info, IBAN editor, household info, sign out
10.├── css/
11.   └── style.css           # Shared design system (tokens, layouts, components)
   │
12.└── js/
13. |  ─ supabase.js         # Supabase client initialisation
14. └── auth.js             # requireAuth() and signOut() helpers
```
*Figure 7 — Repository Structure*

### 7.2 Technology Stack

| Component | Technology | Version |
|-----------|-----------|---------|
| Frontend languages | HTML5, CSS3, JavaScript (ES2020) | — |
| Frontend framework | None (Vanilla JS) | — |
| CSS approach | Custom CSS with CSS custom properties | — |
| Backend / Auth / DB | Supabase | Cloud managed |
| Database | PostgreSQL (via Supabase) | 15+ |
| Database client | Supabase JS SDK | v2 |
| Hosting / CDN | Vercel | — |
| Design | Figma | — |
| Version control | Git + GitHub | — |
| Local dev | VS Code Live Server | — |

### 7.3 Shared Design System

`css/style.css` defines all reusable design tokens and component styles:

**Design Tokens (CSS Custom Properties):**

| Token | Value | Usage |
|-------|-------|-------|
| `--color-primary` | `#7c3aed` | Buttons, links, active states |
| `--color-primary-soft` | `rgba(124,58,237,0.12)` | Focus rings, selected backgrounds |
| `--color-bg` | `#fafaff` | Page background |
| `--color-surface` | `#ffffff` | Cards, panels, nav bars |
| `--color-border` | `rgba(124,58,237,0.15)` | All borders |
| `--color-text-heading` | `#1a0f2e` | Primary text, headings |
| `--color-text-muted` | `#6b5a8e` | Secondary text, placeholders |
| `--color-green` | `#16a34a` | Positive balances |
| `--color-red` | `#dc2626` | Negative balances, delete actions |
| `--font-display` | `Playfair Display, serif` | Headings, amounts |
| `--font-body` | `Inter, sans-serif` | Body text, labels, buttons |
| `--radius-card` | `16px` | Cards and panels |
| `--radius-btn` | `10px` | Buttons and inputs |

**Shared Component Classes:**

- Layout: `.auth-page`, `.auth-card`, `.app-page`, `.app-header`, `.app-content`, `.bottom-nav`
- Forms: `.field`, `.input`, `.btn-primary`, `.btn-secondary`, `.btn-ghost`, `.btn-danger`
- Feedback: `.banner.error`, `.banner.success`, `.spinner`
- Dashboard: `.stat-card`, `.balance-row`, `.expense-row`, `.avatar`, `.cat-badge`
- Modals: `.modal-overlay`, `.modal` (shared by settle and delete modals)

### 7.4 Page Conventions

Every page follows these implementation conventions:

1. Load Google Fonts (Playfair Display + Inter) in `<head>`
2. Link `css/style.css` for shared styles; add a `<style>` block for page-specific styles
3. Load scripts at the bottom in order: Supabase CDN → `js/supabase.js` → `js/auth.js`
4. Check for a valid session on load; redirect to `signin.html` if unauthenticated
5. Check `users.household_id`; redirect to `household.html` if null
6. Render dynamic content by building `innerHTML` strings from Supabase query results

### 7.5 Row Level Security Policy Summary

All five tables have RLS enabled. Policies follow the principle of least privilege:

| Table | SELECT | INSERT | UPDATE | DELETE |
|-------|--------|--------|--------|--------|
| `users` | Own row + household members | Own row only | Own row only | — |
| `households` | Own household + any authenticated user (for invite lookup) | Any authenticated user | — | — |
| `expenses` | Household members only | Household members only | — | Payer only |
| `expense_exclusions` | Household members of related expense | Household members of related expense | — | Household members of related expense |
| `settlements` | Payer or payee | Payer only | — | — |

---

## 8. Physical Architecture

The Physical View describes how software components map to infrastructure.

### 8.1 Infrastructure Overview


<img width="5543" height="2926" alt="HTML Presentation Layer Flow-2026-04-09-154057" src="https://github.com/user-attachments/assets/d3feb99e-88b3-4ac2-92a3-98ec7a11b878" />


*Figure 9 — Physical Infrastructure Diagram*

### 8.2 Platform Responsibilities

| Platform | Role | Notes |
|----------|------|-------|
| **GitHub** | Source code hosting and CI trigger | Every push to `main` triggers Vercel |
| **Vercel** | Static file hosting + CDN | No server-side compute; files served as-is |
| **Supabase** | Auth + Database + API | Managed PostgreSQL + PostgREST + JWT Auth |

### 8.3 Deployment Pipeline

<img width="400" height="1200" alt="HTML Presentation Layer Flow-2026-04-09-154439" src="https://github.com/user-attachments/assets/e9f14492-24ff-44f7-87a2-02e413c2d9bd" />

*Figure 8 — Deployment Pipeline*

No build step is required. Vercel serves `.html`, `.css`, and `.js` files directly. A new deployment is live within seconds of a push.

### 8.4 Network Communication

All communication uses **HTTPS**. The Supabase SDK makes requests to two endpoints:

| Endpoint | Purpose |
|----------|---------|
| `https://<project>.supabase.co/rest/v1/` | PostgREST API — all database queries |
| `https://<project>.supabase.co/auth/v1/` | Auth API — sign up, sign in, sign out, session refresh |

All requests include a `Bearer` JWT in the `Authorization` header. The anon key is also included as `apikey`. RLS policies on the database enforce access control regardless of the key.

### 8.5 Security Model

- **Anon key exposure:** Safe — RLS at the DB layer enforces all access control
- **Transport security:** HTTPS enforced by both Vercel and Supabase
- **Passwords:** Never stored in `public.users`; managed entirely by Supabase Auth
- **Sessions:** JWT stored in `localStorage` by Supabase SDK; auto-refreshed
- **Invite codes:** 6 characters, unambiguous charset (no 0/O or 1/I), expire after 7 days

---

## 9. Scenarios

The Scenarios (Use Case) view illustrates the architecture through the most significant user journeys. Each scenario exercises multiple architectural elements and validates the design.

### UC-01: Register and Create a Household

**Actor:** New user (first roommate in a household)
**Precondition:** User has no existing Mizan account

**Main Flow:**
1. User visits `index.html`, clicks "Create your household" → `signup.html`
2. User enters full name, email, password, IBAN → clicks "Create account"
3. System calls `supabase.auth.signUp()` → Supabase Auth creates user, returns JWT
4. System inserts row into `public.users` with `id = auth.uid()`
5. Browser redirects to `household.html`
6. User enters household name → clicks "Continue"
7. System generates a 6-character invite code, inserts row into `households`
8. System updates `users.household_id` for the current user
9. System shows Step 2: invite code display + copy link button
10. User copies the invite link to share with roommates → clicks "Go to dashboard"

**Postcondition:** Household exists; user is linked to it; invite code is active for 7 days

**Views exercised:** Logical (users, households), Process (sign-up flow), Development (signup.html, household.html), Physical (Supabase Auth + PostgreSQL)

---

### UC-02: Join an Existing Household

**Actor:** Roommate who received an invite link
**Precondition:** Household exists; invite code has not expired

**Main Flow:**
1. User opens `household-join.html?code=A8K9M2`
2. System reads code from URL; queries `households` by `invite_code`
3. System validates code has not expired (`invite_expires_at > now()`)
4. System displays household name and current member count
5. User clicks "Join household"
6. System updates `users.household_id` to the household's id
7. Browser redirects to `dashboard.html`

**Alternate Flow:** User enters code manually on `household.html` via the "Join with code" tab

**Postcondition:** User is a household member and can see all shared expenses

---

### UC-03: Add a Shared Expense

**Actor:** Authenticated household member
**Precondition:** User is authenticated with a `household_id`

**Main Flow:**
1. User navigates to `add-expense.html`
2. System loads all household members dynamically → renders "Paid by" chips
3. User enters amount → description → selects category → selects who paid → optionally excludes members
4. Split summary updates live: `share = amount / participant_count`
5. User clicks "Add Expense"
6. System inserts into `expenses` (household_id, paid_by, description, amount, category)
7. System inserts into `expense_exclusions` for each excluded member
8. Browser redirects to `dashboard.html`
9. Balance calculation runs → dashboard reflects the new expense

**Postcondition:** Expense visible to all members; balances updated across the household

---

### UC-04: View Balances and Settle a Debt

**Actor:** Authenticated member who owes money to another member
**Precondition:** Net balance is negative (user owes someone)

**Main Flow:**
1. User opens `dashboard.html`
2. System loads expenses, exclusions, settlements → runs balance calculation algorithm
3. Balance row shows "you owe [Name] SAR X" with a Settle button
4. User clicks Settle → modal opens with payee name and amount
5. System fetches payee's IBAN from `users` table → displays it in the modal
6. User copies IBAN → makes bank transfer manually via banking app
7. User clicks "Mark as settled"
8. System inserts into `settlements` (payer_id, payee_id, amount, settled_at)
9. `loadDashboard()` runs → balance recalculates → debt row disappears or reduces

**Postcondition:** Settlement recorded; balance between the pair is reduced accordingly

---

### UC-05: Browse and Filter Expense History

**Actor:** Authenticated household member
**Precondition:** At least one expense exists in the household

**Main Flow:**
1. User taps "Expenses" in the bottom navigation → `history.html`
2. System loads all expenses, exclusions, and member names
3. Stat cards show total amount and user's computed share
4. Month dropdown is auto-populated from actual expense dates
5. User selects a month, clicks a category chip, types in the search box
6. All three filters stack; list and stat cards update live (no page reload)
7. User clicks Delete on an expense they paid → delete modal opens
8. User confirms deletion → expense removed from local array → list re-renders

**Postcondition:** User has browsed history with filters applied; optional deletion recorded

---

## 10. Size and Performance

### 10.1 Codebase Size

| Asset | Description |
|-------|-------------|
| 1 shared CSS file | ~750 lines covering the full design system |
| 2 shared JS files | ~30 lines combined (client init + auth helpers) |
| 0 dependencies | No npm packages, no bundler, no build step |
| Total payload per page | ~30–60 KB (HTML + shared CSS + Supabase CDN) |

### 10.2 Performance Characteristics

| Aspect | Approach |
|--------|----------|
| Time to first paint | Fast — static HTML served from Vercel CDN edge nodes globally |
| Database queries per dashboard load | 6 sequential queries (profile, household, members, expenses, exclusions, settlements) |
| Balance calculation | O(E × M) where E = expenses, M = members — runs in-browser, negligible at household scale |
| Client-side filtering | O(N) — operates on in-memory array; no additional DB queries on filter change |
| No caching layer | Fresh data loaded on every page load; acceptable for a household-scale application |

### 10.3 Scale Assumptions

Mizan is designed for household-scale use:

- 2–10 members per household
- Up to a few hundred expenses over the household's lifetime
- No expected concurrent user load beyond the household group
- Users: 10 – 1,000 total users
No caching, pagination, or query optimisation is required at this scale.

---

## 11. Quality

### 11.1 Security

| Attribute | Implementation |
|-----------|----------------|
| Authentication | Supabase Auth — bcrypt passwords, JWT sessions, no custom auth code |
| Authorisation | PostgreSQL RLS — enforced at DB level on every query regardless of client |
| Transport security | HTTPS enforced by both Vercel and Supabase |
| Password storage | Passwords never stored in public.users — managed by Supabase Auth only |
| Invite code security | 6-char code, unambiguous charset, 7-day expiry |

### 11.2 Reliability

| Attribute | Implementation |
|-----------|----------------|
| Data consistency | Balances computed from raw records at runtime — no derived data to become inconsistent |
| Error handling | All Supabase calls wrapped in try/catch; errors displayed via inline banners |
| RLS enforcement | All five tables have RLS enabled; no table has public access |
| Auth guard | Every page checks session on load and redirects if unauthenticated |

### 11.3 Maintainability

| Attribute | Implementation |
|-----------|----------------|
| Design tokens | All colours, fonts, radii, and shadows defined once in css/style.css as CSS custom properties |
| Shared logic | Auth helpers and Supabase client defined once, imported by all pages |
| No framework churn | Vanilla JS requires no dependency updates or framework migrations |
| Consistent conventions | All pages follow the same script loading order, auth check pattern, and rendering approach |

### 11.4 Usability

| Attribute | Implementation |
|-----------|----------------|
| Mobile support | Responsive layouts using CSS Grid and flexbox; tested on iOS Safari |
| Accessibility | Semantic HTML elements, ARIA roles on modals, keyboard navigation (Enter to submit, Escape to close) |
| Feedback | Loading spinners on all async actions; success/error banners on all mutations |
| Empty states | All lists show friendly messages when empty |

---

## Appendices

### Acronyms and Abbreviations

| Acronym | Expansion |
|---------|-----------|
| CDN | Content Delivery Network |
| CSS | Cascading Style Sheets |
| DB | Database |
| ERD | Entity Relationship Diagram |
| FK | Foreign Key |
| HTML | HyperText Markup Language |
| IBAN | International Bank Account Number |
| JS | JavaScript |
| JWT | JSON Web Token |
| PK | Primary Key |
| RLS | Row Level Security |
| SAD | Software Architecture Document |
| SQL | Structured Query Language |
| UC | Use Case |

### Definitions

| Term | Definition |
|------|-----------|
| **Balance** | The net amount of money owed between two household members, computed at runtime from expenses, exclusions, and settlements |
| **Expense** | A shared cost paid by one household member on behalf of some or all members |
| **Exclusion** | A record indicating that a specific member did not participate in a given expense and should not be charged their share |
| **Household** | A group of users sharing a Mizan account, identified by a unique invite code |
| **Invite code** | A 6-character alphanumeric code used to add new members to a household |
| **Settlement** | A recorded manual bank transfer that reduces or eliminates a debt between two household members |
| **Payer** | The member who paid for an expense on behalf of the group |
| **PostgREST** | An open-source server that provides a RESTful API automatically from a PostgreSQL schema |
| **Supabase** | An open-source Firebase alternative providing PostgreSQL, Auth, and a PostgREST API |
| **Vercel** | A cloud platform for static site hosting and edge CDN distribution |

### Design Principles

The following principles guided all architectural and implementation decisions:

1. **Runtime truth over stored derivations** — Balances are computed fresh from raw data on every load. No derived or cached values are stored that could become inconsistent with the source records.

2. **Enforce security at the database, not the client** — All access control is implemented as PostgreSQL RLS policies. Client code is never trusted to enforce data isolation.

3. **One source of truth for shared concerns** — Design tokens live in `css/style.css`; the Supabase client lives in `js/supabase.js`; auth helpers live in `js/auth.js`. No duplication across pages.

4. **No build step unless necessary** — Keeping the stack at plain HTML/CSS/JS eliminates toolchain complexity, speeds up iteration, and makes the project accessible to all team members.

5. **Fail visibly, recover gracefully** — All async operations show loading states, display user-facing error messages on failure, and leave the UI in a consistent state. No silent failures.

6. **Scope discipline** — Features outside the core household-expense use case (payment processing, real-time sync, multi-household) were deliberately excluded to deliver a complete, working product within the 6-week timeline.


