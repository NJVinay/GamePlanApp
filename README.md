# GamePlan

![React Native](https://img.shields.io/badge/Framework-React%20Native-blue)
![Firebase](https://img.shields.io/badge/Backend-Firebase-orange)
![Expo](https://img.shields.io/badge/Platform-Expo-green)
![JavaScript](https://img.shields.io/badge/Language-JavaScript-yellow)
![Deployed](https://img.shields.io/badge/Status-Live%20on%20Netlify-success)

---

**Duration:** Nov 2024 - Jan 2025  
**Institution:** Blekinge Institute of Technology  
**Live Demo:** [https://gameplanapp.netlify.app](https://gameplanapp.netlify.app)

---

## Project Overview

GamePlan is a full-stack training management application built with React Native and deployed as a web application. Originally developed as a mobile app, it has been optimized for web deployment to provide recruiters and stakeholders with instant access to a live demo. The app enables trainers to assign tasks, monitor student progress, and log attendance with GPS verification to ensure accountability and structure.

**Key Highlights:**

- 🌐 **Web Deployment:** Accessible via browser at gameplanapp.netlify.app
- 🔥 **Firebase Integration:** Real-time Firestore database with persistent authentication
- 📱 **Responsive Design:** Mobile-first UI optimized for all screen sizes
- 🎨 **Modern UI/UX:** Smooth transitions, hover effects, and polished interactions
- 🔐 **Secure:** Firebase security rules, restricted API keys, role-based access control

---

## Developer’s Perspective

### Motivation & Goals

As the lead developer, my primary objective was to build a reliable, scalable, and user-friendly mobile app that addresses key pain points in training programs:

- Simplify task assignment and tracking for trainers
- Automate attendance logging using geolocation
- Provide real-time updates for better engagement and planning

---

### Architecture & Technology Stack

**Core Technologies:**

- **Frontend:** React Native 0.76.5 with Expo SDK 52 for cross-platform development
- **Web Adaptation:** react-native-web for browser compatibility
- **Backend:** Firebase Firestore (NoSQL real-time database) + Firebase Authentication
- **Navigation:** React Navigation v7 with Stack Navigator
- **State Management:** React Context API with Firebase integration
- **Geolocation:** Expo Location API for GPS-based attendance verification
- **Deployment:** Netlify (production web hosting)
- **Version Control:** Git and GitHub

**Key Libraries:**

- `@react-native-picker/picker` - Platform-optimized dropdown selections
- `@expo/vector-icons` - Comprehensive icon library
- `react-native-calendars` - Date selection and task scheduling

**Web-Specific Enhancements:**

- Custom CSS injection for viewport optimization
- Browser localStorage persistence for authentication
- Responsive scrolling and layout adjustments
- Custom scrollbar theming (#DA0037 brand color)

---

### Key Features & Implementation Details

#### 1. Authentication & Session Management

- **Firebase Authentication** with email/password sign-in for secure access
- **Browser Persistence:** `browserLocalPersistence` ensures users stay logged in on page refresh
- **Auto-Detection:** `LoadingScreen` uses `onAuthStateChanged` to detect existing sessions and redirect to appropriate dashboard
- **Role-Based Access:** Separate user types (trainer/student) with distinct UI flows and permissions
- **Secure Password Reset:** Email-based password recovery via Firebase Auth

#### 2. Real-time State Management

- **Context API Integration:** `TrainerContext` and `StudentContext` provide app-wide state management
- **Firebase Sync:** Both contexts connected to Firestore with real-time listeners (`onAuthStateChanged`)
- **Data Persistence:** Profile updates in settings screens immediately sync to Firestore
- **Optimistic Updates:** Local state updates while Firebase operations execute in background

#### 3. Task Management

- Trainers create, assign, and update tasks stored in Firestore `tasks` collection
- Students receive real-time updates via Firestore listeners
- Task progress tracked with timestamps and completion status
- Individual student task pages show complete assignment history

#### 4. GPS-Based Attendance Logging

- **Expo Location API** captures precise GPS coordinates at check-in
- Attendance records include geolocation data, timestamps, and verification status
- Proximity validation ensures students are within trainer-defined radius
- Attendance history stored in Firestore `attendance` collection

#### 5. Profile Management

- **Editable Settings:** Trainers and students can update personal details, sport preferences, contact info
- **Trainer Verification:** Students must enter valid trainer ID during signup (verified against Firestore `trainers` collection)
- **Profile Display:** Dedicated profile screens show user information with visual hierarchy

#### 6. UI/UX Enhancements

- **Consistent Typography:** Standardized font sizes (16-20px) across all screens for readability
- **Interactive Feedback:** Button hover effects with lift animations and shadows
- **Focus States:** Input fields glow with brand color (#DA0037) on focus
- **Smooth Transitions:** 0.3s cubic-bezier animations on all interactive elements
- **Custom Dropdowns:** Dark-themed select elements with proper contrast
- **Accessibility:** Focus-visible outlines, proper text selection, keyboard navigation support

---

### Challenges & Solutions

- **Mobile to Web Conversion:**  
  Adapted React Native mobile app for web deployment using react-native-web. Required custom CSS injection in App.js to handle viewport scaling, scrolling behavior, and responsive layouts across browsers.

- **Firebase Context Integration:**  
  StudentContext was initially local-only without Firebase connection. Refactored to include Firestore imports, `fetchStudentData()`, `updateStudentData()`, and auth state listeners to ensure settings changes persist to database.

- **Authentication Persistence:**  
  Users were logged out on browser refresh. Implemented `browserLocalPersistence` and added `onAuthStateChanged` listener in LoadingScreen to detect existing sessions and auto-redirect to appropriate dashboard.

- **Trainer Verification Bug:**  
  Student signup failed to find trainers because it used trainerID as document ID instead of querying the field. Fixed by using `query(trainersRef, where('trainerID', '==', formData.trainerID))` instead of direct document lookup.

- **Field Name Mismatches:**  
  Trainer profile showed "Cricket" default instead of actual sport due to field name inconsistency (stored as `sports` but read as `sport`). Standardized all references to match Firestore schema.

- **Web Styling Override:**  
  Expo's build process ignored custom `web/index.html` file. Resolved by injecting CSS directly into App.js using Platform.OS check and document.createElement('style') for web-specific styling.

- **Viewport Zoom Issues:**  
  Production deployment showed zoomed-in content. Fixed with `-webkit-text-size-adjust: 100%` and proper viewport meta tag configuration injected at runtime.

---

### Testing & Quality Assurance

- **Cross-browser Testing:** Verified functionality on Chrome, Firefox, Safari, and Edge
- **Responsive Design Testing:** Tested across mobile, tablet, and desktop viewport sizes
- **Firebase Integration Testing:** Validated real-time sync, auth persistence, and data consistency
- **Security Testing:** Verified Firebase security rules, API key restrictions, and role-based access
- **User Flow Testing:** Complete signup → login → dashboard → settings → logout cycles for both roles
- **Performance Testing:** Monitored bundle size (2.83 MB), load times, and Firebase read/write operations
- **Accessibility Testing:** Keyboard navigation, focus states, and screen reader compatibility

---

### Project Structure

```plaintext
/GamePlanApp
├── /android              # Android native build files
├── /ios                  # iOS native build files
├── /assets               # Images, logos, banners
├── /components
│   └── /Auth            # All authentication & screen components
│       ├── LoginScreen.js
│       ├── TrainerSignUpScreen.js
│       ├── StudentSignUpScreen.js
│       ├── TrainerDashboardScreen.js
│       ├── StudentDashboardScreen.js
│       ├── SettingsScreen.js (Trainer)
│       ├── StudentSettingsScreen.js
│       ├── TrainerContext.js
│       ├── StudentContext.js
│       └── ... (other screens)
├── /utils
│   ├── firebaseConfig.js    # Firebase initialization
│   └── attendanceUtils.js   # GPS attendance logic
├── /tests                # Unit, integration & UI tests
├── /dist                 # Production web build output
├── /web                  # Web-specific assets (index.html template)
├── App.js                # Main app entry with navigation
├── app.json              # Expo configuration
├── package.json          # Dependencies
└── README.md
```

---

## Setup & Running the App

### Prerequisites

- Node.js 16+ and npm/yarn
- Expo CLI: `npm install -g expo-cli`
- Firebase project with Firestore and Authentication enabled

### Local Development

```bash
# Clone the repository
git clone https://github.com/NJVinay/GamePlanApp.git
cd GamePlanApp

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Add your Firebase credentials to .env:
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
# ... (see .env.example for all required variables)

# Start development server
npx expo start

# For web development
npx expo start --web
```

### Production Build & Deployment

```bash
# Build for web
npx expo export --platform web

# Deploy to Netlify
npm install -g netlify-cli
netlify deploy --prod --dir=dist

# Or use Netlify drag & drop at app.netlify.com/drop
```

### Firebase Setup

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable **Authentication** (Email/Password provider)
3. Enable **Firestore Database**
4. Create collections: `trainers`, `students`, `tasks`, `attendance`
5. Set up security rules (see `firestore.rules`)
6. Add web app and copy config to `.env`

### Google Maps API (Optional - for GPS features)

1. Create API key at [console.cloud.google.com](https://console.cloud.google.com/apis/credentials)
2. Enable Maps JavaScript API
3. **Restrict key** to your domain(s) for security
4. Add to `.env` as `EXPO_PUBLIC_GOOGLE_MAPS_API_KEY`

---

## Future Improvements

**Planned Enhancements:**

- 📱 **Mobile Apps:** Build native iOS/Android apps using EAS Build
- 🔔 **Push Notifications:** Task reminders and attendance alerts via Firebase Cloud Messaging
- 📊 **Analytics Dashboard:** Trainer insights on student engagement and task completion rates
- 💾 **Offline Mode:** Local data caching with sync when connection restored
- 🌍 **Internationalization:** Multi-language support (Spanish, French, etc.)
- 🎨 **Theme Customization:** Light mode option and brand color customization
- 🔗 **Third-party Integrations:** Google Calendar sync, Slack notifications
- 📈 **Progress Tracking:** Visual charts for student performance over time
- 🔐 **Two-Factor Authentication:** Enhanced security with SMS/authenticator app
- ♿ **Enhanced Accessibility:** ARIA labels, screen reader optimization, WCAG 2.1 AA compliance

---

## Technical Achievements

**Key Accomplishments:**

- ✅ Successfully converted React Native mobile app to production web application
- ✅ Implemented full-stack Firebase integration with real-time data synchronization
- ✅ Deployed to Netlify with automatic HTTPS and global CDN
- ✅ Achieved 0 npm vulnerabilities after package cleanup
- ✅ Standardized UI/UX with consistent typography (16-20px) and brand theming
- ✅ Implemented browser session persistence with automatic auth state detection
- ✅ Built responsive design working across mobile, tablet, and desktop
- ✅ Integrated GPS-based attendance verification with proximity validation
- ✅ Created comprehensive test suite (unit, integration, UI tests)

**Performance Metrics:**

- Bundle size: 2.83 MB (optimized for web)
- Build time: ~15 seconds (Metro bundler)
- Deployment time: ~12 seconds (Netlify)
- Lighthouse scores: Performance 85+, Accessibility 90+

---

## Live Demo Access

**Production URL:** [https://gameplanapp.netlify.app](https://gameplanapp.netlify.app)

**Test Credentials (for recruiters):**

_Trainer Account:_

- Email: test.trainer@gameplan.com
- Password: Trainer123!

_Student Account:_

- Email: test.student@gameplan.com
- Password: Student123

**Note:** This is a demonstration project. Test data may be reset periodically.

---

## Acknowledgements

This project was developed as part of the academic curriculum at **Blekinge Institute of Technology** (Nov 2024 - Jan 2025). Special thanks to the project team for their collaboration and to BTH for providing the resources and learning environment.

**Skills Demonstrated:**

- Full-stack development with React Native + Firebase
- Web deployment and DevOps (Netlify, Git)
- Real-time database synchronization and state management
- GPS/geolocation integration
- UI/UX design with responsive layouts
- Authentication and security implementation
- Cross-platform compatibility (mobile/web)
- Testing and quality assurance

---

## Contact & Links

**Live Application:** [gameplanapp.netlify.app](https://gameplanapp.netlify.app)  
**Developer:** Vinay NJ  
**Institution:** Blekinge Institute of Technology


**License:** MIT  
**Last Updated:** January 2026
