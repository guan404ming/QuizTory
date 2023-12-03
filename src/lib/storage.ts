// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "quiztory-f5e09.firebaseapp.com",
  projectId: "quiztory-f5e09",
  storageBucket: "quiztory-f5e09.appspot.com",
  messagingSenderId: "237993415808",
  appId: "1:237993415808:web:20f6c0ea9695ab591cc265",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const auth = getAuth(app);
