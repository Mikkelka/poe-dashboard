# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server (Vite)
- `npm run build` - Build for production 
- `npm run preview` - Preview production build locally

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
  - `ResourcesSection.vue` - Future resources management (placeholder)

### State Management
- **Composition API** with reactive state in App.vue
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

### Danish Localization
- UI text in Danish (Danish language interface)
- Error messages and user-facing text localized
- Maintained throughout authentication and main application