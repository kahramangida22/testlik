import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import {
  getFirestore,
  doc,
  getDoc,
  updateDoc,
  increment,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

import {
  getAuth,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";

// Firebase config
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
const auth = getAuth(app);

// Konu ID'yi al
const params = new URLSearchParams(window.location.search);
const konuId = params.get("id");
let currentUser;

onAuthStateChanged(auth, async (user) => {
  if (!user) return (window.location.href = "giris.html");
  currentUser = user;
  konuYukle();
  yorumlariYukle();
});

async function konuYukle() {
  const ref = doc(db, "konular", konuId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return;

  const veri = snap.data();
  document.getElementById("konuBaslik").innerText = veri.baslik;
  document.getElementById("konuAciklama").innerText = veri.aciklama;
  document.getElementById("konuYazar").innerText = veri.kullaniciAdi;
  document.getElementById("konuTarih").innerText = veri.tarih?.toDate().toLocaleString() || "";
  document.getElementById("konuOkunma").innerText = (veri.okunma || 0) + 1;

  // Okunma sayısını 1 artır
  await updateDoc(ref, { okunma: increment(1) });

  // Beğeniler
  document.getElementById("begenBtn").onclick = async () => {
    await updateDoc(ref, { begeniler: increment(1) });
    alert("❤️ Beğendin!");
  };

  document.getElementById("dislikeBtn").onclick = async () => {
    await updateDoc(ref, { dislikelar: increment(1) });
    alert("👎 Beğenmedin!");
  };

  document.getElementById("raporlaBtn").onclick = async () => {
    await addDoc(collection(db, "raporlar"), {
      konuId: konuId,
      uid: currentUser.uid,
      tur: "konu",
      tarih: serverTimestamp()
    });
    alert("🚨 Rapor gönderildi!");
  };
}

async function yorumlariYukle() {
  const liste = document.getElementById("yorumListesi");
  liste.innerHTML = "";

  const q = query(
    collection(db, "konular", konuId, "yorumlar"),
    orderBy("tarih", "asc")
  );
  const snap = await getDocs(q);

  snap.forEach((docu) => {
    const y = docu.data();
    const div = document.createElement("div");
    div.className = "yorum-kutu";
    div.innerHTML = `
      <p>${y.yorum}</p>
      <small>${y.kullaniciAdi} • ${y.tarih?.toDate().toLocaleString() || ""}</small>
    `;
    liste.appendChild(div);
  });
}

document.getElementById("yorumGonderBtn").addEventListener("click", async () => {
  const yorum = document.getElementById("yorumInput").value.trim();
  if (yorum.length < 3) return alert("Yorum çok kısa!");

  const yorumRef = collection(db, "konular", konuId, "yorumlar");
  await addDoc(yorumRef, {
    yorum,
    uid: currentUser.uid,
    kullaniciAdi: currentUser.email.split("@")[0],
    tarih: serverTimestamp()
  });

  await updateDoc(doc(db, "konular", konuId), {
    yorumSayisi: increment(1)
  });

  document.getElementById("yorumInput").value = "";
  yorumlariYukle();
});
