# 🔍 Sherlock Holmes Club × KARE — Official Portal

An elegant, secure, and production-ready official university portal for the **Sherlock Holmes Club** at **Kalasalingam Academy of Research and Education (KARE)**. Built using a modern stack featuring Next.js 15, React, Tailwind CSS, Framer Motion, and powered by Firebase services (Authentication, Firestore, and Storage).

This portal serves a dual purpose:
1. **Public Website**: A fast, responsive, and SEO-optimized showcase of club overview, achievements, events, team rosters, gallery assets, and official announcements.
2. **Admin Dashboard (CMS)**: A secure, role-based control panel allowing club administrators and faculty supervisors to edit all website content in real time without writing any code.

---

## 📁 Folder Structure

```text
├── app/                      # Next.js App Router root
│   ├── about/                # About page (Vision, Mission, Objectives)
│   ├── admin/                # Admin CMS Portal (Auth & Management)
│   ├── announcements/        # Announcements list view
│   ├── contact/              # Contact page & Map Iframe
│   ├── events/               # Events directory
│   │   └── [id]/             # Dynamic event details view
│   ├── gallery/              # Interactive photo/video media gallery
│   ├── join/                 # Club recruitment details page
│   ├── team/                 # Club committees & roster
│   ├── globals.css           # Tailwind v4 globals & theme overrides
│   ├── layout.tsx            # Main HTML layout & providers wrap
│   ├── not-found.tsx         # Custom 404 error page
│   ├── robots.ts             # Search engine crawler policies
│   └── sitemap.ts            # Dynamic sitemap generator
├── components/               # React components
│   ├── common/               # Reusable UI widgets (Heading, Section, EmptyState, etc.)
│   ├── layout/               # Shell assets (Navbar, Footer, AnimatedBackground)
│   └── ui/                   # Shadcn raw primitives
├── contexts/                 # Contexts (AuthContext for Firebase session management)
├── firebase/                 # Firebase SDK client configurations
├── hooks/                    # Custom React hooks (useScroll, etc.)
├── lib/                      # Helper utilities (cn class merging)
├── providers/                # Theme/Toast Context Providers
├── public/                   # Static public assets (logos, icons)
├── services/                 # Firestore API CRUD helper methods
├── styles/                   # Asset style configurations
├── types/                    # Core typescript definitions
├── firestore.rules           # Firestore security validation rules
├── storage.rules             # Firebase Storage path validation rules
├── package.json              # App dependencies & scripts
└── tsconfig.json             # TypeScript compiler configurations
```

---

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router with TypeScript)
- **Styling**: Tailwind CSS & Vanilla CSS variable overrides
- **Animations**: Framer Motion
- **Database**: Cloud Firestore
- **Storage**: Firebase Cloud Storage
- **Authentication**: Firebase Authentication (Session persistence & Guards)
- **Forms & Validation**: React Hook Form with Zod schema verification
- **Icons**: Lucide React
- **Notifications**: Sonner Toast system

---

## ⚙️ Environment Variables

The project uses environment variables for secure, client-safe Firebase initialization. Create a `.env.local` file in the root directory for local development, and configure these same keys on your production Vercel environment:

```env
# Firebase Client SDK Configuration (Client Accessible)
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id_here
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id_here
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id_here
```

---

## 🔥 Firebase Database Structure (Firestore Schema)

The database utilizes highly structured collections that correspond to the modular UI. Below is the schema layout for Firestore collections:

### 1. `settings`
- **Document Path**: `/settings/general`
- **Fields**:
  - `clubLogo`: `string` (Storage URL)
  - `collegeLogo`: `string` (Storage URL)
  - `clubEmail`: `string`
  - `clubPhone`: `string`
  - `registrationStatus`: `boolean` (Open/Closed)
  - `analyticsId`: `string`

