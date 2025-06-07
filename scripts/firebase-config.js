// Firebase SDK (modüler v9+) bağlantısı
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";
import { getFirestore, collection, getDocs, doc, getDoc, updateDoc, setDoc, addDoc } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";

// 🔐 Firebase projenin bilgileri (senin verdiğin)
const firebaseConfig = {
  apiKey: "AIzaSyDcneigub2eAJjTrfrkiETuLgy5ule8L6s",
  authDomain: "testlik.firebaseapp.com",
  projectId: "testlik",
  storageBucket: "testlik.firebasestorage.app",
  messagingSenderId: "668524500496",
  appId: "1:668524500496:web:579bb4fc5990c87afedc95",
  measurementId: "G-8ZEYBJCV3T"
};

// 🔌 Uygulamayı başlat
const app = initializeApp(firebaseConfig);

// 🔐 Giriş işlemleri
const auth = getAuth(app);

// 📦 Veritabanı (Firestore)
const db = getFirestore(app);

// 🌍 Dışa aktar
export {
  auth,
  db,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  collection,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  setDoc,
  addDoc
};
