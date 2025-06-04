import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import {
  getFirestore, collection, getDocs, doc, getDoc, setDoc
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import {
  getAuth, onAuthStateChanged, signOut
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

// Firebase yapılandırması
const firebaseConfig = {
  apiKey: "AIzaSyDcneigub2eAJjTrfrkiETuLgy5ule8L6s",
  authDomain: "testlik.firebaseapp.com",
  projectId: "testlik",
  storageBucket: "testlik.firebasestorage.app",
  messagingSenderId: "668524500496",
  appId: "1:668524500496:web:579bb4fc5990c87afedc95"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();

let sorular = [];
let mevcutSoru = null;
let cevaplandi = false;
let kullanici = null;

// Giriş durumu kontrolü
onAuthStateChanged(auth, async (user) => {
  if (user) {
    kullanici = user;
    document.getElementById("girisBtn").style.display = "none";
    document.getElementById("girisBilgisi").style.display = "block";

    const puanRef = doc(db, "puanlar", user.uid);
    const snap = await getDoc(puanRef);
    if (snap.exists()) {
      const data = snap.data();
      document.getElementById("kullanici-adi").textContent = data.kullaniciAdi || "👤";
      document.getElementById("kullanici-puani").textContent = data.puan || 0;
    }
  }

  sorulariGetir();
});

window.cikisYap = function () {
  signOut(auth).then(() => location.reload());
};

async function sorulariGetir() {
  const querySnapshot = await getDocs(collection(db, "mizah"));
  sorular = [];
  querySnapshot.forEach((doc) => {
    sorular.push(doc.data());
  });
  sonrakiSoru();
}

function sonrakiSoru() {
  cevaplandi = false;
  mevcutSoru = sorular[Math.floor(Math.random() * sorular.length)];

  if (!mevcutSoru) {
    document.getElementById("test-bitti").style.display = "block";
    document.querySelector(".soru-kapsayici").style.display = "none";
    return;
  }

  document.getElementById("soru").textContent = mevcutSoru.soru;
  document.getElementById("dogru-cevap").textContent = "";
  document.getElementById("sonrakiBtn").style.display = "none";

  const seceneklerDiv = document.getElementById("secenekler");
  seceneklerDiv.innerHTML = "";

  mevcutSoru.secenekler.forEach(secenek => {
    const btn = document.createElement("button");
    btn.textContent = secenek;
    btn.addEventListener("click", () => cevapKontrol(secenek, btn));
    seceneklerDiv.appendChild(btn);
  });

  reklamYenile();
}

async function cevapKontrol(secenek, buton) {
  if (cevaplandi) return;
  cevaplandi = true;

  const temizSecenek = secenek.trim().toLowerCase();
  const dogru = mevcutSoru.dogru.trim().toLowerCase();

  if (temizSecenek === dogru) {
    buton.style.backgroundColor = "#4caf50";
    if (kullanici) await puanArtir(10);
  } else {
    buton.style.backgroundColor = "#e53935";
    document.getElementById("dogru-cevap").textContent = `❌ Yanlış! Doğru cevap: ${mevcutSoru.dogru}`;
  }

  document.getElementById("sonrakiBtn").style.display = "block";
}

async function puanArtir(puan) {
  const ref = doc(db, "puanlar", kullanici.uid);
  const snap = await getDoc(ref);
  if (snap.exists()) {
    const mevcut = snap.data().puan || 0;
    await setDoc(ref, {
      puan: mevcut + puan,
      kullaniciAdi: snap.data().kullaniciAdi
    });
    document.getElementById("kullanici-puani").textContent = mevcut + puan;
  }
}

function reklamYenile() {
  const reklam = document.getElementById("reklam-alani");
  reklam.innerHTML = `<p>📺 Yeni reklam: ${Math.floor(Math.random() * 10000)}</p>`;
}

document.getElementById("sonrakiBtn").addEventListener("click", sonrakiSoru);
