// =============================================================================
// Firebase configuration for social sign-in (Google)
// =============================================================================
//
// REAL VALUES ARE NOT PUBLIC — they live only in YOUR Firebase project.
// Get them from: Firebase console -> Project settings -> "Your apps" card ->
// pick the app -> "Config" (SDK snippet) -> copy the object.
// Docs: https://support.google.com/firebase/answer/7015592
//
// The object looks like this (replace the placeholder strings below):
//   {
//     apiKey:            "AIzaSyD....",          // FirebaseOptions.apiKey
//     authDomain:        "YOUR_PROJECT.firebaseapp.com",
//     projectId:         "YOUR_PROJECT_ID",       // <-- also used as backend FIREBASE_PROJECT_ID
//     storageBucket:     "YOUR_PROJECT.appspot.com",
//     messagingSenderId: "1234567890",
//     appId:             "1:1234567890:web:abc123",
//   }
//
// NOTE: the web `apiKey` is NOT a secret — it only identifies your project.
// Access is enforced by Firebase Security Rules, not by hiding this key.
// -----------------------------------------------------------------------------

export const firebaseConfig = {
  apiKey: 'AIzaSyBSlkHeWTzdkd_ycDIl9PMhE4HJLSvJRWQ',
  authDomain: 'projexa-02.firebaseapp.com',
  projectId: 'projexa-02',
  storageBucket: 'projexa-02.firebasestorage.app',
  messagingSenderId: '343642291938',
  appId: '1:343642291938:web:c836b1af624c9622a668bb',
};

// Web client ID from Firebase (Project settings -> Your apps -> SDK config,
// or Google Cloud console -> Credentials -> OAuth 2.0 Web client).
// Used by Google Sign-In on Android.
export const GOOGLE_WEB_CLIENT_ID =
  '506509574587-v61993voq3r3487aacbv7m5aneko68gf.apps.googleusercontent.com';

// =============================================================================
// ONE-TIME SETUP CHECKLIST (do this in the Firebase console)
// =============================================================================
// 1) Create a Firebase project (or pick an existing one).
// 2) Add apps:
//      - iOS app  (bundle id com.fitnessbattle.app) -> download GoogleService-Info.plist
//      - Android  (package com.fitnessbattle.app)   -> download google-services.json
//      - Web app  -> copy the config object above
//    Place those two files at the repo root of apps/mobile/ (already scaffolded
//    as placeholders — overwrite them with the real downloads).
// 3) Authentication -> Sign-in method -> enable Google (just toggle on;
//    uses the web client id configured above).
// 4) Backend: set FIREBASE_PROJECT_ID=<YOUR_PROJECT_ID> in backend/.env
//    (used by src/services/firebaseAuth.ts to verify ID tokens).
// =============================================================================
