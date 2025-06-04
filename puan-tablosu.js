import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import {
  getFirestore, collection, getDocs
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import {
  getAuth, onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

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
const auth = getAuth(app);

const liste = document.getElementById("puan-listesi");
const kendiAlani = document.getElementById("ben");
const kendiBolumu = document.getElementById("kendi-puanim");

let kendiUID = null;

onAuthStateChanged(auth, async (user) => {
  if (user) {
    kendiUID = user.uid;
  }

  const querySnapshot = await getDocs(collection(db, "puanlar"));
  const puanlar = [];

  querySnapshot.forEach((doc) => {
    const data = doc.data();
    puanlar.push({
      id: doc.id,
      kullaniciAdi: data.kullaniciAdi || "Anonim",
      puan: data.puan || 0
    });
  });

  // En yüksekten sırala
  puanlar.sort((a, b) => b.puan - a.puan);

  // Listele
  puanlar.forEach((item, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${index + 1}</td>
      <td>${item.kullaniciAdi}</td>
      <td>${item.puan}</td>
    `;
    liste.appendChild(tr);

    // Eğer bu kullanıcıysan, üstte göster
    if (item.id === kendiUID) {
      kendiBolumu.style.display = "block";
      kendiAlani.innerHTML = `
        <p><strong>${item.kullaniciAdi}</strong> - <strong>${item.puan} puan</strong></p>
      `;
    }
  });
});
