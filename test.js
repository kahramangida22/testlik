import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import {
  getFirestore, collection, getDocs, query, where
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

const params = new URLSearchParams(window.location.search);
const kategori = params.get("kategori");

const baslikEl = document.getElementById("kategoriBaslik");
const testGrid = document.getElementById("kategoriTestleri");

baslikEl.textContent = kategori ? `${kategori} Testleri` : "Tüm Testler";

async function kategoriyeGoreTestYukle() {
  const q = kategori
    ? query(collection(db, "testler"), where("kategori", "==", kategori))
    : query(collection(db, "testler"));

  const snapshot = await getDocs(q);
  testGrid.innerHTML = "";

  snapshot.forEach(doc => {
    const veri = doc.data();
    const div = document.createElement("div");
    div.className = "test-kutu";
    div.innerHTML = `<h3>${veri.baslik}</h3>`;
    div.onclick = () => {
      window.location.href = `test-coz.html?id=${doc.id}`;
    };
    testGrid.appendChild(div);
  });
}

kategoriyeGoreTestYukle();
