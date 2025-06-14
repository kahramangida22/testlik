import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import {
  getFirestore, collection, getDocs, query, orderBy, limit
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

async function populerHaberleriYukle() {
  const q = query(collection(db, "haberler"), orderBy("tiklanmaSayisi", "desc"), limit(5));
  const snapshot = await getDocs(q);
  const container = document.getElementById("populerHaberler");
  container.innerHTML = "";

  snapshot.forEach(doc => {
    const veri = doc.data();
    const div = document.createElement("div");
    div.className = "haber-kutu";
    div.innerHTML = `<h3>${veri.baslik}</h3><p>${veri.kategori}</p>`;
    div.onclick = () => {
      window.location.href = `haber-detay.html?id=${doc.id}`;
    };
    container.appendChild(div);
  });
}

async function haberKategorileriniYukle() {
  const q = query(collection(db, "haberler"));
  const snapshot = await getDocs(q);
  const kategoriSet = new Set();

  snapshot.forEach(doc => {
    const veri = doc.data();
    if (veri.kategori) kategoriSet.add(veri.kategori);
  });

  const container = document.getElementById("haberKategorileri");
  container.innerHTML = "";

  kategoriSet.forEach(kategori => {
    const div = document.createElement("div");
    div.className = "kategori-kutu";
    div.innerHTML = `<h3>${kategori}</h3>`;
    div.onclick = () => {
      window.location.href = `haberler-kategori.html?kategori=${kategori}`;
    };
    container.appendChild(div);
  });
}

populerHaberleriYukle();
haberKategorileriniYukle();
