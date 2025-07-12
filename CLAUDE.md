# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server (Vite) with TailwindCSS JIT compilation
- `npm run build` - Build for production with TailwindCSS optimization
- `npm run preview` - Preview production build locally

## Technology Stack

- **Vue 3** - Progressive JavaScript framework with Composition API
- **Vite** - Fast build tool and development server
- **TailwindCSS v4** - Utility-first CSS framework with JIT compilation
- **Firebase** - Backend-as-a-Service for authentication and database

## Architecture Overview

This is a Vue 3 + Vite application for tracking Path of Exile builds with Firebase backend integration.

### Authentication System
- **Google-only authentication** using Firebase Auth
- Uses `signInWithPopup` with GoogleAuthProvider
- All authentication logic centralized in `src/firebase/auth.js`
- Maintains backward compatibility with legacy function names (`registerUser`, `loginUser`) that redirect to Google sign-in

### Data Layer
- **Firebase Firestore** for persistent storage
- **Real-time subscriptions** for live data updates using `onSnapshot`
- Build data model documented in `src/firebase/firestore.js` with full schema
- User-specific data filtering using `userId` field

### Component Architecture
- **Modular component structure** with extracted reusable components:
  - `Header.vue` - Brand, user info, and primary actions
  - `Navigation.vue` - Tab switching between builds/resources
  - `BuildCard.vue` - Individual build display with actions
  - `BuildModal.vue` - Add/edit build form
  - `ResourcesSection.vue` - Resources management with CRUD operations
  - `ResourceModal.vue` - Add/edit resource form

### State Management
- **Composition API** with **composables pattern** for code organization:
  - `useAuth` composable - Authentication state and methods
  - `useBuilds` composable - Builds management and subscriptions
  - `useResources` composable - Resources CRUD and preferences
  - `useSearch` composable - Search and filtering logic
  - `useTab` composable - Tab state management
- Real-time data synchronization through Firebase subscriptions
- Client-side filtering and search for builds
- No external state management library - uses Vue's built-in reactivity

### Key Business Logic
- **Build tracking** for Path of Exile 1 and 2 characters
- **Build status management** (active, paused, completed)
- **Guide status tracking** (up-to-date, outdated, unknown)
- **League and character association**
- **External link management** (Path of Building, guides)

### Firebase Configuration
- Config stored in `src/firebase/config.js` with actual project credentials
- Project ID: `poe-dashboard-5d056`
- Requires Google sign-in method enabled in Firebase Console
- Firestore security rules should enforce user-specific data access

### Styling & Design System
- **TailwindCSS v4** for utility-first styling
- **Component classes** using `@apply` directive in `src/style.css`:
  - Button variants: `.btn-google`, `.btn-primary`, `.btn-outline`, `.action-link`
  - Layout containers: `.auth-form`, `.build-card`, `.container-main`, `.header-full`
  - Form elements: `.select-dropdown`, `.input-search`
  - Status indicators: `.game-badge`, `.guide-status`, `.error-message`, `.count-badge`
  - Layout utilities: `.builds-grid`, `.section-header`, `.header-actions`
- **Responsive design** with mobile-first approach using Tailwind breakpoints
- **Dark theme** with consistent gray color palette
- **Hover effects** and smooth transitions throughout the UI

### Danish Localization
- UI text in Danish (Danish language interface)
- Error messages and user-facing text localized
- Maintained throughout authentication and main application

### Code Organization
- **Composables directory** (`src/composables/`) for reusable logic
- **Component-based architecture** with single responsibility principle
- **Utility functions** centralized in `src/utils/helpers.js`
- **Minimal CSS** - All styling moved to TailwindCSS classes and component utilities

## Development Guidelines

### Composables Usage
- Use existing composables (`useAuth`, `useBuilds`, etc.) for state management
- Create new composables for reusable logic following the established pattern
- Keep composables focused on single responsibility

### Styling Guidelines
- **Use component classes** from `src/style.css` for common UI patterns
- **Combine with utility classes** for specific modifications
- **Follow Tailwind conventions** for responsive design (`md:`, `lg:`, etc.)
- **Maintain dark theme consistency** with established gray color palette

### Component Structure
- Keep components focused and single-purpose
- Use props/events for parent-child communication
- Leverage Firebase real-time subscriptions for data synchronization
- Follow Vue 3 Composition API best practices