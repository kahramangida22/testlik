import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp
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

// TEST EKLEME
document.getElementById("ekleBtn").addEventListener("click", async () => {
  const baslik = document.getElementById("baslik").value.trim();
  const kategori = document.getElementById("kategori").value.trim();
  const jsonVeri = document.getElementById("jsonVeri").value.trim();
  const durum = document.getElementById("durum");

  try {
    const sorular = JSON.parse(jsonVeri);
    if (!Array.isArray(sorular)) throw new Error("Geçersiz JSON dizisi!");

    await addDoc(collection(db, "testler"), {
      baslik,
      kategori,
      cozulmeSayisi: 0,
      eklenmeTarihi: serverTimestamp(),
      sorular
    });

    durum.innerText = "✅ Test başarıyla eklendi!";
    durum.style.color = "green";
  } catch (e) {
    durum.innerText = "❌ Hata: " + e.message;
    durum.style.color = "red";
  }
});

// HABER EKLEME
document.getElementById("haberEkleBtn").addEventListener("click", async () => {
  const baslik = document.getElementById("haberBaslik").value.trim();
  const kategori = document.getElementById("haberKategori").value.trim();
  const icerik = document.getElementById("haberIcerik").value.trim();
  const haberDurum = document.getElementById("haberDurum");

  try {
    if (!baslik || !kategori || !icerik) throw new Error("Tüm alanları doldurun.");

    await addDoc(collection(db, "haberler"), {
      baslik,
      kategori,
      icerik,
      tiklanmaSayisi: 0,
      eklenmeTarihi: serverTimestamp()
    });

    haberDurum.innerText = "✅ Haber başarıyla eklendi!";
    haberDurum.style.color = "green";
  } catch (e) {
    haberDurum.innerText = "❌ Hata: " + e.message;
    haberDurum.style.color = "red";
  }
});
