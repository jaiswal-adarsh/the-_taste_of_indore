import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCAjrpZzotiViOsw71DXHlL3IJB4kXnS7g",
    authDomain: "the-taste-of-indore.firebaseapp.com",
    projectId: "the-taste-of-indore",
    storageBucket: "the-taste-of-indore.firebasestorage.app",
    messagingSenderId: "657979658550",
    appId: "1:657979658550:web:9240302e31ee17dc67a397"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
