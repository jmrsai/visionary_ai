// src/lib/firebase.ts
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAAGmFf0f9A0vMIMKADl2tSAcQRk_gdaUg",
  authDomain: "studio-4426725626-6840a.firebaseapp.com",
  projectId: "studio-4426725626-6840a",
  storageBucket: "studio-4426725626-6840a.appspot.com",
  messagingSenderId: "57928112575",
  appId: "1:57928112575:web:000176513ef39dbb01e90a",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
