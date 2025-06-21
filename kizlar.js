// kizlar.js (güncellenmiş)
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import {
  getFirestore,
  doc,
  getDoc,
  updateDoc,
  addDoc,
  collection,
  serverTimestamp,
  increment,
  getDocs,
  query,
  orderBy,
  setDoc
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
  appId: "1:668524500496:web:579bb4fc5990c87afedc95"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

onAuthStateChanged(auth, async (user) => {
  if (!user) return window.location.href = "giris.html";

  const userRef = doc(db, "kullanicilar", user.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) return;

  const userData = userSnap.data();
  const cinsiyet = userData.cinsiyet?.toLowerCase();

  if (cinsiyet !== "kadın" && cinsiyet !== "diğer") {
    document.getElementById("engelEkrani").style.display = "flex";
    return;
  }

  document.getElementById("icerik").style.display = "block";
  konulariYukle();
});

async function konulariYukle() {
  const liste = document.getElementById("konuListesi");
  liste.innerHTML = "";

  const filtre = document.getElementById("filtreSelect").value;
  let siralama = "tarih";
  if (filtre === "populer") siralama = "yorumSayisi";
  if (filtre === "begeni") siralama = "begeniler";

  const q = query(collection(db, "konular"), orderBy(siralama, "desc"));
  const snapshot = await getDocs(q);

  snapshot.forEach((docu) => {
    const veri = docu.data();
    const div = document.createElement("div");
    div.className = "konu-kutu";
    div.onclick = () => window.location.href = `konu.html?id=${docu.id}`;
    div.innerHTML = `
      <h3>${veri.baslik}</h3>
      <p>${veri.aciklama}</p>
      <small>${veri.kullaniciAdi} • ${veri.tarih?.toDate().toLocaleString() || ''}</small>
      <div>
        ❤️ ${veri.begeniler || 0}
        👎 ${veri.dislikelar || 0}
        💬 ${veri.yorumSayisi || 0}
        👁️ ${veri.okunma || 0}
      </div>
      <button class="rapor-btn" onclick="event.stopPropagation(); raporlaKonu('${docu.id}')">🚨 Raporla</button>
    `;
    liste.appendChild(div);
  });
}

document.getElementById("filtreSelect").addEventListener("change", konulariYukle);
document.getElementById("yeniKonuBtn")?.addEventListener("click", () => {
  document.getElementById("yeniKonuModal").style.display = "flex";
});

window.modalKapat = () => {
  document.getElementById("yeniKonuModal").style.display = "none";
};

document.getElementById("konuGonderBtn")?.addEventListener("click", async () => {
  const baslik = document.getElementById("konuBaslik").value.trim();
  const aciklama = document.getElementById("konuAciklama").value.trim();
  if (baslik.length < 5 || aciklama.length < 10) {
    alert("Başlık en az 5, açıklama en az 10 karakter olmalı.");
    return;
  }

  const user = auth.currentUser;
  const uid = user.uid;
  const kullaniciAdi = user.email.split("@")[0];

  await addDoc(collection(db, "konular"), {
    baslik,
    aciklama,
    kullaniciAdi,
    uid,
    tarih: serverTimestamp(),
    begeniler: 0,
    dislikelar: 0,
    begenenler: [],
    dislikelayanlar: [],
    okunma: 0,
    yorumSayisi: 0
  });

  await updateDoc(doc(db, "kullanicilar", uid), {
    puan: increment(1000)
  });

  alert("Konu açıldı! +1000 puan kazandınız 🎉");
  modalKapat();
  konulariYukle();
});

window.raporlaKonu = async (konuId) => {
  const user = auth.currentUser;
  if (!user) return alert("Giriş yapmalısın!");

  await addDoc(collection(db, "raporlar"), {
    konuId,
    uid: user.uid,
    tur: "konu",
    tarih: serverTimestamp()
  });

  alert("🚨 Konu başarıyla raporlandı.");
};
