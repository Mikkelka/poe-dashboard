# PoE Dashboard

[![Vue.js](https://img.shields.io/badge/Vue.js-3.5.17-4FC08D?style=flat&logo=vue.js&logoColor=white)](https://vuejs.org/)
[![Vite](https://img.shields.io/badge/Vite-7.0.0-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1.11-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-12.1.0-FFCA28?style=flat&logo=firebase&logoColor=black)](https://firebase.google.com/)

En moderne Vue 3-applikation til sporing og administration af Path of Exile builds med Firebase backend-integration.

## 📝 Beskrivelse

PoE Dashboard er et webbaseret værktøj designet til Path of Exile-spillere, der ønsker at holde styr på deres karakterbyggerier og ressourcer. Applikationen giver brugerne mulighed for at:

- Spore build-status og progression for både Path of Exile 1 og 2
- Administrere eksterne links til Path of Building filer og guides
- Holde styr på liga-tilknytninger og karakteroplysninger
- Få adgang til kuraterede ressourcer og værktøjer
- Synkronisere data på tværs af enheder med real-time opdateringer

## ✨ Funktioner

### 🔐 Autentificering
- **Google-kun log ind** via Firebase Authentication
- Sikker brugerautentificering med OAuth 2.0
- Automatisk session management

### 🎮 Build Management
- **Spor builds** for Path of Exile 1 og 2 karakterer
- **Status management** (aktiv, pause, afsluttet)
- **Guide status tracking** (opdateret, forældet, ukendt)
- **Liga og karakter association**
- **Eksterne link management** (Path of Building, guides)
- **Søgning og filtrering** af builds

### 📚 Ressource Management
- **Kuraterede ressourcer** for begge spilversioner
- **Tilpasselige ressourcelister** med brugerspecifikke præferencer
- **Kategori-organisering** (database, handel, værktøjer, osv.)
- **CRUD operationer** for ressource management

### 🔄 Real-time Funktionalitet
- **Live data synkronisering** via Firebase Firestore
- **Real-time opdateringer** på tværs af sessioner
- **Offline-first design** med automatisk synkronisering

## 🛠 Teknologier

- **Frontend Framework:** Vue 3 med Composition API
- **Build Tool:** Vite 7.0
- **Styling:** TailwindCSS v4 med JIT compilation
- **Backend:** Firebase (Authentication + Firestore)
- **State Management:** Vue Composables pattern
- **Deployment:** Firebase Hosting
- **Code Quality:** ESLint med Vue plugin

## 📋 Forudsætninger

Før du starter, skal du sikre dig, at du har følgende installeret:

- **Node.js** (version 18 eller nyere)
- **npm** (kommer med Node.js)
- **Firebase CLI** (valgfrit, til deployment)

## 🚀 Installation

1. **Klon repositoriet**
```bash
git clone <repository-url>
cd poe-dashboard
```

2. **Installer afhængigheder**
```bash
npm install
```

3. **Opsæt miljøvariabler**
Opret en `.env` fil i rodmappen og tilføj dine Firebase konfigurationsvariabler:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

4. **Start udviklings-serveren**
```bash
npm run dev
```

Applikationen vil være tilgængelig på `http://localhost:5173`

## 📖 Anvendelse

### Udvikling
```bash
npm run dev          # Start udviklings-server
npm run build        # Byg til produktion
npm run preview      # Forhåndsvis produktions-build
npm run lint         # Kør ESLint
npm run lint:fix     # Ret ESLint fejl automatisk
```

### Firebase Opsætning

1. Opret et nyt Firebase projekt på [Firebase Console](https://console.firebase.google.com)
2. Aktiver Authentication med Google provider
3. Opret en Firestore database
4. Konfigurer hosting (valgfrit)
5. Opdater miljøvariablerne med dine projekt-credentials

### Firestore Sikkerhedsregler

Sørg for at din Firestore database har passende sikkerhedsregler, der sikrer brugerspecifik dataadgang:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /builds/{document} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## 📁 Projektstruktur

```
src/
├── components/          # Vue komponenter
│   ├── AppHeader.vue    # Hoved-navigation og brugerinfo
│   ├── BuildCard.vue    # Individuel build visning
│   ├── BuildModal.vue   # Tilføj/rediger build form
│   ├── Navigation.vue   # Tab navigation
│   ├── ResourceModal.vue # Ressource management modal
│   └── ResourcesSection.vue # Ressource oversigt
├── composables/         # Vue Composition API logik
│   ├── useAuth.js       # Authentication state og metoder
│   ├── useBuilds.js     # Builds management
│   ├── useResources.js  # Ressource CRUD operationer
│   ├── useSearch.js     # Søge- og filtreringsfunktionalitet
│   ├── useTab.js        # Tab state management
│   └── useValidation.js # Form validering
├── firebase/            # Firebase konfiguration og services
│   ├── auth.js          # Authentication logik
│   ├── config.js        # Firebase konfiguration
│   ├── firestore.js     # Database operationer
│   └── index.js         # Firebase exports
├── data/               # Statiske data og konfiguration
│   └── resources.js    # Standard ressource definition
├── utils/              # Hjælpe-funktioner
│   └── helpers.js      # Almindelige utility funktioner
├── style.css           # Global styling og TailwindCSS komponenter
└── main.js             # Applikations entry point
```

## 🎨 Design System

Applikationen bruger et konsistent design system baseret på:

- **Mørkt tema** med grå farvepalette
- **Responsive design** med mobile-first tilgang
- **TailwindCSS komponenter** til genanvendelige UI-elementer
- **Hover-effekter** og glatte overgange
- **Dansk lokalisering** gennem hele brugergrænsefladen

## 🤝 Bidrag

Bidrag er velkomne! Hvis du ønsker at bidrage til projektet:

1. Fork repositoriet
2. Opret en feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit dine ændringer (`git commit -m 'Add some AmazingFeature'`)
4. Push til branchen (`git push origin feature/AmazingFeature`)
5. Åbn en Pull Request

### Retningslinjer for Bidrag

- Følg eksisterende kode konventioner og styling
- Inkluder passende tests for nye funktioner
- Opdater dokumentation ved behov
- Sørg for at ESLint passes før du sender pull requests

## 📄 Licens

Dette projekt har endnu ikke en specificeret licens. Vi anbefaler at tilføje en [MIT License](https://opensource.org/licenses/MIT) eller [Apache 2.0 License](https://opensource.org/licenses/Apache-2.0) for open source distribution.

## 📞 Kontakt

For spørgsmål, forslag eller support, venligst:

- Åbn et [issue](../../issues) på GitHub
- Kontakt projekt vedligeholderne via GitHub

## 🙏 Anerkendelser

- [Path of Exile](https://pathofexile.com) af Grinding Gear Games
- [Vue.js](https://vuejs.org/) fællesskabet for det fantastiske framework
- [Firebase](https://firebase.google.com/) for robust backend services
- [TailwindCSS](https://tailwindcss.com/) for det fleksible styling system

---

**Note:** Denne applikation er et community projekt og er ikke officielt affilieret med Grinding Gear Games eller Path of Exile.