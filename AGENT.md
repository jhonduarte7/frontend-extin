# AGENT.md — Engineering & Architectural Guide for AI Coding Agents

> **Repository:** `frontend-extin`  
> **Framework:** React 19 + Vite 8.3 + Tailwind CSS 3.4  
> **Domain:** Equi-Extin B2B Fire Safety Storefront & Industrial Admin ERP  
> **Methodology:** Specification-Driven Development (SDD)

---

## 1. Mission & Scope

This document sets the mandatory engineering standards, architectural conventions, and development guidelines for any AI coding agent modifying, extending, or maintaining the `frontend-extin` codebase.

Every change must strictly align with the specifications documented in `docs/frontend-spec.md` and `docs/api-contracts.md`. **Do not invent arbitrary patterns or unneeded dependencies.**

---

## 2. Core Architectural Principles

### 2.1 Component & UI Hierarchy
- **Functional Components & React 19 Hooks:** Always use functional components with standard hooks (`useState`, `useEffect`, `useRef`, `useMemo`, `useCallback`). Do not use class components.
- **Atomic UI Primitives:** Reusable primitives live strictly in `src/components/ui/` (`button.jsx`, `badge.jsx`, `card.jsx`, `Pagination.jsx`, `ExtinguisherIcon.jsx`). Use the `cn(...)` utility (`clsx` + `tailwind-merge`) from `@/components/ui/utils` for conditional class joining.
- **Feature Components:** Composite domain components live in `src/components/` (e.g., `CartSheet.jsx`, `QuoteDetailModal.jsx`, `ClientDetailModal.jsx`).
- **Page Views:** Route endpoints live in `src/pages/` and `src/pages/admin/`. Keep page components focused on orchestration and state binding; delegate presentation details to domain components.

### 2.2 Styling & Corporate Design System
- **Corporate Palette:**
  - Primary Red (Fire Safety): `#E53935` / hover `#D32F2F`
  - Dark Slate (Background & Typography): `#0F172A`, `#1E293B`, `#334155`
  - Light Slate (Background & Cards): `#F8FAFC`, `#FFFFFF`, `#F1F5F9`
  - Accent / Alerts: Emerald for active/paid (`#10B981`), Amber for pending/warnings (`#F59E0B`), Red for expired PH or critical errors (`#E53935`).
- **Dark Mode Compatibility:** Every visual element MUST provide explicit dark variants using Tailwind's `dark:` modifier (e.g. `bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border-slate-200 dark:border-slate-800`).
- **No Inline Styles:** Use Tailwind CSS utility classes exclusively. Never hardcode inline style objects unless calculating dynamic positioning or CSS custom properties.

### 2.3 Internationalization (i18n) Mandate
- **Trilingual Parity:** All user-facing labels, placeholders, titles, notifications, and button captions MUST use the `useTranslation` hook (`const { t } = useTranslation();`).
- **Dictionary Files:** Any new translation key MUST be added simultaneously across all 3 locale files:
  - `src/locales/es/translation.json` (Spanish)
  - `src/locales/en/translation.json` (English)
  - `src/locales/pt/translation.json` (Portuguese)
- **Fallback Strings:** Always provide a sensible fallback in the `t()` function call:
  ```jsx
  t('admin.quotes.invoiceTitle', 'Factura de Talonario')
  ```

---

## 3. Communication with the Backend (`backend-extin`)

### 3.1 Security & HttpOnly Cookie Authentication
- **No Token Storage:** The client application NEVER stores JWT tokens in `localStorage`, `sessionStorage`, or cookies via JavaScript.
- **Cookie Forwarding:** Authentication relies on an `HttpOnly` cookie named `jwt_token` issued by the backend at `POST /api/auth/login`.
- **Axios Configuration (`src/services/api.js`):**
  - Always use the pre-configured `api` instance which sets `withCredentials: true`.
  - Base URL is driven by `import.meta.env.VITE_API_URL` or defaults to `http://localhost:8090/api`.
- **Reactive Streaming (`fetch`):** When performing streaming requests (e.g., SSE at `POST /api/admin/chat/mcp`), you MUST pass `credentials: 'include'` in the `fetch` options:
  ```javascript
  const response = await fetch(`${baseUrl}/admin/chat/mcp`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'text/event-stream, text/plain',
      'X-Chat-Id': activeChatId,
    },
    body: JSON.stringify({ prompt, chat_id: activeChatId }),
  });
  ```

### 3.2 Error Handling Contract
- The backend returns standardized error bodies adhering to `ErrorResponseDto`:
  ```json
  {
    "timestamp": "2026-10-30T17:00:00",
    "status": 401,
    "error": "Unauthorized",
    "message": "Authentication required. Please log in.",
    "path": "/api/admin/quotes"
  }
  ```
- Always inspect `error.response?.data?.message` before falling back to generic network errors.

---

## 4. Key Domain Features & Rules of Implementation

### 4.1 B2B Storefront & Hidden Pricing
- Do NOT display prices on public product cards (`ProductCard.jsx`). The wholesale B2B business model uses custom negotiated quotes.
- Always offer the dual CTA: "Solicitar Nuevo" (`NEW`) and "Solicitar Recarga" (`RECHARGE`).
- Maintain the persistent cart in `CartContext.jsx` with support for dual tax modalities (`appliesIva: true` for 16% fiscal invoices vs. `appliesIva: false` for direct cash delivery slips).

### 4.2 Fiscal Receipts & Physical Slip Book
- In `QuotesAdminPage.jsx` and `InvoicesAdminPage.jsx`, follow the physical paper receipt layout of Equi-Extin:
  - Header with official RIF (`V-12226621-0`), phone numbers, and physical headquarters.
  - Clear distinction between *Con IVA* (Base + 16% Tax) and *Sin IVA* (Contado / Nota simple).
  - Dual currency amounts: Total in USD alongside its official conversion to Venezuelan Bolívares (`Bs.`) based on the active BCV rate.
  - Printable layout compatible with laser printers and receipt printers.

### 4.3 Unified Global Pagination
- All administrative tables MUST utilize the reusable component `Pagination.jsx` located at `src/components/ui/Pagination.jsx`.
- Standard page size is strictly **5 records per page** (`size = 5`).
- Ensure navigation buttons (`<<`, `<`, `>`, `>>`) disable automatically at boundary pages.

### 4.4 AI Copilot with SSE Streaming
- In `RagAssistantPage.jsx`, maintain the reactive streaming reader using `ReadableStream` (`getReader()`).
- Accumulate tokens in real time and render them safely using `MarkdownView`.
- Do NOT revert streaming back to synchronous polling or short-timeout Axios calls.
- Show the animated tool calling status indicator while MCP tools execute and hide it smoothly when token streaming begins.

---

## 5. Development Workflow & Commands

### 5.1 Verification Commands
Before concluding any task or pushing code, the AI agent must run:
```bash
# 1. Verify build and module bundling
npm run build

# 2. Run lint checks
npm run lint
```

### 5.2 Development Server
```bash
npm run dev
```

---

## 6. Commit Message Standards

All Git commit messages MUST follow the [Conventional Commits](https://www.conventionalcommits.org/) specification in English:

- `feat(scope): add new capability`
- `fix(scope): resolve bug or visual defect`
- `refactor(scope): internal code cleanup without functional change`
- `docs(scope): update documentation or README`
- `chore(scope): build, dependencies, or configuration update`

**Examples:**
- `feat(rag): implement SSE streaming reader for Ollama assistant`
- `fix(invoicing): correct BCV currency calculation in physical slip modal`
- `docs(readme): add enterprise architectural documentation and agent guide`
