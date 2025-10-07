<!--
SYNC IMPACT REPORT
- Version Change: None -> 1.0.0
- Added Principles:
  - Technology Stack
  - File Length and Structure
  - OOP First
  - Single Responsibility Principle
  - Modular Design
  - Responsibility Separation Patterns
  - Function and Class Size
  - Naming and Readability
  - Scalability Mindset
  - Avoid God Classes
  - Project Structure
  - File Naming Conventions
  - Server Action Rules
- Removed Sections: SECTION_2_NAME, SECTION_3_NAME
- Templates requiring updates:
  - ✅ .specify/templates/plan-template.md
- Follow-up TODOs: None
-->

# AI Character Animation Constitution

## Core Principles

### Technology Stack

- Bun
- TypeScript
- Next.js
- Tailwind CSS
- shadcn/ui
- Drizzle
- Cloudflare D1
- Cloudflare Workers
- ESLint
- Prettier
- Better Auth
- Stripe
- React Hook Form
- Zod

### File Length and Structure

- Never allow a file to exceed 500 lines.
- If a file approaches 400 lines, break it up immediately.
- Treat 1000 lines as unacceptable, even temporarily.
- Use folders and naming conventions to keep small files logically grouped.

### OOP First

- Every functionality should be in a dedicated class, struct, or protocol, even if it's small.
- Favor composition over inheritance, but always use object-oriented thinking.
- Code must be built for reuse, not just to "make it work."

### Single Responsibility Principle

- Every file, class, and function should do one thing only.
- If it has multiple responsibilities, split it immediately.
- Each view, manager, or utility should be laser-focused on one concern.

### Modular Design

- Code should connect like Lego - interchangeable, testable, and isolated.
- Ask: "Can I reuse this class in a different screen or project?" If not, refactor it.
- Reduce tight coupling between components. Favor dependency injection or protocols.

### Responsibility Separation Patterns

- Use the following directory structure for logic separation:
  - Routing & Pages -> `app/` (Next.js App Router)
  - UI logic -> `hooks/`, `components/`
  - Business logic -> `utils/`
  - State management -> `providers/`
- Never mix view logic and business logic directly in page components.
- Use dependency injection and clear separation of concerns to avoid tight coupling.

### Function and Class Size

- Keep functions under 30-40 lines.
- If a class is over 200 lines, assess splitting into smaller helper classes.

### Naming and Readability

- All class, method, and variable names must be descriptive and intention-revealing.
- Avoid vague names like `data`, `info`, `helper`, or `temp`.

### Scalability Mindset

- Always code as if someone else will scale this.
- Include extension points (e.g., protocol conformance, dependency injection) from day one.

### Avoid God Classes

- Never let one file or class hold everything (e.g., massive Screen, Hook, or Utils).
- Split into `app/`, `hooks/`, `utils/`, `providers/`, etc.

### Project Structure

```
src/
├── app/                # Next.js App Router: pages, layouts, route handlers
│   ├── (auth)/         # Route group for authentication pages
│   │   └── login/
│   │       └── page.tsx
│   └── api/            # API routes
│       └── ...
├── actions/            # Server Actions
├── components/         # Reusable UI components
│   ├── ui/             # Generic, reusable UI components (e.g., buttons, inputs)
│   └── feature/        # Feature-specific components
├── constants/          # Constants and configuration
├── hooks/              # Custom React hooks
├── types/              # TypeScript type definitions
├── utils/              # Business logic, helpers, external service clients
└── providers/          # React Context providers
```

### File Naming Conventions

- App Router: lowercase, special names
  - page.tsx, layout.tsx, template.tsx, loading.tsx, error.tsx
- Components: PascalCase. Suffix with `.client.tsx` or `.server.tsx` if needed for clarity.
  - UserProfile.tsx, ProductCard.tsx, SignInButton.client.tsx
- Hooks: camelCase, starting with 'use'
  - useAuth.ts, useApi.ts, useLocalStorage.ts
- Types: feature name + purpose
  - auth.ts, user.ts, api.ts
- Utils/Lib: camelCase. Group by feature.
  - authUtils.ts, validation.ts, dateFormatting.ts
- Providers: PascalCase + Provider
  - AuthProvider.tsx, ThemeProvider.tsx
- Actions: camelCase. Suffix with `.actions.ts`
  - user.ts, product.ts
- API Routes: route.ts inside `app/api/...` directories.

### Server Action Rules

- Server Actions must only be used for data mutations.
- Do not use them for data fetching (queries) or GET requests.
- Their primary purpose is handling form submissions and state updates via startTransition.

## Governance

All code changes are expected to adhere to the principles outlined in this constitution. Code reviews must validate compliance with these rules.

**Version**: 1.0.0 | **Ratified**: 2025-10-07 | **Last Amended**: 2025-10-07
