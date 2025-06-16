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
  orderBy
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

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "giris.html";
    return;
  }

  const userRef = doc(db, "kullanicilar", user.uid);
  let userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    await setDoc(userRef, {
      kullaniciAdi: user.email.split("@")[0],
      uid: user.uid,
      puan: 0,
      cinsiyet: ""
    });
    userSnap = await getDoc(userRef);
  }

  const userData = userSnap.data();

  // Kullanıcı engelliyse
  if (userData.engelTarihi) {
    const engelTarih = new Date(userData.engelTarihi);
    if (engelTarih > new Date()) {
      alert("Hesabınız geçici olarak kısıtlandı. Lütfen daha sonra tekrar deneyin.");
      window.location.href = "index.html";
      return;
    }
  }

  if (!userData.cinsiyet) {
    document.getElementById("cinsiyetModal").style.display = "flex";
    window.userRef = userRef;
    return;
  }

  if (userData.cinsiyet !== "kadın") {
    alert("❌ Kızlar Kulübü sadece kadın kullanıcılarımıza özeldir. Anlayışınız için teşekkür ederiz.");
    setTimeout(() => {
      window.location.href = "index.html";
    }, 3000);
    return;
  }

  document.getElementById("icerik").style.display = "block";
  konulariYukle();
});

// Cinsiyet seçimi
window.cinsiyetSec = async (secim) => {
  if (!window.userRef) return;
  if (secim === "kadın") {
    await updateDoc(window.userRef, { cinsiyet: "kadın" });
    location.reload();
  } else {
    alert("❌ Kızlar Kulübü sadece kadın kullanıcılarımıza özeldir. Anlayışınız için teşekkür ederiz.");
    setTimeout(() => window.location.href = "index.html", 3000);
  }
};

// Konulari Yükle (filtreli)
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

// Filtre seçilince tetiklenir
document.getElementById("filtreSelect").addEventListener("change", konulariYukle);

// Yeni Konu Ekle Modal
document.getElementById("yeniKonuBtn")?.addEventListener("click", () => {
  document.getElementById("yeniKonuModal").style.display = "flex";
});
window.modalKapat = () => {
  document.getElementById("yeniKonuModal").style.display = "none";
};

// Yeni Konu Gönder
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

  const userRef = doc(db, "kullanicilar", uid);
  await updateDoc(userRef, {
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
