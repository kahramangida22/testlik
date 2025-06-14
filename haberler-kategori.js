import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import {
  getFirestore, collection, query, where, getDocs
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

const kategoriBaslik = document.getElementById("kategoriBaslik");
const haberListesi = document.getElementById("haberListesi");

kategoriBaslik.textContent = `${kategori} Haberleri`;

async function kategoriHaberleri() {
  const q = query(collection(db, "haberler"), where("kategori", "==", kategori));
  const snapshot = await getDocs(q);
  haberListesi.innerHTML = "";

  snapshot.forEach(doc => {
    const veri = doc.data();
    const div = document.createElement("div");
    div.className = "haber-kutu";
    div.innerHTML = `<h3>${veri.baslik}</h3>`;
    div.onclick = () => {
      window.location.href = `haber-detay.html?id=${doc.id}`;
    };
    haberListesi.appendChild(div);
  });
}

kategoriHaberleri();