### 2. `homepage`
- **Document Path**: `/homepage/main`
- **Fields**:
  - `heroTagline`: `string`
  - `heroTitle`: `string`
  - `heroSubtitle`: `string`
  - `highlightTitle`: `string`
  - `highlightDescription`: `string`

### 3. `about`
- **Document Path**: `/about/main`
- **Fields**:
  - `description`: `string`
  - `vision`: `string`
  - `mission`: `string`
  - `objectives`: `string[]` (Bullet point lists)

### 4. `events`
- **Collection Path**: `/events/{eventId}`
- **Fields**:
  - `title`: `string`
  - `description`: `string`
  - `date`: `string` (YYYY-MM-DD)
  - `time`: `string`
  - `venue`: `string`
  - `registrationLink`: `string`
  - `status`: `string` (`"upcoming"` | `"completed"`)
  - `posterImage`: `string` (Storage URL)
  - `rules`: `string[]`
  - `organizerName`: `string`
  - `organizerContact`: `string`
  - `createdAt`: `timestamp`
  - `updatedAt`: `timestamp`

### 5. `announcements`
- **Collection Path**: `/announcements/{announcementId}`
- **Fields**:
  - `title`: `string`
  - `content`: `string`
  - `date`: `string`
  - `important`: `boolean`
  - `createdAt`: `timestamp`

### 6. `officeBearers` (Team Roster)
- **Collection Path**: `/officeBearers/{memberId}`
- **Fields**:
  - `name`: `string`
  - `role`: `string`
  - `division`: `string` (`"advisors"` | `"coordinators"` | `"bearers"` | `"committee"` | `"alumni"`)
  - `priorityOrder`: `number` (Sorting weight)
  - `academicYear`: `string`
  - `department`: `string`
  - `email`: `string`
  - `linkedin`: `string`
  - `image`: `string` (Storage URL)

### 7. `gallery`
- **Collection Path**: `/gallery/{itemId}`
- **Fields**:
  - `title`: `string`
  - `type`: `string` (`"image"` | `"video"`)
  - `url`: `string` (Storage URL)
  - `category`: `string` (`"workshops"` | `"contests"` | `"gatherings"`)
  - `date`: `string`

### 8. `downloads`
- **Collection Path**: `/downloads/{docId}`
- **Fields**:
  - `title`: `string`
  - `description`: `string`
  - `url`: `string` (Storage URL)
  - `fileSize`: `string`
  - `fileType`: `string`
  - `createdAt`: `timestamp`

### 9. `contact`
- **Document Path**: `/contact/info`
- **Fields**:
  - `phone`: `string`
  - `email`: `string`
  - `address`: `string`
  - `googleMapsEmbedUrl`: `string`
  - `instagram`: `string`
  - `linkedin`: `string`
  - `twitter`: `string`

### 10. `contactMessages`
- **Collection Path**: `/contactMessages/{msgId}`
- **Fields**:
  - `name`: `string`
  - `email`: `string`
  - `subject`: `string`
  - `message`: `string`
  - `timestamp`: `timestamp`

### 11. `adminUsers`
- **Collection Path**: `/adminUsers/{uid}`
- **Fields**:
  - `name`: `string`
  - `email`: `string`
  - `role`: `string` (`"superadmin"` | `"admin"` | `"editor"`)
  - `status`: `string` (`"active"` | `"suspended"`)
  - `createdAt`: `timestamp`

### 12. `activityLogs`
- **Collection Path**: `/activityLogs/{logId}`
- **Fields**:
  - `adminUid`: `string`
  - `adminEmail`: `string`
  - `action`: `string`
  - `targetCollection`: `string`
  - `targetId`: `string`
  - `timestamp`: `timestamp`

---

## 🛡️ Firebase Security Rules

