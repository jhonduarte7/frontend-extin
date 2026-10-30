# Equi-Extin — Modern B2B Storefront & Industrial Admin ERP

[![React](https://img.shields.io/badge/React-19.3.x-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.3.x-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.x-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![i18n](https://img.shields.io/badge/i18n-ES%20%7C%20EN%20%7C%20PT-E53935.svg)]()
[![License](https://img.shields.io/badge/License-Proprietary-red.svg)]()

Modern, enterprise-grade web application for **Equi-Extin**, an industrial fire safety equipment manufacturer and maintenance workshop based in Caracas, Venezuela. 

The application delivers a dual-purpose architecture:
1. **Public B2B Storefront:** Multi-language catalog with hidden wholesale pricing, dual Call-To-Action buttons ("Request Equipment" vs. "Request Recharge"), and an offcanvas checkout drawer supporting dual tax modalities (*Con IVA* vs. *Sin IVA*).
2. **Secure Admin ERP & AI Copilot:** Industrial management portal with HttpOnly JWT authentication, physical receipt/invoice book replication (SENIAT / Contado slips), multi-currency calculation (USD and Official BCV Bolívares), CRM client fleet tracking with hydro-static test (PH) alerts, workshop stock management, PDF document management, and an AI RAG Assistant featuring real-time Server-Sent Events (SSE) streaming and Model Context Protocol (MCP) tool execution.

---

## Table of Contents

- [1. Technology Stack](#1-technology-stack)
- [2. System Architecture & Core Modules](#2-system-architecture--core-modules)
  - [2.1 Public B2B Storefront](#21-public-b2b-storefront)
  - [2.2 Admin ERP & Fiscal Invoicing](#22-admin-erp--fiscal-invoicing)
  - [2.3 AI Copilot & Document RAG (SSE Streaming)](#23-ai-copilot--document-rag-sse-streaming)
  - [2.4 Internationalization & Localization](#24-internationalization--localization)
  - [2.5 Theme Engine (Dark / Light Mode)](#25-theme-engine-dark--light-mode)
- [3. Project Directory Structure](#3-project-directory-structure)
- [4. Getting Started](#4-getting-started)
  - [4.1 Prerequisites](#41-prerequisites)
  - [4.2 Installation](#42-installation)
  - [4.3 Environment Configuration](#43-environment-configuration)
  - [4.4 Running in Development](#44-running-in-development)
  - [4.5 Production Build & Verification](#45-production-build--verification)
- [5. Continuous Integration (CI/CD)](#5-continuous-integration-cicd)
- [6. Security & State Management](#6-security--state-management)

---

## 1. Technology Stack

| Layer / Concern | Technology | Purpose |
|---|---|---|
| **Core Framework** | React 19 (`react` 19.3.1, `react-dom` 19.3.1) | Component-driven UI rendering with high performance |
| **Build Tool & Bundler** | Vite 8.3 (`vite` 8.3.4, `@vitejs/plugin-react` 6.1.2) | Instant HMR and optimized production bundling |
| **Styling & Design System** | Tailwind CSS 3.4, `tailwindcss-animate`, Lucide Icons | Responsive corporate safety palette (`#E53935`, `#0F172A`) |
| **UI Primitives** | Custom modular components (`Button`, `Card`, `Badge`, `Pagination`) | Accessible, themeable UI components |
| **Routing** | React Router DOM v7 (`react-router-dom` 7.18.4) | Declarative client-side routing with protected admin layouts |
| **API Client** | Axios (`axios` 1.20.0) & Native Fetch Streams | Automatic HttpOnly cookie forwarding (`withCredentials: true`) |
| **Internationalization** | `i18next`, `react-i18next`, `i18next-browser-languagedetector` | Full trilingual support (Spanish `es`, English `en`, Portuguese `pt`) |
| **Code Quality & CI** | GitHub Actions, Oxlint (`oxlint` 1.88.0) | Automated builds, linting, and PR validation |

---

## 2. System Architecture & Core Modules

### 2.1 Public B2B Storefront
- **Protected Wholesale Pricing:** Product prices are hidden by design to accommodate B2B custom quoting agreements.
- **Dual Order Modes:** Every extinguisher card allows clients to choose between purchasing **New Equipment** or requesting a **Recharge & Maintenance Service**.
- **Checkout Drawer (`CartSheet.jsx`):** Allows clients to select tax modality (*Con IVA 16%* vs. *Sin IVA Contado*), enter corporate details (Company name, RIF/CNPJ, Contact Phone, City, and Delivery Address), and submits the order to `POST /api/public/quotes`.
- **Dynamic Extinguisher Graphics (`ExtinguisherIcon.jsx`):** Custom scalable SVG engine providing accurate illustrations for PQS (Dry Chemical Powder), CO2 (Carbon Dioxide), Solkaflam (Clean Agent), Water, and Class K kitchen wet-chemical units with graceful fallbacks.

### 2.2 Admin ERP & Fiscal Invoicing
- **Fiscal Slip Replication (`InvoicesAdminPage.jsx` & `QuoteDetailModal.jsx`):** Exact digital replica of Equi-Extin's physical paper invoice/order book, featuring fiscal control serials (`00-00418X`), tax breakdown (Base Imponible + IVA), payment reference tracking, and printer-ready layout (laser/thermal).
- **Dual Currency Valuation:** Displays values in USD with real-time conversion to official Venezuelan Bolívares (VES) calculated via the top-bar BCV exchange rate.
- **Quotes Lifecycle (`QuotesAdminPage.jsx`):** Status pipeline (`PENDING`, `APPROVED`, `INVOICED`, `REJECTED`) with quick status updates and direct invoice issuing (`POST /api/admin/invoices/pay-and-issue/{quote_id}`).
- **CRM & Preventive Fleet Maintenance (`ClientsAdminPage.jsx`):** Customer directory with hydro-static test (PH) expiration alerts highlighted in corporate red (`#E53935`), cylinder service history, and client profile modaling.
- **Workshop Stock Management (`InventoryAdminPage.jsx`):** Real-time tracking of cylinders, PQS chemicals, CO2 tanks, valves, pressure gauges, and security seals with fast stock adjustments.
- **Unified Global Pagination (`Pagination.jsx`):** Standard 5-records-per-page navigation controls (`<<`, `<`, `>`, `>>`) unified across all admin data tables.

### 2.3 AI Copilot & Document RAG (SSE Streaming)
- **Reactive Streaming (`RagAssistantPage.jsx`):** Directly consumes `POST /api/admin/chat/mcp` via Server-Sent Events (SSE) with `ReadableStream` and `TextDecoder`, rendering tokens word-by-word as generated by local LLMs (Ollama Llama 3.1) to eliminate client timeouts.
- **MCP Tool Calling Visualizer:** Displays real-time status indicators when the model evaluates tools:
  - `DocumentTools.searchInManuals`: Normative fire codes (NFPA 10, COVENIN).
  - `CustomerTools.getCustomerHistory`: Customer equipment history and expired PH records.
  - `CatalogTools.semanticProductSearch`: Extinguisher catalog and technical pricing.
- **Document Management & Contextual Bridge (`DocumentsAdminPage.jsx`):** Drag-and-Drop PDF upload with automatic semantic chunking and embedding storage in `pgvector`. Includes one-click "Ask AI" navigation that transfers document context directly into the RAG Assistant.

### 2.4 Internationalization & Localization
Complete i18n coverage across the entire platform in three business languages:
- 🇪🇸 **Spanish (`es`)**: Primary business language for Venezuelan operations.
- 🇺🇸 **English (`en`)**: International commercial and technical documentation.
- 🇧🇷 **Portuguese (`pt`)**: Regional cross-border trade (Roraima / Brazilian operations).

Language preferences are automatically detected and persisted in `localStorage`.

### 2.5 Theme Engine (Dark / Light Mode)
- Managed via `ThemeContext.jsx` with persistent user preference storage.
- High-contrast dark mode tailored for workshop and operations control rooms.
- Fluid toggle integrated into both the public navbar and admin sidebar.

---

## 3. Project Directory Structure

```text
frontend-extin/
├── .agents/                    # Agentic coding skills and engineering rules
│   └── skills/
├── .github/
│   └── workflows/
│       └── ci-frontend.yml     # Automated CI pipeline for GitHub Actions
├── public/                     # Static assets and favicons
├── src/
│   ├── components/
│   │   ├── ui/                 # Reusable UI primitives
│   │   │   ├── badge.jsx
│   │   │   ├── button.jsx
│   │   │   ├── card.jsx
│   │   │   ├── ExtinguisherIcon.jsx  # SVG vector illustration engine
│   │   │   └── Pagination.jsx        # 5-records-per-page classic pagination
│   │   ├── CartSheet.jsx       # B2B shopping cart & checkout drawer
│   │   ├── CatalogGrid.jsx     # Responsive product showcase
│   │   ├── ClientDetailModal.jsx     # Customer & equipment management modal
│   │   ├── Footer.jsx          # Corporate footer with headquarters & RIF
│   │   ├── HeroSection.jsx     # Landing hero section
│   │   ├── Navbar.jsx          # Public navbar with cart, theme & i18n
│   │   ├── ProductCard.jsx     # B2B product card with dual CTAs
│   │   ├── QuoteDetailModal.jsx      # Physical invoice & quote slip modal
│   │   └── ThemeToggle.jsx     # Dark/light mode switcher
│   ├── contexts/
│   │   ├── AuthContext.jsx     # HttpOnly JWT auth & session provider
│   │   ├── CartContext.jsx     # Cart state, items & tax preferences
│   │   └── ThemeContext.jsx    # Theme preference provider
│   ├── layouts/
│   │   ├── AdminLayout.jsx     # Admin ERP shell with collapsible sidebar
│   │   └── PublicLayout.jsx    # Public storefront layout
│   ├── locales/
│   │   ├── en/translation.json # English i18n dictionary
│   │   ├── es/translation.json # Spanish i18n dictionary
│   │   └── pt/translation.json # Portuguese i18n dictionary
│   ├── pages/
│   │   ├── admin/
│   │   │   ├── ClientsAdminPage.jsx   # CRM & equipment hydro-test alerts
│   │   │   ├── DocumentsAdminPage.jsx # PDF RAG management & pgvector upload
│   │   │   ├── InventoryAdminPage.jsx # Workshop stock & chemical agents
│   │   │   ├── InvoicesAdminPage.jsx  # Physical invoice book & SENIAT slips
│   │   │   ├── LoginPage.jsx          # Secure split-screen login
│   │   │   ├── QuotesAdminPage.jsx    # Quotes management & pipeline
│   │   │   ├── RagAssistantPage.jsx   # AI Copilot chat with SSE streaming
│   │   │   └── ReportsAdminPage.jsx   # Commercial KPIs & sales analytics
│   │   ├── CatalogPage.jsx     # Public filterable catalog
│   │   └── HomePage.jsx        # Public landing page
│   ├── services/
│   │   └── api.js              # Global Axios instance with withCredentials: true
│   ├── App.jsx                 # Routing declaration & ProtectedRoute gates
│   ├── i18n.js                 # i18next configuration & language detector
│   ├── index.css               # Tailwind CSS root styles & custom utilities
│   └── main.jsx                # Application root entry point
├── .gitignore
├── .oxlintrc.json              # Oxlint linting rules
├── index.html                  # HTML5 application shell
├── jsconfig.json               # Path alias resolution (@ -> ./src)
├── package.json
├── tailwind.config.js          # Tailwind theme & corporate palette configuration
└── vite.config.js              # Vite server & build plugins
```

---

## 4. Getting Started

### 4.1 Prerequisites
- **Node.js**: `v20.x` or higher recommended.
- **npm**: `v10.x` or higher.
- **Backend Service (`backend-extin`)**: Running on `http://localhost:8090` (or configured via `.env`).

### 4.2 Installation
Clone the repository and install dependencies:
```bash
cd frontend-extin
npm install
```

### 4.3 Environment Configuration
Create a `.env` file in the root of `frontend-extin` if you need to point to a custom API host:
```env
VITE_API_URL=http://localhost:8090/api
```
*(If omitted, Axios defaults automatically to `http://localhost:8090/api`)*.

### 4.4 Running in Development
Start the local Vite development server with Hot Module Replacement (HMR):
```bash
npm run dev
```
The application will be accessible at:
- Public Storefront: `http://localhost:5173/` (or `http://localhost:5174/`)
- Admin Login: `http://localhost:5173/admin/login`

### 4.5 Production Build & Verification
Compile optimized production assets into `dist/`:
```bash
npm run build
```
Preview the production build locally:
```bash
npm run preview
```

---

## 5. Continuous Integration (CI/CD)

The project includes an automated GitHub Actions workflow configured in [`.github/workflows/ci-frontend.yml`](.github/workflows/ci-frontend.yml):
- **Triggers:** Every `push` and `pull_request` targeting `main` or `master`.
- **Runner:** `ubuntu-latest`.
- **Node.js:** Version 20 with npm package cache.
- **Quality Gates:** Performs clean `npm install` and verifies full production build integrity with `npm run build`.

---

## 6. Security & State Management

- **Stateless HttpOnly Cookies:** Authentication tokens (`jwt_token`) are managed entirely through secure `HttpOnly` cookies. The frontend never stores JWTs in `localStorage` or `sessionStorage`, mitigating Cross-Site Scripting (XSS) token theft.
- **Credentials Forwarding:** Both Axios (`api.js`) and native fetch streams (`ReadableStream`) explicitly pass `withCredentials: true` and `credentials: 'include'`.
- **Protected Routes:** Administrative endpoints are guarded by `<ProtectedRoute>`, which validates active session state against `/api/auth/me` on initial boot and route transitions.
