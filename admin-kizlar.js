// admin-kizlar.js (GÜNCELLENDİ: RAPORLARI GÖRÜNTÜLEME + ENGELLEME)
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
  deleteDoc,
  updateDoc,
  doc
} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDcneigub2eAJjTrfrkiETuLgy5ule8L6s",
  authDomain: "testlik.firebaseapp.com",
  projectId: "testlik",
  storageBucket: "testlik.appspot.com",
  messagingSenderId: "668524500496",
  appId: "1:668524500496:web:579bb4fc5990c87afedc95"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const raporDiv = document.createElement("section");
raporDiv.innerHTML = `<h2>🚨 Raporlanan Konular</h2><div id="raporlar"></div>`;
document.body.appendChild(raporDiv);

async function raporlariYukle() {
  const raporlarAlani = document.getElementById("raporlar");
  raporlarAlani.innerHTML = "Yükleniyor...";
  const snap = await getDocs(collection(db, "raporlar"));
  raporlarAlani.innerHTML = "";

  snap.forEach(async (raporDoc) => {
    const rapor = raporDoc.data();
    if (rapor.tur === "konu") {
      const konuRef = doc(db, "konular", rapor.konuId);
      const konuSnap = await getDocs(collection(db, "konular"));
      const konu = konuSnap.docs.find(k => k.id === rapor.konuId)?.data();
      if (!konu) return;

      const div = document.createElement("div");
      div.className = "rapor-kutu";
      div.innerHTML = `
        <p><strong>${konu.baslik}</strong></p>
        <p>${konu.aciklama}</p>
        <button onclick="silKonu('${rapor.konuId}', '${raporDoc.id}')">Kaldır</button>
        <button onclick="engelKoy('${rapor.uid}')">Kullanıcıyı 7 Gün Engelle</button>
      `;
      raporlarAlani.appendChild(div);
    }
  });
}

window.silKonu = async (konuId, raporId) => {
  await deleteDoc(doc(db, "konular", konuId));
  await deleteDoc(doc(db, "raporlar", raporId));
  alert("Konu ve rapor silindi.");
  raporlariYukle();
};

window.engelKoy = async (uid) => {
  const engelTarihi = new Date();
  engelTarihi.setDate(engelTarihi.getDate() + 7);
  await updateDoc(doc(db, "kullanicilar", uid), {
    engelTarihi: engelTarihi.toISOString()
  });
  alert("Kullanıcı 7 gün boyunca engellendi.");
};

raporlariYukle();
