# GamePlan

![React Native](https://img.shields.io/badge/Framework-React%20Native-blue)
![Firebase](https://img.shields.io/badge/Backend-Firebase-orange)
![Expo](https://img.shields.io/badge/Platform-Expo-green)
![JavaScript](https://img.shields.io/badge/Language-JavaScript-yellow)

---

**Duration:** Nov 2024 - Jan 2025  
**Institution:** Blekinge Institute of Technology

---

## Project Overview

GamePlan is a React Native mobile application designed to simplify task management for trainers and students in a training environment. The app enables trainers to assign tasks, monitor student progress, and log attendance with GPS verification to ensure accountability and structure.

---

## Developer’s Perspective

### Motivation & Goals

As the lead developer, my primary objective was to build a reliable, scalable, and user-friendly mobile app that addresses key pain points in training programs:

- Simplify task assignment and tracking for trainers  
- Automate attendance logging using geolocation  
- Provide real-time updates for better engagement and planning

---

### Architecture & Technology Stack

- **Frontend:** React Native for cross-platform mobile app development (iOS & Android)  
- **Backend:** Firebase Firestore for real-time NoSQL database and Firebase Authentication for secure login  
- **Geolocation:** Expo Location API for GPS-based attendance verification  
- **Version Control & Collaboration:** Git and GitHub  
- **UI/UX Design:** Figma for prototyping and iterative design

---

### Key Features & Implementation Details

#### 1. Authentication

- Implemented Firebase Authentication with email/password sign-in to secure app access  
- Role-based access control (trainer/student) handled via user metadata in Firestore

#### 2. Task Management

- Trainers can create, assign, and update tasks stored in Firestore collections  
- Students receive real-time updates via Firestore listeners to stay current with assignments  
- Task progress is updated and synced immediately, enabling seamless tracking

#### 3. GPS-based Attendance Logging

- Utilized Expo Location API to capture precise GPS coordinates at check-in  
- Attendance records stored with geolocation data to verify student presence physically  
- Implemented validation logic to confirm students are within acceptable proximity during check-in

#### 4. Real-time Synchronization

- Firestore’s real-time listeners ensure that both trainers and students see live updates without manual refresh  
- This creates an interactive and engaging experience for all users

---

### Challenges & Solutions

- **Handling Nested Repositories:**  
  Initially faced issues with nested Git repos due to directory structure. Resolved by consolidating the repo to a single root directory to simplify version control.

- **Filename Length Limitations on Windows:**  
  Encountered errors related to long file paths (especially from macOS `.DS_Store` and `__MACOSX` folders). Excluded these files using `.gitignore` to avoid commit failures.

- **Real-time Data Consistency:**  
  Ensured synchronization between client and Firestore using listeners and optimized data reads to minimize latency.

- **User Role Management:**  
  Secured data by defining Firebase security rules restricting access based on user roles.

---

### Testing & Quality Assurance

- Manual testing on both iOS and Android simulators/emulators  
- Regression testing to verify new updates didn’t break existing functionality  
- Penetration testing techniques to verify authentication security  
- Usability validation through iterative UI improvements based on tester feedback  
- User acceptance testing with sample trainers and students to confirm requirements were met

---

### Folder Structure

```plaintext
/GamePlan
├── /assets
├── /components
├── /screens
├── /services  (API, Firebase configs)
├── /utils
├── App.js
├── package.json
└── README.md
```

# Setup & Running the App

## Clone the repository:
git clone https://github.com/NJVinay/GamePlanApp.git

## Install dependencies:
npm install

## Configure Firebase:
Add your Firebase config in services/firebase.js

## Run the app:
expo start

---

# Future Improvements

- Add push notifications for task reminders  
- Integrate analytics to track app usage  
- Support offline mode with local caching and sync  
- Enhance UI with animations and accessibility features  

---

# Acknowledgements

Grateful to my project team for their collaboration and to Blekinge Institute of Technology for providing the resources and environment to develop this project.

This project reflects hands-on experience in React Native, Firebase integration, real-time data synchronization, and GPS-based solutions, demonstrating a comprehensive mobile development skill set.
