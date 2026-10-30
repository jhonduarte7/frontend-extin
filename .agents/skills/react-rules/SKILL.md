---
name: react-rules
description: Standards and best practices for building React 19+ applications with TypeScript, Zustand, Zod, React Hook Form, TanStack Query/SWR, and Tailwind CSS. Use this skill whenever the user requests creating a React application or project, creating or modifying React components, custom hooks, state management with Zustand, forms with React Hook Form and Zod validation, API data fetching, styling with Tailwind CSS, or refactoring and applying React best practices.
---

# React Best Practices & Architecture Standards

Guidelines and conventions for developing modern, scalable, and type-safe React applications.

---

## 1. Core Tech Stack & Tooling

- **React Version**: Use **React 19.2.5 or higher** (latest stable release). Refer to the official [React npm package](https://www.npmjs.com/package/react) for version verification.
- **Language**: Use **TypeScript** strictly instead of JavaScript. Enable strict type checking (`strict: true`) to ensure type safety, clean interfaces, and maintainability.
- **Component Style**: Use functional components with explicit TypeScript typings for props and return types (or inferred `React.JSX.Element`).
- **Styling**: Use **Tailwind CSS** for utility-first styling with responsive design, modern dark mode support, and utility merge helpers (`clsx` + `tailwind-merge`).

```tsx
interface UserCardProps {
  name: string;
  email: string;
  onSelect: (email: string) => void;
}

export const UserCard: React.FC<UserCardProps> = ({ name, email, onSelect }) => {
  return (
    <div
      className="cursor-pointer rounded-lg border border-neutral-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900"
      onClick={() => onSelect(email)}
    >
      <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">{name}</h3>
      <p className="text-sm text-neutral-500 dark:text-neutral-400">{email}</p>
    </div>
  );
};
```

---

## 2. Component Design & Render Purity

- **Single Responsibility**: Keep components small, simple, and focused on a single responsibility.
- **Avoid Over-Complexity**: Split large monolithic components into focused sub-components.
- **Pure Rendering**:
  - Components and custom hooks must remain pure functions of their props and state.
  - Never trigger side effects (DOM mutation, timers, external mutations) directly during render.
  - Side effects belong exclusively inside event handlers or `useEffect` (for external synchronization).
- **Parent-Child Communication**:
  - Pass callback functions via props (`onAction`, `onSelect`, `onChange`) from parent to child.
  - Children invoke these callbacks when relevant state changes occur, avoiding reverse coupling.

---

## 3. State Management Disciplines

### Client State with Zustand
- Use **Zustand** for global application and client-side UI state.
- Create stores with `create()`, defining both the state properties and action functions within the store definition.

```typescript
import { create } from 'zustand';

interface AuthState {
  user: { id: string; email: string; role: string } | null;
  isAuthenticated: boolean;
  login: (user: { id: string; email: string; role: string }) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  login: (user) => set({ user, isAuthenticated: true }),
  logout: () => set({ user: null, isAuthenticated: false }),
}));
```

### Server State with React Query or SWR
- Use **TanStack Query (React Query)** or **SWR** for asynchronous server state:
  - Caching and deduplication of API requests.
  - Automatic background re-fetching and synchronization.
  - Error and loading state management.
- Do not store API responses manually in local or global client stores when a dedicated server-state tool fits.

### State Immutability
- **Never mutate state directly**.
- Always return new references when updating state (e.g., using object spread `{ ...prev, key: value }` or array copy methods `[...items, newItem]`, `.map()`, `.filter()`).

### State Reset & Synchronization
- **Component Identity**: Use the React `key` prop on a component to reset its entire internal state when its entity identity changes.
- **Derived State**: Avoid copying props into state. Calculate derived values dynamically during render or in event handlers.

---

## 4. Hook Disciplines & Rules

### Rules of Hooks
- Never call hooks inside loops, conditions, or nested functions.
- Always call hooks at the top level of the React component or custom hook.

### `useEffect` Boundaries
- **Use `useEffect` ONLY for external system synchronization**:
  - Browser APIs (window resize, media queries, local storage events).
  - External non-React libraries (e.g., third-party charting or mapping widgets).
  - WebSockets, EventSources, or manual subscriptions.
- **Do NOT use `useEffect` for**:
  - Calculating derived state (compute directly in the render function).
  - Handling user interactions (handle directly in `onClick`, `onSubmit`, etc. event handlers).
  - Chaining state updates based on other state updates.

### Custom Hooks Extraction
- Encapsulate reusable logic into modular custom hooks (e.g., `useAuth`, `useFetch`, `useWindowSize`).
- Keep UI components strictly focused on presentation, delegating business logic and state management to hooks.

### Performance Optimization
- Use `useMemo` and `useCallback` **only** when there is a measurable performance benefit (e.g., heavy data transformation or avoiding re-renders of memoized child trees with `React.memo`).
- Avoid premature optimization on trivial computations.

---

## 5. Data Validation & Forms

### Zod Validation Schemas
- Use **Zod** as the single source of truth for runtime validation and TypeScript schema inference.
- Define reusable schemas with `z.object()`, `z.string()`, etc., and validate with `safeParse()` or `parse()`.

```typescript
import { z } from 'zod';

export const userRegistrationSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  fullName: z.string().min(3, "Name must be between 3 and 50 characters").max(50),
});

export type UserRegistrationInput = z.infer<typeof userRegistrationSchema>;
```

### React Hook Form Integration
- Combine **React Hook Form** with Zod via `@hookform/resolvers/zod`:

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { userRegistrationSchema, UserRegistrationInput } from './schemas';

export const RegistrationForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UserRegistrationInput>({
    resolver: zodResolver(userRegistrationSchema),
  });

  const onSubmit = (data: UserRegistrationInput) => {
    // Process form submission
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("fullName")} placeholder="Full Name" />
      {errors.fullName && <span>{errors.fullName.message}</span>}

      <input {...register("email")} type="email" placeholder="Email" />
      {errors.email && <span>{errors.email.message}</span>}

      <input {...register("password")} type="password" placeholder="Password" />
      {errors.password && <span>{errors.password.message}</span>}

      <button type="submit" disabled={isSubmitting}>Register</button>
    </form>
  );
};
```

---

## 6. Styling with Tailwind CSS

### Utility-First Standards & Organization
- **Utility-First**: Style components using Tailwind CSS utility classes directly in JSX/TSX. Avoid writing raw CSS files, custom CSS modules, or inline styles unless required for dynamic CSS variables.
- **Logical Class Ordering**: Organize classes logically for readability and maintainability:
  1. **Layout & Positioning**: `flex`, `grid`, `relative`, `absolute`, `inset-0`
  2. **Box Model & Sizing**: `w-full`, `max-w-md`, `h-10`, `p-4`, `m-2`
  3. **Typography**: `text-sm`, `font-semibold`, `tracking-wide`, `text-neutral-900`
  4. **Visuals & Borders**: `bg-white`, `rounded-lg`, `border`, `shadow-sm`
  5. **Interactive & State Variants**: `hover:bg-neutral-100`, `focus-visible:ring-2`, `disabled:opacity-50`, `dark:...`
- **Mobile-First Responsive Design**: Use unprefixed utilities for mobile viewports, and apply responsive prefixes (`sm:`, `md:`, `lg:`, `xl:`, `2xl:`) to enhance larger screen sizes progressively.
- **Dark Mode Support**: Use the `dark:` variant across background, border, and text utilities for seamless theme switching.
- **Accessible Interactive States**: Always provide clear `focus-visible:` (outline and rings), `hover:`, and `disabled:` styles for interactive controls.

### Conditional Classes & Merging (`cn` Helper)
- Always use a reusable `cn()` helper combining `clsx` and `tailwind-merge` to resolve utility precedence conflicts and handle dynamic class composition:

```typescript
// src/lib/utils.ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
```

- Always allow child components to accept an optional `className` prop and merge it using `cn(...)` to permit parent overrides:

```tsx
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ className, children, ...props }) => {
  return (
    <div
      className={cn(
        'rounded-xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
```

### Component Variants with `class-variance-authority` (CVA)
- For reusable UI components (e.g., buttons, badges, inputs), manage styling variants and sizes cleanly using `cva`:

```tsx
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from './lib/utils';

export const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800',
        secondary: 'bg-neutral-100 text-neutral-900 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-700',
        outline: 'border border-neutral-300 bg-transparent hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800',
        danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800',
      },
      size: {
        sm: 'h-8 px-3 text-xs',
        md: 'h-10 px-4 text-sm',
        lg: 'h-12 px-6 text-base',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button: React.FC<ButtonProps> = ({ className, variant, size, ...props }) => {
  return <button className={cn(buttonVariants({ variant, size, className }))} {...props} />;
};
```

### Critical Rules & Anti-Patterns
- **Do NOT construct dynamic classes via string interpolation**:
  - ❌ *Incorrect*: `className={`text-${color}-600`}` (Tailwind's static build scanner cannot discover dynamically interpolated class names).
  - ✅ *Correct*: Use complete class names in a lookup map:
    ```typescript
    const statusColors = {
      success: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950 dark:text-emerald-400',
      warning: 'text-amber-600 bg-amber-50 dark:bg-amber-950 dark:text-amber-400',
      error: 'text-red-600 bg-red-50 dark:bg-red-950 dark:text-red-400',
    } as const;

    <span className={statusColors[status]}>{message}</span>
    ```
- **Avoid excessive `@apply`**: Do not use `@apply` in CSS files to recreate traditional CSS class hierarchies. Keep styles co-located in TSX components or extract reusable UI components.
- **Maintain accessible focus states**: Never disable focus indicators with `outline-none` without providing `focus-visible:ring-*` alternatives.
