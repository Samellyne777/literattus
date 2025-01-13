import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBwk8XqbAn5pq0GIe4rYhJkAfZuWBRVT5Q",
    authDomain: "literattus-3424e.firebaseapp.com",
    projectId: "literattus-3424e",
    storageBucket: "literattus-3424e.firebasestorage.app",
    messagingSenderId: "1018512325051",
    appId: "1:1018512325051:web:95cfa32f5ea005b2c3ec9e",
    measurementId: "G-QFE0RB59Z9"
  };

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
