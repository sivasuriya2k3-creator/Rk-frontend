# Code Examples: Context API & Build Configuration

## PART 1: Context API Best Practices

### ✅ CORRECT: AuthContext.tsx Pattern

```typescript
import * as React from 'react';  // ← Use namespace import
import { authService, User } from '@/lib/authService';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

// Use React.createContext instead of just createContext
const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Use React.useState instead of just useState
  const [user, setUser] = React.useState<User | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  // Use React.useEffect instead of just useEffect
  React.useEffect(() => {
    // Initialization logic
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Export custom hook
export function useAuth() {
  const context = React.useContext(AuthContext);  // ← React.useContext
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
```

### ✅ CORRECT: ThemeProvider.tsx Pattern

```typescript
import * as React from "react"  // ← Namespace import

type Theme = "dark" | "light" | "system"

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
}

const ThemeProviderContext = React.createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultTheme = "dark",
  storageKey = "vite-ui-theme",
  ...props
}: {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}) {
  // React.useState
  const [theme, setTheme] = React.useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  )

  // React.useEffect
  React.useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove("light", "dark")
    
    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      root.classList.add(systemTheme)
      return
    }

    root.classList.add(theme)
  }, [theme])

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme)
      setTheme(theme)
    },
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = React.useContext(ThemeProviderContext)  // ← React.useContext

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider")

  return context
}
```

### ❌ INCORRECT Pattern (DO NOT USE)

```typescript
// WRONG: Named imports
import React, { createContext, useContext, useState } from 'react';
const MyContext = createContext(undefined);  // ← NOT React.createContext
export function MyProvider({ children }: any) {
  const [value, setValue] = useState(null);  // ← NOT React.useState
  useEffect(() => {});  // ← useEffect not imported!
  // This breaks in production bundling!
}
```

---

## PART 2: Vite Configuration

### ✅ CORRECT: vite.config.ts

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    proxy: {
      '/api': {
        target: 'http://localhost:5002',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    minify: 'terser',  // ← Use Terser for production minification
    sourcemap: false,  // ← No source maps in production
    terserOptions: {
      compress: {
        drop_console: true,  // ← Remove console logs
        drop_debugger: true, // ← Remove debugger statements
      },
    },
    reportCompressedSize: true,
    rollupOptions: {
      output: {
        // EXPLICIT chunk mapping - NOT function-based
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-ui': [
            '@radix-ui/react-accordion',
            '@radix-ui/react-alert-dialog',
            '@radix-ui/react-aspect-ratio',
            // ... all radix UI packages
          ],
          'vendor-query': ['@tanstack/react-query'],
          'vendor-axios': ['axios'],
          'vendor-sonner': ['sonner'],
          'vendor-three': ['three'],
          'vendor-forms': ['react-hook-form', '@hookform/resolvers'],
        },
      },
    },
    chunkSizeWarningLimit: 800,
  },
}));
```

### ❌ INCORRECT: Function-Based Chunking (CAUSES ISSUES)

```typescript
// WRONG: This causes undefined React errors!
rollupOptions: {
  output: {
    manualChunks: (id) => {
      if (id.includes('react')) return 'vendor-react';
      if (id.includes('radix-ui')) return 'vendor-ui';
      return 'vendor-common';  // ← Everything else in one chunk!
      // Problem: Mixed dependencies, unclear loading order
    }
  }
}
```

---

## PART 3: Vercel Configuration

### ✅ CORRECT: vercel.json

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "env": {
    "VITE_API_URL": "@vite_api_url"
  },
  "headers": [
    {
      "source": "/:path*",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=3600, s-maxage=3600"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "SAMEORIGIN"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        },
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self' https://fonts.googleapis.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://fonts.gstatic.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: https:; connect-src 'self' https: http://localhost:5002; frame-ancestors 'none'; base-uri 'self';"
        }
      ]
    },
    {
      "source": "/dist/:path*",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

**Key CSP Rules Explained:**
- `default-src 'self'` - Only same-origin by default
- `script-src 'self'` - Scripts only from your domain (no unsafe-eval, no unsafe-inline)
- `style-src 'self' 'unsafe-inline'` - Styles from self + inline (required for CSS-in-JS)
- `font-src 'self' ... data:` - Fonts from self and Google
- `img-src 'self' data: https:` - Images from self, data URIs, and HTTPS
- `connect-src 'self' https:` - API calls to your domain and HTTPS only

---

## PART 4: Main Entry Point

### ✅ CORRECT: src/main.tsx

```typescript
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Verify React DOM is available
if (!document) {
  console.error("DOM not available");
  throw new Error("DOM is required");
}

const root = document.getElementById("root");
if (!root) {
  console.error("Root element not found in HTML");
  throw new Error("Root element (#root) not found in HTML");
}

try {
  createRoot(root).render(<App />);
} catch (error) {
  console.error("Failed to render React app:", error);
  root.innerHTML = `
    <div style="
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100vh;
      background: #000;
      color: #fff;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      text-align: center;
      padding: 20px;
    ">
      <div>
        <h1>Application Error</h1>
        <p>Failed to initialize the application.</p>
        <p style="font-size: 12px; color: #999; margin-top: 20px;">
          ${error instanceof Error ? error.message : 'Unknown error'}
        </p>
      </div>
    </div>
  `;
  throw error;
}
```

---

## PART 5: Testing Your Setup Locally

### Terminal Commands

```bash
# Build for production
npm run build

# Preview production build locally
npm run preview

# Analyze bundle size
npm run build -- --sourcemap  # Then use browser devtools

# Check for eval() or Function() usage
grep -r "eval(" src/
grep -r "new Function" src/
grep -r "Function(" src/
```

### In Browser Console (http://localhost:4173)

```javascript
// Check if React is defined
console.log(typeof React);  // Should be "object" or "function"

// Check if ReactDOM is defined
console.log(typeof ReactDOM);  // Should be "object" or "function"

// Test context creation (this will error if context not in provider)
const { useAuth } = window;  // If exported
```

---

## PART 6: Debugging Production Issues

### If you see: "Cannot read properties of undefined (reading 'createContext')"

1. Check file imports:
```bash
grep -r "import.*createContext" src/
grep -r "import.*useContext" src/
grep -r "import.*useState" src/
```

All should show `import * as React` pattern.

2. Check file usage:
```bash
grep -r "createContext(" src/  # Should be "React.createContext("
grep -r "\.useState(" src/    # Should all be "React.useState("
grep -r "\.useContext(" src/  # Should all be "React.useContext("
```

### If you see: "CSP error: unsafe-eval"

1. Check build output (never has eval):
```bash
grep -r "eval" dist/  # Should return nothing
grep -r "Function" dist/ | grep -v "function" # Should be minimal
```

2. Verify Vercel headers are applied:
   - Open DevTools → Network
   - Check response headers for Content-Security-Policy
   - No `unsafe-eval` should appear

---

## Summary

**Three Golden Rules:**

1. ✅ **Always use `import * as React`** in files using React API
2. ✅ **Prefix all React hooks with `React.`** (React.useState, React.useEffect, etc.)
3. ✅ **Use explicit chunk mapping** in Vite config (not function-based)

**Follow these patterns and you'll never see:**
- ❌ Cannot read properties of undefined
- ❌ CSP unsafe-eval errors
- ❌ Blank production pages

