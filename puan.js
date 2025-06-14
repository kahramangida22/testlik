import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import {
  getFirestore, collection, query, orderBy, getDocs
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

async function puanTablosunuYukle() {
  const q = query(collection(db, "kullanicilar"), orderBy("puan", "desc"));
  const snapshot = await getDocs(q);
  const tbody = document.getElementById("puanTablosu");
  tbody.innerHTML = "";

  let sira = 1;
  snapshot.forEach(doc => {
    const veri = doc.data();
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${sira}</td>
      <td>${veri.kullaniciAdi || "Anonim"}</td>
      <td>${veri.puan || 0}</td>
    `;
    tbody.appendChild(tr);
    sira++;
  });
}

puanTablosunuYukle();
