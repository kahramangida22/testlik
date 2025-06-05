import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

// Firebase yapılandırması (senin verdiklerine göre)
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

document.getElementById("gonderBtn").addEventListener("click", async () => {
  const jsonText = document.getElementById("jsonInput").value.trim();
  const kategori = document.getElementById("kategoriInput").value.trim().toLowerCase();
  const mesajEl = document.getElementById("durumMesaji");

  if (!jsonText || !kategori) {
    mesajEl.textContent = "Lütfen JSON ve kategori adı giriniz.";
    mesajEl.style.color = "red";
    return;
  }

  try {
    const testVerileri = JSON.parse(jsonText);
    if (!Array.isArray(testVerileri)) throw new Error("JSON dizi olmalı.");

    for (let veri of testVerileri) {
      await addDoc(collection(db, kategori), veri);
    }

    mesajEl.textContent = "✅ Test(ler) başarıyla kaydedildi!";
    mesajEl.style.color = "green";
  } catch (e) {
    mesajEl.textContent = "❌ Hata: " + e.message;
    mesajEl.style.color = "red";
  }
});
