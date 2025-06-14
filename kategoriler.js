import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import {
  getFirestore, collection, getDocs, query
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

async function kategorileriYukle() {
  const q = query(collection(db, "testler"));
  const querySnapshot = await getDocs(q);

  const kategoriSet = new Set();
  querySnapshot.forEach(doc => {
    const data = doc.data();
    if (data.kategori) kategoriSet.add(data.kategori);
  });

  const container = document.getElementById("kategoriListesi");
  container.innerHTML = "";

  kategoriSet.forEach(kategori => {
    const div = document.createElement("div");
    div.className = "kategori-kutu";
    div.innerHTML = `<h3>${kategori}</h3>`;
    div.onclick = () => {
      window.location.href = `test.html?kategori=${kategori}`;
    };
    container.appendChild(div);
  });
}

kategorileriYukle();
