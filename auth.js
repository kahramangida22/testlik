import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

import {
  getFirestore,
  doc,
  setDoc,
  getDoc
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDcneigub2eAJjTrfrkiETuLgy5ule8L6s",
  authDomain: "testlik.firebaseapp.com",
  projectId: "testlik",
  storageBucket: "testlik.firebasestorage.app",
  messagingSenderId: "668524500496",
  appId: "1:668524500496:web:579bb4fc5990c87afedc95",
  measurementId: "G-8ZEYBJCV3T"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Giriş Formu
window.login = async function () {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    window.location.href = "index.html";
  } catch (error) {
    alert("Giriş başarısız: " + error.message);
  }
};

// Kayıt Formu
window.register = async function () {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const kullaniciAdi = document.getElementById("kullaniciAdi").value.trim();

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Yeni kullanıcı Firestore'a kaydedilsin
    await setDoc(doc(db, "kullanicilar", user.uid), {
      email: email,
      kullaniciAdi: kullaniciAdi,
      puan: 0
    });

    window.location.href = "index.html";
  } catch (error) {
    alert("Kayıt başarısız: " + error.message);
  }
};

// Kullanıcı oturumunu kontrol et (giriş.html gibi yerlerde kullanılabilir)
window.isUserLoggedIn = function (callback) {
  onAuthStateChanged(auth, (user) => {
    callback(!!user);
  });
};
