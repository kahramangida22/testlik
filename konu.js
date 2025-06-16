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
  serverTimestamp,
  setDoc
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

  await updateDoc(ref, { okunma: increment(1) });

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
    alert("🚨 Konu başarıyla raporlandı.");
  };
}

async function yorumlariYukle() {
  const liste = document.getElementById("yorumListesi");
  liste.innerHTML = "";

  const q = query(collection(db, "konular", konuId, "yorumlar"), orderBy("tarih", "asc"));
  const snap = await getDocs(q);

  snap.forEach((docu) => {
    const y = docu.data();
    const div = document.createElement("div");
    div.className = "yorum-kutu";
    div.innerHTML = `
      <p>${y.yorum}</p>
      <small>${y.kullaniciAdi} • ${y.tarih?.toDate().toLocaleString() || ""}</small>
      <div class="yorum-butonlar">
        <button onclick="begenYorum('${docu.id}')">❤️ ${y.begeniler || 0}</button>
        <button onclick="dislikeYorum('${docu.id}')">👎 ${y.dislikelar || 0}</button>
        <button onclick="raporlaYorum('${docu.id}')">🚨</button>
        <button onclick="cevaplaYorum('${docu.id}', '${y.kullaniciAdi}')">💬 Cevapla</button>
      </div>
      <div class="yorum-cevap" id="cevap-${docu.id}"></div>
    `;
    liste.appendChild(div);
    // Cevaplar varsa yükle
    if (y.cevaplar && y.cevaplar.length > 0) {
      y.cevaplar.forEach((cevap) => {
        const cevapDiv = document.createElement("div");
        cevapDiv.className = "yorum-kutu yorum-cevap";
        cevapDiv.innerHTML = `
          <p>${cevap.yorum}</p>
          <small>${cevap.kullaniciAdi} • ${new Date(cevap.tarih).toLocaleString()}</small>
        `;
        document.getElementById("cevap-" + docu.id).appendChild(cevapDiv);
      });
    }
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
    tarih: serverTimestamp(),
    begeniler: 0,
    dislikelar: 0,
    cevaplar: []
  });

  await updateDoc(doc(db, "konular", konuId), {
    yorumSayisi: increment(1)
  });

  document.getElementById("yorumInput").value = "";
  yorumlariYukle();
});

window.begenYorum = async (yorumId) => {
  const ref = doc(db, "konular", konuId, "yorumlar", yorumId);
  await updateDoc(ref, { begeniler: increment(1) });
  yorumlariYukle();
};

window.dislikeYorum = async (yorumId) => {
  const ref = doc(db, "konular", konuId, "yorumlar", yorumId);
  await updateDoc(ref, { dislikelar: increment(1) });
  yorumlariYukle();
};

window.raporlaYorum = async (yorumId) => {
  await addDoc(collection(db, "raporlar"), {
    konuId,
    yorumId,
    uid: currentUser.uid,
    tur: "yorum",
    tarih: serverTimestamp()
  });
  alert("🚨 Yorum raporlandı.");
};

window.cevaplaYorum = (yorumId, kullaniciAdi) => {
  const div = document.getElementById("cevap-" + yorumId);
  div.innerHTML += `
    <textarea class="cevap-input" placeholder="@${kullaniciAdi} yanıtla..." id="cevap-input-${yorumId}"></textarea>
    <button onclick="cevapGonder('${yorumId}')">Gönder</button>
  `;
};

window.cevapGonder = async (yorumId) => {
  const input = document.getElementById("cevap-input-" + yorumId);
  const yorum = input.value.trim();
  if (yorum.length < 2) return;

  const yorumRef = doc(db, "konular", konuId, "yorumlar", yorumId);
  const snap = await getDoc(yorumRef);
  const y = snap.data();

  const yeniCevap = {
    yorum,
    kullaniciAdi: currentUser.email.split("@")[0],
    tarih: new Date().toISOString()
  };

  const guncel = [...(y.cevaplar || []), yeniCevap];
  await updateDoc(yorumRef, { cevaplar: guncel });

  yorumlariYukle();
};
