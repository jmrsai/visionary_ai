'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, RecaptchaVerifier, ConfirmationResult, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';

// Extend the Window interface to include our recaptcha verifier
declare global {
    interface Window {
        recaptchaVerifier?: RecaptchaVerifier;
        confirmationResult?: ConfirmationResult;
        grecaptcha?: any;
    }
}

// A singleton to hold the initialized Firebase services.
let firebaseServices: {
  firebaseApp: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
  storage: FirebaseStorage;
} | null = null;


// IMPORTANT: DO NOT MODIFY THIS FUNCTION
export function initializeFirebase() {
  if (firebaseServices) {
    return firebaseServices;
  }

  let firebaseApp: FirebaseApp;
  if (getApps().length) {
    firebaseApp = getApp();
  } else {
    try {
      // Attempt to initialize via Firebase App Hosting environment variables
      firebaseApp = initializeApp();
    } catch (e) {
      if (process.env.NODE_ENV === "production") {
        console.warn('Automatic initialization failed. Falling back to firebase config object.', e);
      }
      firebaseApp = initializeApp(firebaseConfig);
    }
  }

  const auth = getAuth(firebaseApp);
  auth.languageCode = 'en';

  firebaseServices = {
    firebaseApp,
    auth,
    firestore: getFirestore(firebaseApp),
    storage: getStorage(firebaseApp)
  };
  
  return firebaseServices;
}


export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './non-blocking-updates';
export * from './non-blocking-login';
export * from './errors';
export * from './error-emitter';