### Firestore Rules (`firestore.rules`)
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isAuthenticated() {
      return request.auth != null;
    }
    function isAdmin() {
      return isAuthenticated() && 
        exists(/databases/$(database)/documents/adminUsers/$(request.auth.uid));
    }

    // Public read collections, Admin write
    match /settings/{document} {
      allow read: true;
      allow write: if isAdmin();
    }
    match /homepage/{document} {
      allow read: true;
      allow write: if isAdmin();
    }
    match /about/{document} {
      allow read: true;
      allow write: if isAdmin();
    }
    match /events/{document} {
      allow read: true;
      allow write: if isAdmin();
    }
    match /announcements/{document} {
      allow read: true;
      allow write: if isAdmin();
    }
    match /officeBearers/{document} {
      allow read: true;
      allow write: if isAdmin();
    }
    match /gallery/{document} {
      allow read: true;
      allow write: if isAdmin();
    }
    match /downloads/{document} {
      allow read: true;
      allow write: if isAdmin();
    }
    match /contact/{document} {
      allow read: true;
      allow write: if isAdmin();
    }

    // Contact form submissions
    match /contactMessages/{document} {
      allow create: true;
      allow read, update, delete: if isAdmin();
    }

    // User Profile Guard
    match /adminUsers/{uid} {
      allow read, write: if isAuthenticated() && (request.auth.uid == uid || isAdmin());
    }

    // Admin Logs
    match /activityLogs/{document} {
      allow read, write: if isAdmin();
    }
  }
}
```

### Storage Rules (`storage.rules`)
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    function isAuthenticated() {
      return request.auth != null;
    }
    function isAdmin() {
      return isAuthenticated() && 
        firestore.exists(/databases/(default)/documents/adminUsers/$(request.auth.uid));
    }

    // Public read access for images/videos/posters/files, write permission restricted to active admins
    match /logos/{allPaths=**} { allow read: true; allow write: if isAdmin(); }
    match /hero-images/{allPaths=**} { allow read: true; allow write: if isAdmin(); }
    match /event-posters/{allPaths=**} { allow read: true; allow write: if isAdmin(); }
    match /gallery/{allPaths=**} { allow read: true; allow write: if isAdmin(); }
    match /documents/{allPaths=**} { allow read: true; allow write: if isAdmin(); }
    match /downloads/{allPaths=**} { allow read: true; allow write: if isAdmin(); }
    match /team/{allPaths=**} { allow read: true; allow write: if isAdmin(); }
  }
}
```

---

## 🚀 Installation & Local Development

1. **Clone the Repository** and navigate to the project directory:
   ```bash
   cd "Sherlock Holmes Club KARE"
   ```
2. **Install Dependencies**:
   ```bash
   npm install
   ```
3. **Configure Environment Variables**:
   Create a `.env.local` file using `.env.example` as a template and fill in your Firebase Web App credentials.
4. **Run the Development Server**:
   ```bash
   npm run dev
   ```
5. **Open Local Host**:
   Navigate to [http://localhost:3000](http://localhost:3000) to view the portal.

---

## 🛠️ Deploying to Production

### 1. Deploy Firestore and Storage Rules
Using the Firebase CLI, deploy security rules from the root folder:
```bash
firebase deploy --only firestore:rules,storage
```

### 2. Deploy Web App to Vercel
1. Connect your Github repository containing the codebase to [Vercel](https://vercel.com).
2. Go to **Settings > Environment Variables** and add all variables listed in the **Environment Variables** section.
3. Deploy the project. Vercel automatically detects Next.js configurations, builds the production bundles, and provisions SSL/HTTPS certificates.

---

## 🔑 Admin Dashboard & Role Management

To create the initial Superadmin profile:
1. Navigate to `/admin` and click **Sign Up** (or create an account).
2. Once registered, access your Firebase Console, navigate to **Firestore Database > Collections > adminUsers**, find the document with your `uid`, and update the `role` field from `"editor"` to `"superadmin"`.
3. Once logged in as Superadmin, you can approve other admin applications, change member roles, edit settings, view audit activity logs, and edit all website modules.
