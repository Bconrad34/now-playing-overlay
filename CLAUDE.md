# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands
- `npm run dev`: Start development server on http://localhost:3000
- `npm run build`: Build for production
- `npm run start`: Start production server
- `npm run lint`: Run ESLint

## Code Style Guidelines
- Use TypeScript with strict mode (some exceptions during development)
- Follow path alias pattern: import from '@/*' for root-level imports
- Component files: PascalCase (.tsx)
- Non-component files: camelCase (.ts)
- CSS Modules: ComponentName.module.css
- ESLint configuration:
  - Follow Next.js best practices (next/core-web-vitals)
  - Follow TypeScript recommendations
  - Minimize use of 'any' types and @ts-ignore comments
- During development, some strict checks are relaxed:
  - noImplicitAny and strictNullChecks are temporarily disabled
  - Warnings (not errors) for: no-explicit-any, ban-ts-comment, exhaustive-deps