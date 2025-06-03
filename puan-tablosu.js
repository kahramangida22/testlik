import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDcneigub2eAJjTrfrkiETuLgy5ule8L6s",
  authDomain: "testlik.firebaseapp.com",
  projectId: "testlik",
  storageBucket: "testlik.firebasestorage.app",
  messagingSenderId: "668524500496",
  appId: "1:668524500496:web:579bb4fc5990c87afedc95"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const tbody = document.getElementById("puanlar");
const kendiPuan = document.getElementById("kendi-puan");

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    kendiPuan.innerHTML = "Puanları görmek için giriş yapmalısın.";
    return;
  }

  const querySnapshot = await getDocs(collection(db, "puanlar"));
  let puanlar = [];
  querySnapshot.forEach(doc => {
    puanlar.push({
      id: doc.id,
      ...doc.data()
    });
  });

  puanlar.sort((a, b) => b.puan - a.puan);

  let siralama = 1;
  puanlar.forEach(kisi => {
    const tr = document.createElement("tr");
    if (kisi.id === user.uid) {
      kendiPuan.innerHTML = `👤 Senin Puanın: <strong>${kisi.ad}</strong> - ${kisi.puan} puan`;
      tr.classList.add("highlight");
    }
    tr.innerHTML = `
      <td>${siralama}</td>
      <td>${kisi.ad}</td>
      <td>${kisi.puan}</td>
    `;
    tbody.appendChild(tr);
    siralama++;
  });
});
