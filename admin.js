import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";

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
  const kategori = document.getElementById("kategori").value.trim();
  const jsonInput = document.getElementById("jsonInput").value.trim();
  const durum = document.getElementById("durum");

  if (!kategori || !jsonInput) {
    durum.textContent = "⚠️ Lütfen kategori ve JSON verisini doldur.";
    return;
  }

  try {
    const veriler = JSON.parse(jsonInput);
    const koleksiyon = collection(db, kategori);

    for (const veri of veriler) {
      await addDoc(koleksiyon, veri);
    }

    durum.textContent = "✅ Testler başarıyla yüklendi!";
  } catch (e) {
    console.error("Hata:", e);
    durum.textContent = "❌ JSON geçersiz veya yükleme hatası!";
  }
});
