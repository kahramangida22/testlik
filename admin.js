import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

// Firebase config
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

// ✅ TEST EKLEME
document.getElementById("ekleBtn").addEventListener("click", async () => {
  const jsonText = document.getElementById("jsonVeri").value.trim();
  const durum = document.getElementById("durum");

  try {
    const veri = JSON.parse(jsonText);
    if (!veri.baslik || !veri.kategori || !veri.sorular || !Array.isArray(veri.sorular)) {
      throw new Error("Test formatı hatalı.");
    }

    await addDoc(collection(db, "testler"), {
      baslik: veri.baslik,
      kategori: veri.kategori,
      sorular: veri.sorular,
      cozulmeSayisi: 0,
      eklenmeTarihi: serverTimestamp()
    });

    durum.innerText = "✅ Test başarıyla eklendi!";
    durum.style.color = "green";
  } catch (e) {
    durum.innerText = "❌ Hata: " + e.message;
    durum.style.color = "red";
  }
});

// ✅ HABER EKLEME
document.getElementById("haberEkleBtn").addEventListener("click", async () => {
  const jsonText = document.getElementById("haberJson").value.trim();
  const haberDurum = document.getElementById("haberDurum");

  try {
    const veri = JSON.parse(jsonText);
    if (!veri.baslik || !veri.kategori || !veri.icerik) {
      throw new Error("Haber formatı hatalı.");
    }

    await addDoc(collection(db, "haberler"), {
      baslik: veri.baslik,
      kategori: veri.kategori,
      icerik: veri.icerik,
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
