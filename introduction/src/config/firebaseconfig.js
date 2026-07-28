import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {addDoc,
 getDocs,
 query,
 where,
 orderBy,
 doc,
 updateDoc,
 deleteDoc,
 serverTimestamp } from "firebase/firestore";
import {
 db
} from "./firebase.js";
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: "1:922923329048:web:ba159bf36ec9a3f053c56d",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;

