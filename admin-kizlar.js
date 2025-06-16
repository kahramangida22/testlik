// admin-kizlar.js
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

const konuInput = document.getElementById("konuJsonInput");
const konuBtn = document.getElementById("konuEkleBtn");
const sonucAlani = document.getElementById("sonucAlani");

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

function yazSonuc(mesaj, basarili = true) {
  sonucAlani.innerText = mesaj;
  sonucAlani.style.color = basarili ? "green" : "red";
  setTimeout(() => (sonucAlani.innerText = ""), 4000);
}
