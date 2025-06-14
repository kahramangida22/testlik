import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import {
  getFirestore, doc, getDoc, updateDoc
} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";
import {
  getAuth, onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";

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
const auth = getAuth();

const params = new URLSearchParams(window.location.search);
const testId = params.get("id");

const baslikEl = document.getElementById("testBaslik");
const soruMetni = document.getElementById("soruMetni");
const seceneklerEl = document.getElementById("secenekler");
const testSonu = document.getElementById("testSonu");
const kategoriLink = document.getElementById("ayniKategoriLink");

let sorular = [], soruIndex = 0, cevaplandi = false, kategori = "";

onAuthStateChanged(auth, user => {
  if (user) {
    baslatTest();
  } else {
    alert("Test çözmek için giriş yapmalısınız.");
    window.location.href = "index.html";
  }
});

async function baslatTest() {
  const ref = doc(db, "testler", testId);
  const docSnap = await getDoc(ref);
  if (docSnap.exists()) {
    const veri = docSnap.data();
    baslikEl.textContent = veri.baslik;
    sorular = veri.sorular;
    kategori = veri.kategori;
    kategoriLink.href = `test.html?kategori=${kategori}`;
    soruIndex = 0;
    gosterSoru();
  } else {
    baslikEl.textContent = "Test bulunamadı.";
  }
}

function gosterSoru() {
  if (soruIndex >= sorular.length) {
    soruMetni.style.display = "none";
    seceneklerEl.style.display = "none";
    testSonu.style.display = "block";
    return;
  }
  cevaplandi = false;
  const soru = sorular[soruIndex];
  soruMetni.textContent = soru.soru;
  seceneklerEl.innerHTML = "";

  soru.secenekler.forEach(secenek => {
    const btn = document.createElement("div");
    btn.className = "secenek";
    btn.textContent = secenek;
    btn.onclick = () => cevapla(btn, secenek, soru.cevap);
    seceneklerEl.appendChild(btn);
  });
}

function cevapla(btn, secilen, dogru) {
  if (cevaplandi) return;
  cevaplandi = true;

  const secenekler = document.querySelectorAll(".secenek");
  secenekler.forEach(s => {
    if (s.textContent === dogru) s.classList.add("dogru");
    else if (s.textContent === secilen) s.classList.add("yanlis");
    s.style.pointerEvents = "none";
  });

  if (secilen === dogru) puanEkle(10);

  setTimeout(() => {
    soruIndex++;
    gosterSoru();
  }, 1000);
}

function puanEkle(puan) {
  const user = auth.currentUser;
  if (!user) return;
  const ref = doc(db, "kullanicilar", user.uid);
  updateDoc(ref, {
    puan: firebase.firestore.FieldValue.increment(puan)
  }).catch(() => {});
}
