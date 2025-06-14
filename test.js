import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import {
  getFirestore, collection, getDocs, query, where
} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

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

// Kategori parametresini al
const params = new URLSearchParams(window.location.search);
const kategori = params.get("kategori");

// HTML öğeleri
const baslikEl = document.getElementById("kategoriBaslik");
const testGrid = document.getElementById("kategoriTestleri");

// Başlık yaz
baslikEl.textContent = kategori ? `📋 ${kategori} Testleri` : "📋 Tüm Testler";

// Firestore'dan testleri çek
async function kategoriyeGoreTestYukle() {
  const q = kategori
    ? query(collection(db, "testler"), where("kategori", "==", kategori))
    : query(collection(db, "testler"));

  const snapshot = await getDocs(q);
  testGrid.innerHTML = "";

  if (snapshot.empty) {
    testGrid.innerHTML = `<p style="padding:1rem; background:#fff3cd; color:#856404; border-radius:8px;">
      Bu kategoriye ait test bulunamadı.
    </p>`;
    return;
  }

  snapshot.forEach(doc => {
    const veri = doc.data();
    const div = document.createElement("div");
    div.className = "test-kutu";
    div.innerHTML = `<h3>${veri.baslik}</h3><p><strong>Kategori:</strong> ${veri.kategori}</p>`;
    div.onclick = () => {
      window.location.href = `test-coz.html?id=${doc.id}`;
    };
    testGrid.appendChild(div);
  });
}

kategoriyeGoreTestYukle();
