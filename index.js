// Firebase modüllerini içe aktar
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

// Firebase yapılandırması
const firebaseConfig = {
  apiKey: "AIzaSyDcneigub2eAJjTrfrkiETuLgy5ule8L6s",
  authDomain: "testlik.firebaseapp.com",
  projectId: "testlik",
  storageBucket: "testlik.appspot.com",
  messagingSenderId: "668524500496",
  appId: "1:668524500496:web:579bb4fc5990c87afedc95"
};

// Firebase'i başlat
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore(app);

// Giriş yapan kullanıcıyı göster
const kullaniciAlani = document.getElementById("kullaniciAlani");

onAuthStateChanged(auth, async (user) => {
  if (user) {
    try {
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      const puan = userSnap.exists() ? (userSnap.data().puan || 0) : 0;

      kullaniciAlani.innerHTML = `
        <span>👤 ${user.displayName || "Kullanıcı"}</span>
        <span>⭐ ${puan} puan</span>
        <button onclick="cikisYap()">🚪 Çıkış</button>
      `;
    } catch (error) {
      console.error("Puan alınamadı:", error);
      kullaniciAlani.innerHTML = `<span>👤 ${user.displayName || "Kullanıcı"}</span>
        <span>⭐ 0 puan</span>
        <button onclick="cikisYap()">🚪 Çıkış</button>`;
    }
  } else {
    kullaniciAlani.innerHTML = `<a href="giris.html">🔐 Giriş Yap</a>`;
  }
});

// Çıkış yap butonu
window.cikisYap = () => {
  signOut(auth).then(() => location.reload());
};
