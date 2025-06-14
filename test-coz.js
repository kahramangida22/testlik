import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import {
  getFirestore,
  doc,
  getDoc,
  updateDoc,
  increment
} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";
import {
  getAuth,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";

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
const auth = getAuth(app);

// Elemanlar
const soruAlani = document.getElementById("soru");
const seceneklerAlani = document.getElementById("secenekler");
const testBasligi = document.getElementById("testBasligi");
const sonucAlani = document.getElementById("sonuc");
const testKapsayici = document.getElementById("testKapsayici");

let sorular = [];
let mevcutSoru = 0;
let puan = 0;
let kullanici = null;

// URL'den test ID'yi al
const params = new URLSearchParams(window.location.search);
const testId = params.get("id");

onAuthStateChanged(auth, (user) => {
  if (user) {
    kullanici = user;
    baslat();
  } else {
    alert("Test çözmek için giriş yapmalısın.");
    window.location.href = "index.html";
  }
});

async function baslat() {
  const docRef = doc(db, "testler", testId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const veri = docSnap.data();
    sorular = shuffleArray(veri.sorular);
    testBasligi.innerText = veri.baslik || "Test";
    gosterSoru();
  } else {
    soruAlani.innerText = "Test bulunamadı.";
  }
}

function gosterSoru() {
  const soru = sorular[mevcutSoru];
  soruAlani.innerText = soru.soru;
  seceneklerAlani.innerHTML = "";

  soru.secenekler.forEach((secenek, index) => {
    const btn = document.createElement("div");
    btn.className = "secenek";
    btn.textContent = secenek;
    btn.addEventListener("click", () => kontrolEt(btn, index));
    seceneklerAlani.appendChild(btn);
  });
}

function kontrolEt(btn, index) {
  const soru = sorular[mevcutSoru];
  const secenekler = document.querySelectorAll(".secenek");

  secenekler.forEach(b => b.style.pointerEvents = "none");

  if (parseInt(index) === parseInt(soru.cevap)) {
    btn.classList.add("dogru");
    puan += 10;
    localStorage.setItem("puan", puan);
    puanYaz(kullanici.uid, 10);
  } else {
    btn.classList.add("yanlis");
    secenekler[soru.cevap].classList.add("dogru");
  }

  setTimeout(() => {
    mevcutSoru++;
    if (mevcutSoru < sorular.length) {
      gosterSoru();
    } else {
      bitirTest();
    }
  }, 1200);
}

async function puanYaz(uid, artiPuan) {
  const kullaniciRef = doc(db, "users", uid);
  await updateDoc(kullaniciRef, {
    puan: increment(artiPuan)
  });
}

function bitirTest() {
  testKapsayici.style.display = "none";
  sonucAlani.style.display = "block";
  sonucAlani.innerHTML = `
    <h2>🎉 Test Bitti!</h2>
    <p>Toplam Puan: <strong>${puan}</strong></p>
    <a href="index.html" class="buton">🏠 Ana Sayfa</a>
    <a href="test.html?kategori=${params.get("kategori")}" class="buton">➕ Aynı Kategoriden Başka Test</a>
  `;
}

function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
}
