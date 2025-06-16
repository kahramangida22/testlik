// kizlar.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import {
  getFirestore, doc, getDoc, updateDoc, addDoc, increment,
  collection, query, orderBy, getDocs, serverTimestamp
} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";
import {
  getAuth, onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";

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
let aktifKonuId = null;

onAuthStateChanged(auth, async (user) => {
  if (!user) return (window.location.href = "giris.html");
  const userRef = doc(db, "kullanicilar", user.uid);
  const userSnap = await getDoc(userRef);
  if (!userSnap.exists()) return (window.location.href = "giris.html");
  const userData = userSnap.data();
  if (!userData.cinsiyet) {
    document.getElementById("cinsiyetModal").style.display = "flex";
    window.userRef = userRef;
    return;
  }
  if (userData.cinsiyet !== "kadın") {
    alert("❌ Kızlar Kulübü sadece kadın kullanıcılarımıza özeldir. Anlayışınız için teşekkür ederiz.");
    return setTimeout(() => (window.location.href = "index.html"), 3000);
  }
  document.getElementById("icerik").style.display = "block";
  konulariYukle();
});

window.cinsiyetSec = async function (secim) {
  if (!window.userRef) return;
  if (secim === "kadın") {
    await updateDoc(window.userRef, { cinsiyet: "kadın" });
    location.reload();
  } else {
    alert("❌ Kızlar Kulübü sadece kadın kullanıcılarımıza özeldir. Anlayışınız için teşekkür ederiz.");
    setTimeout(() => (window.location.href = "index.html"), 3000);
  }
};

async function konulariYukle() {
  const liste = document.getElementById("konuListesi");
  liste.innerHTML = "";
  const filtre = document.getElementById("filtreSelect").value;
  const q = query(collection(db, "konular"), orderBy(filtre === "populer" ? "begeniler" : "tarih", "desc"));
  const snapshot = await getDocs(q);

  snapshot.forEach((docu) => {
    const veri = docu.data();
    const div = document.createElement("div");
    div.className = "konu-kutu";
    div.innerHTML = `
      <h3>${veri.baslik}</h3>
      <p>${veri.aciklama}</p>
      <small>${veri.kullaniciAdi} • ${veri.tarih?.toDate().toLocaleString() || ''}</small>
      <div>
        ❤️ ${veri.begeniler || 0}
        <button onclick="konuBegeni('${docu.id}', true)">Beğen</button>
        <button onclick="konuBegeni('${docu.id}', false)">Dislike</button>
      </div>
    `;
    div.onclick = () => yorumlariYukle(docu.id);
    liste.appendChild(div);
  });
}

document.getElementById("filtreSelect").addEventListener("change", konulariYukle);

const yeniKonuBtn = document.getElementById("yeniKonuBtn");
yeniKonuBtn.onclick = () => document.getElementById("yeniKonuModal").style.display = "flex";
window.modalKapat = () => (document.getElementById("yeniKonuModal").style.display = "none");

document.getElementById("konuGonderBtn").addEventListener("click", async () => {
  const baslik = document.getElementById("konuBaslik").value.trim();
  const aciklama = document.getElementById("konuAciklama").value.trim();
  if (baslik.length < 5 || aciklama.length < 10) return alert("Başlık en az 5, açıklama en az 10 karakter olmalı.");
  const user = auth.currentUser;
  await addDoc(collection(db, "konular"), {
    baslik,
    aciklama,
    kullaniciAdi: user.email.split("@")[0],
    uid: user.uid,
    tarih: serverTimestamp(),
    begeniler: 0,
    dislikelar: 0,
    begenenler: [],
    dislikelayanlar: []
  });
  await updateDoc(doc(db, "kullanicilar", user.uid), { puan: increment(1000) });
  alert("Konu açıldı! +1000 puan kazandınız 🎉");
  modalKapat();
  konulariYukle();
});

async function yorumlariYukle(konuId) {
  aktifKonuId = konuId;
  const yorumListesi = document.getElementById("yorumListesi");
  yorumListesi.innerHTML = "";
  const q = query(collection(db, `konular/${konuId}/yorumlar`), orderBy("tarih", "desc"));
  const snapshot = await getDocs(q);
  snapshot.forEach((docu) => {
    const veri = docu.data();
    const div = document.createElement("div");
    div.className = "yorum-kutu";
    div.innerHTML = `
      <p>${veri.yorum}</p>
      <small>${veri.kullaniciAdi} • ${veri.tarih?.toDate().toLocaleString() || ''}</small>
      <div>
        ❤️ ${veri.begeniler || 0}
        <button onclick="yorumBegeni('${konuId}', '${docu.id}', true)">Beğen</button>
        <button onclick="yorumBegeni('${konuId}', '${docu.id}', false)">Dislike</button>
      </div>
    `;
    yorumListesi.appendChild(div);
  });
}

document.getElementById("yorumGonderBtn").addEventListener("click", async () => {
  const yorum = document.getElementById("yorumInput").value.trim();
  if (yorum.length < 10 || yorum.length > 500) return alert("Yorum 10-500 karakter olmalı.");
  const now = Date.now();
  const last = localStorage.getItem("sonYorum") || 0;
  if (now - last < 30000) return alert("Lütfen 30 saniye bekleyin.");
  const user = auth.currentUser;
  await addDoc(collection(db, `konular/${aktifKonuId}/yorumlar`), {
    yorum,
    uid: user.uid,
    kullaniciAdi: user.email.split("@")[0],
    tarih: serverTimestamp(),
    begeniler: 0,
    dislikelar: 0,
    begenenler: [],
    dislikelayanlar: []
  });
  await updateDoc(doc(db, "kullanicilar", user.uid), { puan: increment(100) });
  localStorage.setItem("sonYorum", now);
  document.getElementById("yorumInput").value = "";
  yorumlariYukle(aktifKonuId);
});

window.konuBegeni = async (konuId, begeni) => {
  const user = auth.currentUser;
  const ref = doc(db, "konular", konuId);
  const snap = await getDoc(ref);
  const data = snap.data();
  const list = begeni ? data.begenenler || [] : data.dislikelayanlar || [];
  if (list.includes(user.uid)) return alert("Zaten oy verdiniz.");
  await updateDoc(ref, {
    [begeni ? "begeniler" : "dislikelar"]: increment(1),
    [begeni ? "begenenler" : "dislikelayanlar"]: [...list, user.uid]
  });
  konulariYukle();
};

window.yorumBegeni = async (konuId, yorumId, begeni) => {
  const user = auth.currentUser;
  const ref = doc(db, `konular/${konuId}/yorumlar/${yorumId}`);
  const snap = await getDoc(ref);
  const data = snap.data();
  const list = begeni ? data.begenenler || [] : data.dislikelayanlar || [];
  if (list.includes(user.uid)) return alert("Zaten oy verdiniz.");
  await updateDoc(ref, {
    [begeni ? "begeniler" : "dislikelar"]: increment(1),
    [begeni ? "begenenler" : "dislikelayanlar"]: [...list, user.uid]
  });
  yorumlariYukle(konuId);
};
