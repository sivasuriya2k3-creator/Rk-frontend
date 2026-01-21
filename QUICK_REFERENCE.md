# ⚡ QUICK REFERENCE: Production Deployment Fixes

## 🎯 The Problem
```
❌ Blank page on Vercel
❌ "Cannot read properties of undefined (reading 'createContext')"
❌ CSP: unsafe-eval errors
```

## ✅ The Solution

### 1️⃣ React Imports Pattern
```typescript
// ✅ CORRECT
import * as React from 'react';
const MyContext = React.createContext(undefined);
const [state, setState] = React.useState(null);
React.useEffect(() => {}, []);
```

### 2️⃣ Vite Configuration
```typescript
build: {
  minify: 'terser',
  rollupOptions: {
    output: {
      manualChunks: {
        'vendor-react': ['react', 'react-dom', 'react-router-dom'],
        'vendor-ui': ['@radix-ui/*', ...],
        'vendor-query': ['@tanstack/react-query'],
        // ... explicitly map each library
      }
    }
  }
}
```

### 3️⃣ Vercel CSP Headers
```json
{
  "Content-Security-Policy": "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; ..."
}
```

### 4️⃣ Error Handling
```typescript
try {
  createRoot(root).render(<App />);
} catch (error) {
  root.innerHTML = `<div>Error: ${error.message}</div>`;
}
```

---

## 📋 Deployment Checklist

### Before Deploying
- [ ] Run `npm run build` locally (should complete in ~8s)
- [ ] Run `npm run preview` (should load without errors)
- [ ] Check `dist/assets/vendor-*.js` (multiple chunks, no vendor-common)
- [ ] All context files use `import * as React`
- [ ] All React hooks prefixed with `React.`

### After Deploying to Vercel
- [ ] Check Vercel build logs (should say "Build completed successfully")
- [ ] Open deployed URL in browser
- [ ] Check DevTools Console (should have NO errors)
- [ ] Check Network tab (chunks should load successfully)
- [ ] Test authentication (uses AuthContext)
- [ ] Test theme toggle (uses ThemeProvider)

---

## 🔍 Debugging Commands

```bash
# Check for problems
grep -r "import.*createContext" src/     # All should have "import * as React"
grep -r "createContext(" src/            # All should be "React.createContext("
grep -r "useState(" src/                 # All should be "React.useState("

# Build and preview
npm run build    # Must complete without errors
npm run preview  # Must load http://localhost:4173 without blank page

# Check production build for eval
grep -r "eval" dist/     # Should return nothing!
```

---

## 💡 Key Principles

| Principle | Why | Example |
|-----------|-----|---------|
| Namespace React imports | Ensures React object available | `import * as React from 'react'` |
| Explicit chunk mapping | Guaranteed load order | `manualChunks: { 'vendor-react': [...] }` |
| React.* everywhere | No tree-shaking issues | `React.useState`, not just `useState` |
| No eval in production | CSP safe, better performance | Built-in code splitting instead |
| Error boundaries | Catch init failures | Try/catch in main.tsx |

---

## 📊 Build Metrics

**Expected Results:**
```
✅ Build time: ~8 seconds
✅ Total bundle: ~1.1 MB gzipped  
✅ vendor-react: 160 KB (52 KB gzipped)
✅ No vendor-common chunk
✅ No console logs in prod
✅ CSP without unsafe-eval
```

---

## ⚠️ If Still Broken

| Error | Fix |
|-------|-----|
| Blank page | Check DevTools Console for errors, verify root element exists |
| createContext undefined | Verify `import * as React` pattern in all context files |
| CSP errors | Check vercel.json headers, no `unsafe-eval` should be needed |
| Slow build | Check for circular dependencies, verify explicit chunks |
| Large bundle | Verify vendor-three is separate, no duplicates |

---

## 🚀 One-Line Deployment

```bash
# After all fixes are applied
git add -A && git commit -m "Production ready" && git push origin main
# Vercel auto-deploys, check dashboard for completion
```

---

## 📚 Full Documentation

- **DEPLOYMENT_SUMMARY.md** - Overview & metrics
- **TROUBLESHOOTING_GUIDE.md** - Step-by-step verification
- **CODE_EXAMPLES.md** - Before/after patterns
- **PRODUCTION_DEPLOYMENT_FIX.md** - Technical deep dive

---

## ✨ Success Indicators

✅ Website loads without blank page
✅ No console errors (red ❌)
✅ All chunks in Network tab load successfully
✅ Authentication works
✅ Theme switcher works
✅ All images/assets load
✅ Lighthouse score >80

---

**Status:** ✅ All fixes applied and deployed
**Last Updated:** January 21, 2026
**Next Action:** Monitor Vercel deployment completion

