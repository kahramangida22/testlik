import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";
import {
  getAuth,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

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
const auth = getAuth(app);

let currentUserId = null;

onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUserId = user.uid;
  }
  getPuanTablosu();
});

async function getPuanTablosu() {
  const usersRef = collection(db, "kullanicilar");
  const snapshot = await getDocs(usersRef);

  let users = [];
  snapshot.forEach(doc => {
    const data = doc.data();
    users.push({
      id: doc.id,
      kullaniciAdi: data.kullaniciAdi || "Bilinmeyen",
      puan: data.puan || 0
    });
  });

  users.sort((a, b) => b.puan - a.puan);

  const tbody = document.getElementById("puanlar-body");
  tbody.innerHTML = "";

  users.forEach((user, index) => {
    const tr = document.createElement("tr");
    if (user.id === currentUserId) {
      tr.classList.add("highlight");
    }

    tr.innerHTML = `
      <td>${index + 1}</td>
      <td>${user.kullaniciAdi}</td>
      <td>${user.puan}</td>
    `;
    tbody.appendChild(tr);
  });
}
