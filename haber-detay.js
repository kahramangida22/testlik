import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import {
  getFirestore, doc, getDoc, updateDoc, increment
} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

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

const params = new URLSearchParams(window.location.search);
const id = params.get("id");

const baslikEl = document.getElementById("haberBaslik");
const icerikEl = document.getElementById("haberIcerik");

async function haberYukle() {
  const ref = doc(db, "haberler", id);
  const snap = await getDoc(ref);
  if (snap.exists()) {
    const veri = snap.data();
    baslikEl.textContent = veri.baslik;
    icerikEl.textContent = veri.icerik;
    updateDoc(ref, { tiklanmaSayisi: increment(1) });
  } else {
    baslikEl.textContent = "Haber bulunamadı";
    icerikEl.textContent = "Bu haber sistemde kayıtlı değil.";
  }
}

haberYukle();
