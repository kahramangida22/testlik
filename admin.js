import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

// Firebase yapılandırması
const firebaseConfig = {
  apiKey: "AIzaSyDcneigub2eAJjTrfrkiETuLgy5ule8L6s",
  authDomain: "testlik.firebaseapp.com",
  projectId: "testlik",
  storageBucket: "testlik.appspot.com",
  messagingSenderId: "668524500496",
  appId: "1:668524500496:web:579bb4fc5990c87afedc95"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// DOM elemanları
const testBtn = document.getElementById("testEkleBtn");
const haberBtn = document.getElementById("haberEkleBtn");
const testInput = document.getElementById("testJsonInput");
const haberInput = document.getElementById("haberJsonInput");
const sonucAlani = document.getElementById("sonucAlani");

// Geri bildirim yazdır
function yazSonuc(mesaj, basarili = true) {
  sonucAlani.innerText = mesaj;
  sonucAlani.style.color = basarili ? "green" : "red";
  setTimeout(() => (sonucAlani.innerText = ""), 4000);
}

// Testleri ekle
testBtn.addEventListener("click", async () => {
  try {
    const veriler = JSON.parse(testInput.value);
    if (!Array.isArray(veriler)) throw new Error("JSON bir dizi olmalı");

    for (let test of veriler) {
      if (!test.baslik || !test.kategori || !Array.isArray(test.sorular)) continue;

      await addDoc(collection(db, "testler"), {
        ...test,
        cozulmeSayisi: 0,
        eklenmeTarihi: serverTimestamp()
      });
    }
    yazSonuc("✅ Test(ler) başarıyla eklendi.");
    testInput.value = "";
  } catch (e) {
    console.error(e);
    yazSonuc("❌ Hatalı JSON formatı (Testler)", false);
  }
});

// Haberleri ekle
haberBtn.addEventListener("click", async () => {
  try {
    const veriler = JSON.parse(haberInput.value);
    if (!Array.isArray(veriler)) throw new Error("JSON bir dizi olmalı");

    for (let haber of veriler) {
      if (!haber.baslik || !haber.icerik || !haber.kategori) continue;

      await addDoc(collection(db, "haberler"), {
        ...haber,
        tiklanmaSayisi: 0,
        eklenmeTarihi: serverTimestamp()
      });
    }
    yazSonuc("✅ Haber(ler) başarıyla eklendi.");
    haberInput.value = "";
  } catch (e) {
    console.error(e);
    yazSonuc("❌ Hatalı JSON formatı (Haberler)", false);
  }
});
const konuInput = document.getElementById("konuJsonInput");
const konuBtn = document.getElementById("konuEkleBtn");

konuBtn.addEventListener("click", async () => {
  const input = konuInput.value.trim();
  if (!input) return yazSonuc("Lütfen konu JSON'u girin.", false);

  let konular = [];
  try {
    konular = JSON.parse(input);
  } catch {
    return yazSonuc("Geçersiz JSON formatı.", false);
  }

  let eklendi = 0;
  for (const konu of konular) {
    if (!konu.baslik || !konu.aciklama) continue;
    await addDoc(collection(db, "konular"), {
      baslik: konu.baslik,
      aciklama: konu.aciklama,
      kullaniciAdi: "admin",
      uid: "admin",
      tarih: serverTimestamp(),
      begeniler: 0,
      dislikelar: 0,
      begenenler: [],
      dislikelayanlar: [],
      okunma: 0
    });
    eklendi++;
  }

  yazSonuc(`${eklendi} konu başarıyla eklendi ✅`);
  konuInput.value = "";
});
