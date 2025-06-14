import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

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

// Tabloya yaz
const tabloBody = document.querySelector("#puanTablosuBody");

async function puanlariGetir() {
  const q = query(collection(db, "users"), orderBy("puan", "desc"));
  const querySnapshot = await getDocs(q);

  let sira = 1;
  querySnapshot.forEach((docSnap) => {
    const veri = docSnap.data();
    const tr = document.createElement("tr");

    const tdSira = document.createElement("td");
    tdSira.textContent = sira++;

    const tdIsim = document.createElement("td");
    tdIsim.textContent = veri.displayName || "İsimsiz";

    const tdPuan = document.createElement("td");
    tdPuan.textContent = veri.puan || 0;

    tr.appendChild(tdSira);
    tr.appendChild(tdIsim);
    tr.appendChild(tdPuan);

    tabloBody.appendChild(tr);
  });
}

puanlariGetir();
