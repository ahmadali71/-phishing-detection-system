/**
 * Firebase configuration for APDS Phishing Detection System
 *
 * Setup instructions:
 * 1. Go to https://console.firebase.google.com/
 * 2. Create a new project (or use existing)
 * 3. Go to Project Settings → General → Your apps → Web app
 * 4. Register the app and copy the config values below
 * 5. Enable Firestore Database in the Firebase Console
 * 6. (Optional) Enable Authentication for email/password sign-in
 *
 * Replace the placeholder values below with your actual Firebase project config.
 */

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "YOUR_API_KEY",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "YOUR_PROJECT_ID",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "YOUR_MESSAGING_SENDER_ID",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "YOUR_APP_ID",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || undefined
};

export const isFirebaseConfigured = () => {
  const { apiKey, projectId } = firebaseConfig;
  return apiKey !== "YOUR_API_KEY" && projectId !== "YOUR_PROJECT_ID";
};
