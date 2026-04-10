# JEE Pulse Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Establish the project foundation, tech stack, and Local-First storage layer for JEE Pulse.

**Architecture:** A modern React 19 / TypeScript application with a dedicated Local Storage (IndexedDB) layer. The UI uses Vanilla CSS with a centralized CSS-variable-based theme for High Performance and Dark Mode support.

**Tech Stack:** 
- Vite (Build Tool)
- React 19 / TypeScript (Framework)
- Vitest (Testing)
- IndexedDB (Storage)
- Vanilla CSS (Styling)

---

### Task 1: Project Initialization

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `vite.config.ts`

- [ ] **Step 1: Initialize Vite project with React and TypeScript**

Run: `npm create vite@latest . -- --template react-ts`
Expected: Project structure created in current directory.

- [ ] **Step 2: Install testing dependencies (Vitest)**

Run: `npm install -D vitest @vitest/ui @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom`
Expected: `package.json` updated with devDependencies.

- [ ] **Step 3: Configure Vitest in vite.config.ts**

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
  },
});
```

- [ ] **Step 4: Create Vitest setup file**

Create: `src/test/setup.ts`
```typescript
import '@testing-library/jest-dom';
```

- [ ] **Step 5: Add test scripts to package.json**

Modify: `package.json`
```json
"scripts": {
  "test": "vitest",
  "test:ui": "vitest --ui",
  "test:coverage": "vitest run --coverage"
}
```

- [ ] **Step 6: Commit**

```bash
git add .
git commit -m "chore: initial project setup with vite and vitest"
```

---

### Task 2: Global Styles & Theme

**Files:**
- Create: `src/styles/variables.css`
- Create: `src/styles/global.css`
- Modify: `src/main.tsx`

- [ ] **Step 1: Define CSS Variables for the "Blue & Slate" theme**

Create: `src/styles/variables.css`
```css
:root {
  /* Colors */
  --primary: #007bff;
  --primary-hover: #0056b3;
  --bg: #f8f9fa;
  --surface: #ffffff;
  --text: #333333;
  --text-muted: #666666;
  --border: #dee2e6;
  --shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);

  /* JEE Specifics */
  --jee-header-bg: #1e3a8a;
  --jee-accent: #3b82f6;
  --success: #10b981;
  --warning: #f59e0b;
  --error: #ef4444;

  /* Typography */
  --font-sans: system-ui, -apple-system, sans-serif;
}

[data-theme='dark'] {
  --bg: #111827;
  --surface: #1f2937;
  --text: #f9fafb;
  --text-muted: #9ca3af;
  --border: #374151;
  --shadow: 0 10px 15px -3px rgb(0 0 0 / 0.3);
}
```

- [ ] **Step 2: Setup Global Styles**

Create: `src/styles/global.css`
```css
@import './variables.css';

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: var(--font-sans);
  background-color: var(--bg);
  color: var(--text);
  line-height: 1.5;
  transition: background-color 0.2s, color 0.2s;
}

button {
  cursor: pointer;
  border: none;
  border-radius: 4px;
}
```

- [ ] **Step 3: Import styles in main.tsx**

Modify: `src/main.tsx` (Add imports)
```typescript
import './styles/global.css';
```

- [ ] **Step 4: Commit**

```bash
git add src/styles src/main.tsx
git commit -m "style: define css-variable-based theme and global styles"
```

---

### Task 3: Local Storage Layer (IndexedDB)

**Files:**
- Create: `src/db/core.ts`
- Create: `src/db/__tests__/core.test.ts`

- [ ] **Step 1: Write failing test for DB initialization**

Create: `src/db/__tests__/core.test.ts`
```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { initDB, DB_NAME } from '../core';

describe('DB Core', () => {
  it('should initialize the database with correct name', async () => {
    const db = await initDB();
    expect(db.name).toBe(DB_NAME);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test src/db/__tests__/core.test.ts`
Expected: FAIL (Cannot find module '../core')

- [ ] **Step 3: Implement minimal IndexedDB wrapper**

Create: `src/db/core.ts`
```typescript
export const DB_NAME = 'jee_pulse_db';
export const DB_VERSION = 1;

export function initDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains('attempts')) {
        db.createObjectStore('attempts', { keyPath: 'id', autoIncrement: true });
      }
      if (!db.objectStoreNames.contains('schedule')) {
        db.createObjectStore('schedule', { keyPath: 'id' });
      }
    };
  });
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test src/db/__tests__/core.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/db
git commit -m "feat: setup indexeddb storage layer for attempts and schedule"
```

---

### Task 4: Main Layout Skeleton

**Files:**
- Create: `src/components/Layout/Shell.tsx`
- Create: `src/components/Layout/Shell.module.css`
- Modify: `src/App.tsx`

- [ ] **Step 1: Define Shell Component with Module Navigation**

Create: `src/components/Layout/Shell.tsx`
```tsx
import React from 'react';
import styles from './Shell.module.css';

interface ShellProps {
  children: React.ReactNode;
}

export const Shell: React.FC<ShellProps> = ({ children }) => {
  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <div className={styles.logo}>JEE PULSE</div>
        <nav className={styles.nav}>
          <button className={styles.navItem}>TEST</button>
          <button className={styles.navItem}>ANALYZE</button>
          <button className={styles.navItem}>STUDY</button>
          <button className={styles.navItem}>LIBRARY</button>
        </nav>
      </header>
      <main className={styles.main}>{children}</main>
    </div>
  );
};
```

- [ ] **Step 2: Style the Shell**

Create: `src/components/Layout/Shell.module.css`
```css
.shell {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.header {
  height: 60px;
  background: var(--jee-header-bg);
  color: white;
  display: flex;
  align-items: center;
  padding: 0 2rem;
  box-shadow: var(--shadow);
}

.logo {
  font-weight: bold;
  font-size: 1.25rem;
  letter-spacing: 1px;
}

.nav {
  margin-left: 3rem;
  display: flex;
  gap: 1.5rem;
}

.navItem {
  background: transparent;
  color: #cbd5e1;
  font-weight: 500;
  padding: 0.5rem 1rem;
  transition: color 0.2s;
}

.navItem:hover {
  color: white;
}

.main {
  flex-grow: 1;
  padding: 2rem;
}
```

- [ ] **Step 3: Update App.tsx to use Shell**

Modify: `src/App.tsx`
```tsx
import { Shell } from './components/Layout/Shell';

function App() {
  return (
    <Shell>
      <h2>Welcome to JEE Pulse</h2>
      <p>Select a module to get started.</p>
    </Shell>
  );
}

export default App;
```

- [ ] **Step 4: Commit**

```bash
git add src/components src/App.tsx
git commit -m "feat: add main layout shell with navigation"
```
