import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import {
  getFirestore, collection, getDocs
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

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

let tumSorular = [];
let kullanilanIndexler = [];
let puan = 0;

async function sorulariGetir() {
  const querySnapshot = await getDocs(collection(db, "futbol"));
  querySnapshot.forEach((doc) => {
    tumSorular.push(doc.data());
  });
  sonrakiSoru();
}

function sonrakiSoru() {
  if (kullanilanIndexler.length === tumSorular.length) {
    document.getElementById("soru-alani").style.display = "none";
    document.getElementById("test-bitti").style.display = "block";
    return;
  }

  document.getElementById("dogru-cevap").innerHTML = "";
  document.getElementById("sonrakiBtn").style.display = "none";

  let index;
  do {
    index = Math.floor(Math.random() * tumSorular.length);
  } while (kullanilanIndexler.includes(index));

  kullanilanIndexler.push(index);
  const soru = tumSorular[index];

  document.getElementById("soru").textContent = soru.soru;
  const seceneklerDiv = document.getElementById("secenekler");
  seceneklerDiv.innerHTML = "";

  soru.secenekler.forEach(secenek => {
    const btn = document.createElement("button");
    btn.textContent = secenek;
    btn.classList.add("btn");
    btn.onclick = () => cevapKontrol(secenek, soru.cevap);
    seceneklerDiv.appendChild(btn);
  });

  document.getElementById("reklam-alani").innerHTML = `<p>⚽ Yeni reklam - ${new Date().toLocaleTimeString()}</p>`;
}

function cevapKontrol(secilen, dogru) {
  if (secilen === dogru) {
    puan += 10;
    document.getElementById("puan").textContent = puan;
    document.getElementById("dogru-cevap").innerHTML = `✅ Bravo! Doğru cevap: <b>${dogru}</b>`;
    document.getElementById("dogru-cevap").style.color = "green";
  } else {
    document.getElementById("dogru-cevap").innerHTML = `❌ Yanlış! Doğru cevap: <b>${dogru}</b>`;
    document.getElementById("dogru-cevap").style.color = "red";
  }

  document.getElementById("sonrakiBtn").style.display = "inline-block";
}

document.getElementById("sonrakiBtn").addEventListener("click", sonrakiSoru);

sorulariGetir();
