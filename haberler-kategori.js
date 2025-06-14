import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs
} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

// Firebase yapılandırması
const firebaseConfig = {
  apiKey: "AIzaSyDcneigub2eAJjTrfrkiETuLgy5ule8L6s",
  authDomain: "testlik.firebaseapp.com",
  projectId: "testlik",
  storageBucket: "testlik.appspot.com",
  messagingSenderId: "668524500496",
  appId: "1:668524500496:web:579bb4fc5990c87afedc95",
  measurementId: "G-8ZEYBJCV3T"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Kategoriyi URL'den al
const params = new URLSearchParams(window.location.search);
const kategori = params.get("kategori");

// Başlığı yazdır
const kategoriBaslik = document.getElementById("kategoriBaslik");
kategoriBaslik.textContent = kategori
  ? `${kategori.charAt(0).toUpperCase()}${kategori.slice(1)} Kategorisi`
  : "Kategori";

// Haberleri listele
const haberListesi = document.getElementById("haberListesi");

async function haberleriGetir() {
  const haberRef = collection(db, "haberler");
  const q = query(haberRef, where("kategori", "==", kategori));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    haberListesi.innerHTML = "<p>Bu kategoride henüz haber yok.</p>";
    return;
  }

  querySnapshot.forEach((doc) => {
    const data = doc.data();
    const haber = document.createElement("div");
    haber.className = "haber-kutu";
    haber.innerHTML = `
      <h3>${data.baslik}</h3>
      <p>${data.icerik.substring(0, 80)}...</p>
    `;
    haber.onclick = () => {
      window.location.href = `haber-detay.html?id=${doc.id}`;
    };
    haberListesi.appendChild(haber);
  });
}

haberleriGetir();
