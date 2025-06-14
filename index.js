import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import {
  getFirestore,
  collection,
  query,
  orderBy,
  limit,
  getDocs
} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

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

// Firebase ayarları
const firebaseConfig = {
  apiKey: "AIzaSyDcneigub2eAJjTrfrkiETuLgy5ule8L6s",
  authDomain: "testlik.firebaseapp.com",
  projectId: "testlik",
  storageBucket: "testlik.appspot.com",
  messagingSenderId: "668524500496",
  appId: "1:668524500496:web:579bb4fc5990c87afedc95"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore(app);

const kullaniciAlani = document.getElementById("kullaniciAlani");

onAuthStateChanged(auth, async (user) => {
  if (user) {
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    let puan = 0;
    if (userSnap.exists()) {
      puan = userSnap.data().puan || 0;
    }

    kullaniciAlani.innerHTML = `
      <span>👤 ${user.displayName || "Kullanıcı"}</span>
      <span>⭐ ${puan} puan</span>
      <button onclick="cikisYap()">🚪 Çıkış</button>
    `;
  } else {
    kullaniciAlani.innerHTML = `<a href="giris.html">🔐 Giriş Yap</a>`;
  }
});

window.cikisYap = () => {
  signOut(auth).then(() => location.reload());
};.reload());
};
