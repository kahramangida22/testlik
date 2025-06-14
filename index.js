import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import {
  getFirestore,
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

import {
  getAuth,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";

// Firebase config
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
const db = getFirestore(app);
const auth = getAuth();
const kullaniciAlani = document.getElementById("kullaniciAlani");

// Kullanıcı bilgisi ve PUAN gösterimi (FIRESTORE'dan)
onAuthStateChanged(auth, async (user) => {
  if (user) {
    try {
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
      const puan = userSnap.exists() ? userSnap.data().puan || 0 : 0;

      kullaniciAlani.innerHTML = `
        <span>👤 ${user.displayName || "Kullanıcı"}</span>
        <span>⭐ ${puan} puan</span>
        <button onclick="cikisYap()">🚪 Çıkış</button>
      `;
    } catch (e) {
      console.error("Puan alınırken hata:", e);
      kullaniciAlani.innerHTML = `<span>👤 ${user.displayName}</span> <span>⭐ 0 puan</span>`;
    }
  } else {
    kullaniciAlani.innerHTML = `<a href="giris.html">🔐 Giriş Yap</a>`;
  }
});

window.cikisYap = () => {
  signOut(auth).then(() => location.reload());
};

// TEST VE HABER VERİLERİ
async function getVeriler(koleksiyon, siralamaAlani, hedefId) {
  const q = query(collection(db, koleksiyon), orderBy(siralamaAlani, "desc"), limit(5));
  const querySnapshot = await getDocs(q);
  const container = document.getElementById(hedefId);
  container.innerHTML = "";

  querySnapshot.forEach(doc => {
    const veri = doc.data();
    const div = document.createElement("div");
    div.className = koleksiyon === "testler" ? "test-kutu" : "haber-kutu";
    div.innerHTML = `
      <h3>${veri.baslik}</h3>
      <p><strong>Kategori:</strong> ${veri.kategori}</p>
    `;
    div.onclick = () => {
      window.location.href = koleksiyon === "testler"
        ? `test.html?kategori=${veri.kategori}`
        : `haber-detay.html?id=${doc.id}`;
    };
    container.appendChild(div);
  });
}

getVeriler("testler", "cozulmeSayisi", "populerTestler");
getVeriler("haberler", "tiklanmaSayisi", "populerHaberler");
getVeriler("testler", "eklenmeTarihi", "yeniTestler");
getVeriler("haberler", "eklenmeTarihi", "yeniHaberler");
