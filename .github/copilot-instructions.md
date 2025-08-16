# UltraWeb Thinking - AGI Platform Development Guide

## 🧠 Platform Architecture

**EuroWeb Web8 AGI Platform** - Industrial-grade TypeScript AGI browser with real-time neural processing. Core system uses "Web8" prefixed components with strict TypeScript patterns.

## 🚀 Essential Development Commands

```bash
# Full development with all AGI services
yarn dev:full

# Individual services
yarn dev              # Frontend only  
yarn dev:backend      # AGI backend server
yarn dev:realtime     # Real-time neural processing

# Industrial build pipeline
yarn industrial:build && yarn vercel:deploy

# Purity checking (critical for Web8 compliance)
yarn pure:check
yarn pure:build
```

## 🏗️ Core Architecture Patterns

### 1. Web8 Component System
- **Prefix**: All core components start with `Web8` (e.g., `Web8TabSystem`)
- **Location**: `/components/Web8*.tsx`
- **Pattern**: Use `lib/web8-motion.ts` for animations (NOT framer-motion directly)
- **Lazy Loading**: All components go through `LazyLoader.tsx` with neural optimization

### 2. AGI Module Structure
```
components/AGISheet/    # Core AGI engines
├── AGISheet.tsx       # Main spreadsheet interface
├── EcologyEngine.ts   # Environmental analysis
└── AGI*Ultra.tsx      # Specialized AGI components

app/agi-*/            # AGI route pages
├── page.tsx          # Main interface
└── loading.tsx       # Loading states
```

### 3. Neural Real-Time System
- **Hook**: `useAGIRealTime()` - connects to WebSocket backend
- **Backend**: `backend/realtime-server.ts` on port 4000
- **Data Flow**: WebSocket → React hooks → UI components
- **Pattern**: Always check `isConnected` before using real-time data

## 🎯 Critical Development Patterns

### CVA Styling (Class Variance Authority)
```tsx
const componentVariants = cva("base-classes", {
  variants: {
    theme: {
      royal: "from-purple-50 via-blue-50 to-indigo-100",
      dark: "from-gray-900 via-purple-900 to-black",
      nature: "from-green-50 via-blue-50 to-teal-100"
    }
  }
});
```

### Neural Analyzer Integration
```tsx
import { analyzeWithNeuralEngine } from '@/lib/neuralAnalyzer';

// Use for performance analysis in any component
const analysis = analyzeWithNeuralEngine(data);
```

### Fluid Architecture Pattern
- **File**: `lib/FluidArchitecture.ts`
- **Purpose**: Seamless component transitions and flow management
- **Usage**: Import and initialize for complex component interactions

## 🔧 Package Manager Rules

**YARN ONLY** - Never use npm/npx commands:
- `yarn add` (not npm install)
- `yarn tsx` (not npx ts-node)
- `yarn global add` (not npm -g)

## 🧪 Testing & Quality

```bash
yarn test              # Vitest test suite
yarn test:coverage     # Coverage reports
yarn type-check        # TypeScript validation
yarn lint              # ESLint with auto-fix
```

## 🛡️ Security & Guardian System

- **Location**: `backend/guardian/Guardian-web8.ts`
- **Pattern**: All API routes should use Guardian middleware
- **Features**: Rate limiting, SQL injection detection, XSS protection

## 📊 Performance Optimization

### Lazy Loading Strategy
```tsx
<LazyLoader 
  component="AGISheet"
  variant="industrial"
  priority="critical"
  preload={true}
/>
```

### Component Registration
Register new components in `components/LazyLoader.tsx` → `UltraComponents.registerWeb8Components()`

## 🌐 API Architecture

### Neural API Pattern
```typescript
// File: app/api/*/route.ts
export async function POST(request: NextRequest) {
  // Always include neural analysis
  const analysis = analyzeWithNeuralEngine(data);
  
  return NextResponse.json({
    result: processedData,
    neural: analysis,
    timestamp: new Date().toISOString()
  });
}
```

## 🎨 UI/UX Standards

- **Theme System**: Royal (purple), Dark, Nature variants
- **Animations**: Use `lib/web8-motion.ts` components
- **Typography**: Gradient text for headers: `bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent`
- **Cards**: Backdrop blur with glass morphism: `backdrop-blur-sm border shadow-lg`

## 🔄 Data Flow Architecture

1. **Real-time**: WebSocket (`useAGIRealTime`) → Component State → UI
2. **API Calls**: Component → `/api/*` → Neural Analysis → Response
3. **State**: React hooks + local state (no global state management)

## 🚧 Common Integration Points

- **Neural Search**: `lib/neuralAnalyzer.ts` - Performance pattern detection
- **AGI Modules**: Always use `components/AGISheet/*` for analysis engines
- **Security**: `backend/guardian/*` for all API protection
- **Real-time**: `backend/realtime-server.ts` for live data streams

## ⚡ Performance Critical Patterns

- **Viewport Loading**: Use `LazyLoader` with `viewport={true}` for heavy components
- **Chunk Splitting**: Components auto-split into `agi-core`, `agi-eco`, `agi-bio` chunks
- **Memory Management**: Components automatically cleanup on unmount

## 🎯 Creator Attribution

**Ledjan Ahmati** - 100% Creator & Owner. Maintain attribution in all new components:
```typescript
/**
 * @author Ledjan Ahmati
 * @version 8.0.0-WEB8
 * @contact dealsjona@gmail.com
 */
```

---

*Always use `yarn`, follow Web8 patterns, integrate Neural Analyzer for performance insights, and maintain the fluid architecture design.*
