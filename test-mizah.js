import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import {
  getFirestore, collection, getDocs, doc, getDoc, setDoc
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import {
  getAuth, onAuthStateChanged
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
    document.getElementById("giris-yapan-panel").style.display = "block";
    const ref = doc(db, "puanlar", user.uid);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      const data = snap.data();
      document.getElementById("kullanici-adi").textContent = data.kullaniciAdi || "👤";
      document.getElementById("kullanici-puani").textContent = data.puan || 0;
    }
  }
  soruGetir();
});

window.cikisYap = function () {
  auth.signOut().then(() => location.reload());
};

// Firestore'dan mizah sorularını getir
async function soruGetir() {
  const querySnapshot = await getDocs(collection(db, "mizah"));
  sorular = [];
  querySnapshot.forEach((doc) => {
    sorular.push(doc.data());
  });
  sonrakiSoru();
}

// Yeni soru getir
function sonrakiSoru() {
  cevaplandi = false;
  mevcutSoru = sorular[Math.floor(Math.random() * sorular.length)];

  document.getElementById("soru").textContent = mevcutSoru.soru;
  document.getElementById("dogru-cevap").textContent = "";
  document.getElementById("sonrakiBtn").style.display = "none";

  const seceneklerDiv = document.getElementById("secenekler");
  seceneklerDiv.innerHTML = "";

  mevcutSoru.secenekler.forEach((secenek) => {
    const btn = document.createElement("button");
    btn.textContent = secenek;
    btn.addEventListener("click", () => cevapKontrol(secenek, btn));
    seceneklerDiv.appendChild(btn);
  });

  reklamYenile();
}

// Cevap kontrol fonksiyonu
async function cevapKontrol(secenek, buton) {
  if (cevaplandi) return;
  cevaplandi = true;

  const temizSecenek = secenek.trim().toLowerCase();
  const dogruCevap = mevcutSoru.dogru.trim().toLowerCase();

  if (temizSecenek === dogruCevap) {
    buton.style.backgroundColor = "#4caf50";
    if (kullanici) {
      await puanEkle(10);
    }
  } else {
    buton.style.backgroundColor = "#e53935";
    document.getElementById("dogru-cevap").textContent = `❌ Yanlış! Doğru cevap: ${mevcutSoru.dogru}`;
  }

  document.getElementById("sonrakiBtn").style.display = "block";
}

// Puan ekleme
async function puanEkle(puan) {
  const ref = doc(db, "puanlar", kullanici.uid);
  const snap = await getDoc(ref);
  if (snap.exists()) {
    const mevcutPuan = snap.data().puan || 0;
    await setDoc(ref, {
      puan: mevcutPuan + puan,
      kullaniciAdi: snap.data().kullaniciAdi
    });
    document.getElementById("kullanici-puani").textContent = mevcutPuan + puan;
  }
}

// Reklam yenile
function reklamYenile() {
  const reklam = document.getElementById("reklam-alani");
  reklam.innerHTML = `<p>🎬 Yeni reklam: ${Math.floor(Math.random() * 9999)}</p>`;
}

// Sonraki soru butonu
document.getElementById("sonrakiBtn").addEventListener("click", () => {
  sonrakiSoru();
});
