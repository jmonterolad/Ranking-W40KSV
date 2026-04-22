// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDe6CWPVv-v_A0xi1m0JN59VkOJGiyXRPk",
  authDomain: "rankingusuarios.firebaseapp.com",
  projectId: "rankingusuarios",
  storageBucket: "rankingusuarios.firebasestorage.app",
  messagingSenderId: "483148826483",
  appId: "1:483148826483:web:2235eb93877b5f72022706"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };