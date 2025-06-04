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

const soruAlani = document.getElementById("soru-alani");
const durum = document.getElementById("durum");
const reklamAlani = document.getElementById("reklam-alani");
const bitisButonu = document.getElementById("bitis-butonu");

let sorular = [];
let aktifSoru = 0;
let kullaniciID = null;

fetch("basketbol.json")
  .then(res => res.json())
  .then(data => {
    sorular = shuffleArray(data);
    onAuthStateChanged(auth, (user) => {
      if (user) {
        kullaniciID = user.uid;
        soruGoster();
      } else {
        soruAlani.innerHTML = "<p>Test çözmek için giriş yapmalısın.</p>";
      }
    });
  });

function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
}

function soruGoster() {
  if (aktifSoru >= sorular.length) {
    soruAlani.innerHTML = "<h2>🎉 Tüm sorular çözüldü!</h2>";
    durum.innerHTML = "";
    bitisButonu.style.display = "block";
    return;
  }

  const soru = sorular[aktifSoru];
  soruAlani.innerHTML = `
    <h2>${soru.soru}</h2>
    ${soru.secenekler.map(secenek => `
      <button onclick="cevapKontrol('${secenek}', '${soru.dogru}')">${secenek}</button>
    `).join("")}
  `;

  reklamYenile();
}

window.cevapKontrol = async function(secilen, dogru) {
  if (secilen === dogru) {
    await puanEkle(10);
    durum.innerHTML = "✅ Doğru! +10 puan";
  } else {
    durum.innerHTML = `❌ Yanlış!<br>✅ Doğru cevap: ${dogru}`;
  }

  aktifSoru++;
  setTimeout(() => {
    durum.textContent = "";
    soruGoster();
  }, 1500);
};

async function puanEkle(puan) {
  const ref = doc(db, "puanlar", kullaniciID);
  const snap = await getDoc(ref);
  if (snap.exists()) {
    const mevcut = snap.data().puan || 0;
    await updateDoc(ref, { puan: mevcut + puan });
  }
}

function reklamYenile() {
  reklamAlani.innerHTML = "";
  setTimeout(() => {
    reklamAlani.innerHTML = `
      <div style="background:#f0f0f0;padding:15px;border-radius:8px;">🏀 Reklam alanı (Basketbol)</div>
    `;
  }, 200);
}
