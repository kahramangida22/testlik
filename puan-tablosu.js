import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";
import {
  getAuth,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";

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

const tabloBody = document.querySelector("#puanTablosuBody");
const benimPuanKutu = document.querySelector("#benimPuan");

onAuthStateChanged(auth, async (user) => {
  const q = query(collection(db, "users"), orderBy("puan", "desc"));
  const querySnapshot = await getDocs(q);

  let sira = 1;
  let benimVeri = null;

  querySnapshot.forEach((docSnap) => {
    const veri = docSnap.data();
    const uid = docSnap.id;

    const tr = document.createElement("tr");

    const tdSira = document.createElement("td");
    tdSira.textContent = sira;

    const tdIsim = document.createElement("td");
    tdIsim.textContent = veri.displayName || "İsimsiz";

    const tdPuan = document.createElement("td");
    tdPuan.textContent = veri.puan || 0;

    tr.appendChild(tdSira);
    tr.appendChild(tdIsim);
    tr.appendChild(tdPuan);
    tabloBody.appendChild(tr);

    // Eğer giriş yapan kullanıcıysa, üst kutuya yazmak için sakla
    if (user && uid === user.uid) {
      benimVeri = {
        sira,
        isim: veri.displayName || "İsimsiz",
        puan: veri.puan || 0
      };
    }

    sira++;
  });

  if (benimVeri) {
    benimPuanKutu.innerHTML = `
      <div class="benim-kart">
        <h3>🎯 Senin Sıran</h3>
        <p><strong>#${benimVeri.sira}</strong> - ${benimVeri.isim}</p>
        <p>⭐ Puan: <strong>${benimVeri.puan}</strong></p>
      </div>
    `;
  } else {
    benimPuanKutu.innerHTML = `<p>Giriş yapmadığınız için sıralamanız görünmüyor.</p>`;
  }
});
