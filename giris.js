import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

import {
  getFirestore,
  doc,
  setDoc
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// Firebase ayarları
const firebaseConfig = {
  apiKey: "AIzaSyDcneigub2eAJjTrfrkiETuLgy5ule8L6s",
  authDomain: "testlik.firebaseapp.com",
  projectId: "testlik",
  storageBucket: "testlik.firebasestorage.app",
  messagingSenderId: "668524500496",
  appId: "1:668524500496:web:579bb4fc5990c87afedc95"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Üye ol
window.uyeOl = async function () {
  const kullaniciAdi = document.getElementById("uyeKullaniciAdi").value;
  const email = document.getElementById("uyeEmail").value;
  const sifre = document.getElementById("uyeSifre").value;
  const mesaj = document.getElementById("uyeMesaj");

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, sifre);
    const user = userCredential.user;

    // Firestore’a kaydet
    await setDoc(doc(db, "kullanicilar", user.uid), {
      kullaniciAdi: kullaniciAdi,
      puan: 0
    });

    mesaj.textContent = "✅ Kayıt başarılı! Giriş yapabilirsiniz.";
    mesaj.style.color = "green";
  } catch (error) {
    mesaj.textContent = "❌ Kayıt yapılamadı: " + error.message;
    mesaj.style.color = "red";
  }
};

// Giriş yap
window.girisYap = async function () {
  const email = document.getElementById("girisEmail").value;
  const sifre = document.getElementById("girisSifre").value;
  const mesaj = document.getElementById("girisMesaj");

  try {
    await signInWithEmailAndPassword(auth, email, sifre);
    mesaj.textContent = "✅ Giriş başarılı! Yönlendiriliyorsunuz...";
    mesaj.style.color = "green";

    setTimeout(() => {
      window.location.href = "index.html";
    }, 1000);
  } catch (error) {
    mesaj.textContent = "❌ Giriş yapılamadı: " + error.message;
    mesaj.style.color = "red";
  }
};

// Otomatik giriş kontrolü
onAuthStateChanged(auth, (user) => {
  if (user) {
    localStorage.setItem("userUid", user.uid);
  }
});
