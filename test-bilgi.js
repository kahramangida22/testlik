import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { getFirestore, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDcneigub2eAJjTrfrkiETuLgy5ule8L6s",
  authDomain: "testlik.firebaseapp.com",
  projectId: "testlik",
  storageBucket: "testlik.firebasestorage.app",
  messagingSenderId: "668524500496",
  appId: "1:668524500496:web:579bb4fc5990c87afedc95"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const sorular = [
  {
    soru: "Dünyanın en uzun nehri hangisidir?",
    secenekler: ["Nil", "Amazon", "Yangtze", "Mississippi"],
    dogru: "Nil"
  },
  {
    soru: "Türkiye'nin en kalabalık şehri neresidir?",
    secenekler: ["İstanbul", "Ankara", "İzmir", "Bursa"],
    dogru: "İstanbul"
  }
];

let aktifSoru = 0;
const soruKutusu = document.getElementById("soru-kutusu");
const cevaplar = document.getElementById("cevaplar");
const durum = document.getElementById("durum");
const butonlar = document.getElementById("butonlar");
let kullaniciID = null;

onAuthStateChanged(auth, (user) => {
  if (user) {
    kullaniciID = user.uid;
    soruGoster();
  } else {
    soruKutusu.innerHTML = "<p>Test çözmek için giriş yapmalısın.</p>";
  }
});

function soruGoster() {
  if (aktifSoru >= sorular.length) {
    soruKutusu.innerHTML = "<h3>🎉 Test tamamlandı!</h3>";
    cevaplar.innerHTML = "";
    butonlar.style.display = "block";
    return;
  }

  const soru = sorular[aktifSoru];
  soruKutusu.innerHTML = `<h2>${soru.soru}</h2>`;
  cevaplar.innerHTML = "";

  soru.secenekler.forEach(secenek => {
    const buton = document.createElement("button");
    buton.textContent = secenek;
    buton.onclick = () => cevapKontrol(secenek, soru.dogru);
    cevaplar.appendChild(buton);
  });
}

async function cevapKontrol(secilen, dogru) {
  if (secilen === dogru) {
    await puanEkle(10);
    durum.textContent = "✅ Doğru cevap! +10 puan";
  } else {
    durum.textContent = "❌ Yanlış cevap!";
  }

  aktifSoru++;
  setTimeout(() => {
    durum.textContent = "";
    soruGoster();
  }, 1000);
}

async function puanEkle(miktar) {
  const puanRef = doc(db, "puanlar", kullaniciID);
  const puanSnap = await getDoc(puanRef);
  if (puanSnap.exists()) {
    const mevcut = puanSnap.data().puan || 0;
    await updateDoc(puanRef, {
      puan: mevcut + miktar
    });
  }
}
