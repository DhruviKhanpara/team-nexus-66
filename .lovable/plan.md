

## Cleanup & Hardening Plan (Approved + Extras)

Executing the previously approved plan plus removal of `@tanstack/react-query` and `vaul`.

### 1. Package Manager → npm
- Delete `bun.lock` and `bun.lockb`.
- Add `"packageManager": "npm@10.x"` to `package.json`.

### 2. Remove Testing Setup
- Delete `vitest.config.ts`, `src/test/setup.ts`, `src/test/example.test.ts` (entire `src/test/` folder).
- Remove `test` / `test:watch` scripts from `package.json`.
- Remove devDependencies: `vitest`, `@testing-library/jest-dom`, `@testing-library/react`, `jsdom`.
- Remove `"types": ["vitest/globals"]` from `tsconfig.app.json`.

### 3. TypeScript Hardening
- **`tsconfig.json`**: enable `strict: true`, drop the four relaxed flags, add `"baseUrl": "."`, keep `skipLibCheck` and `paths`.
- **`tsconfig.app.json`**: enable `strict: true`, `noFallthroughCasesInSwitch: true`, add `"baseUrl": "."`, remove `allowImportingTsExtensions` and the vitest types entry. Enable `noUnusedLocals` / `noUnusedParameters` — for shadcn UI noise I'll use underscore-prefix on unused params rather than editing component internals.
- **`tsconfig.node.json`**: enable `noUnusedLocals` / `noUnusedParameters`, remove `allowImportingTsExtensions`.
- Fix resulting errors across our own code (`api/`, `domain/`, `features/`, `pages/`, `components/chat`, `components/sidebar`, `components/layout`).

### 4. Environment Configuration
- Create `.env.development` and `.env.production` with `VITE_API_BASE_URL` and `VITE_SOCKET_URL`.
- Create `src/config/env.ts` exporting a typed `env` object.
- Update `src/api/baseApi.ts` and `src/socket/socketClient.ts` to import from `@/config/env`.

### 5. Vite Config Review
- Remove `hmr.overlay: false` to restore the dev error overlay.
- Keep `componentTagger` (required for Lovable visual editing) with a brief comment.
- React plugin and `@` alias unchanged.

### 6. Remove Unused Libraries
- **`@tanstack/react-query`**: zero imports — remove from `package.json` dependencies.
- **`vaul`**: only consumed by `src/components/ui/drawer.tsx`. Delete `src/components/ui/drawer.tsx` and remove `vaul` from `package.json`. Verified no app code imports the drawer.

### Risks
- Strict mode may surface latent type issues in our own code — I'll fix them inline (no `any` unless unavoidable).
- `.env.production` ships with a placeholder URL; replace before deploying.

### Files Touched
- **Delete**: `bun.lock`, `bun.lockb`, `vitest.config.ts`, `src/test/` (folder), `src/components/ui/drawer.tsx`
- **Create**: `.env.development`, `.env.production`, `src/config/env.ts`
- **Update**: `package.json`, `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`, `vite.config.ts`, `src/api/baseApi.ts`, `src/socket/socketClient.ts`, plus any source files needing strict-mode fixes

