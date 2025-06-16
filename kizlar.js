// kizlar.js (GÜNCELLENDİ + RAPOR SİSTEMİ EKLENDİ)
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import {
  getFirestore, doc, getDoc, setDoc, updateDoc, collection,
  query, orderBy, getDocs, increment, getCountFromServer, addDoc, serverTimestamp
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

onAuthStateChanged(auth, async (user) => {
  if (!user) return (window.location.href = "giris.html");

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

  if (!userData.cinsiyet) {
    document.getElementById("cinsiyetModal").style.display = "flex";
    window.userRef = userRef;
    return;
  }

  if (userData.engelTarihi && new Date() < new Date(userData.engelTarihi)) {
    alert("Hesabınız geçici olarak kısıtlandı. Lütfen daha sonra tekrar deneyin.");
    return setTimeout(() => (window.location.href = "index.html"), 5000);
  }

  if (userData.cinsiyet !== "kadın") {
    alert("❌ Kızlar Kulübü sadece kadın kullanıcılarımıza özeldir. Anlayışınız için teşekkür ederiz.");
    return setTimeout(() => (window.location.href = "index.html"), 3000);
  }

  document.getElementById("icerik").style.display = "block";
  konulariYukle();
});

const konulariYukle = async () => {
  const liste = document.getElementById("konuListesi");
  liste.innerHTML = "";
  const filtre = document.getElementById("filtreSelect").value;
  const q = query(collection(db, "konular"), orderBy(filtre === "populer" ? "begeniler" : "tarih", "desc"));
  const snapshot = await getDocs(q);

  for (const docu of snapshot.docs) {
    const veri = docu.data();
    const yorumRef = collection(db, `konular/${docu.id}/yorumlar`);
    const yorumSnap = await getCountFromServer(yorumRef);
    const yorumSayisi = yorumSnap.data().count;

    const konularDocRef = doc(db, "konular", docu.id);
    await updateDoc(konularDocRef, { okunma: increment(1) });
    const updatedDoc = await getDoc(konularDocRef);
    const okunma = updatedDoc.data().okunma || 1;

    const div = document.createElement("div");
    div.className = "konu-kutu";
    div.innerHTML = `
      <h3>${veri.baslik}</h3>
      <p>${veri.aciklama}</p>
      <small>${veri.kullaniciAdi} • ${veri.tarih?.toDate().toLocaleString() || ''}</small>
      <div>
        ❤️ ${veri.begeniler || 0} • 💬 ${yorumSayisi} yorum • 👁️ ${okunma} okunma<br>
        <button onclick="konuBegeni('${docu.id}', true)">Beğen</button>
        <button onclick="konuBegeni('${docu.id}', false)">Dislike</button>
        <button onclick="location.href='konu.html?id=${docu.id}'">Detay</button>
        <button onclick="konuRaporla('${docu.id}')">🚨 Raporla</button>
      </div>
    `;
    liste.appendChild(div);
  }
};

window.konuBegeni = async function (konuId, begeniMi) {
  const konuRef = doc(db, "konular", konuId);
  const snap = await getDoc(konuRef);
  if (!snap.exists()) return;
  const data = snap.data();
  const begenenler = data.begenenler || [];
  const dislikelayanlar = data.dislikelayanlar || [];
  const currentUserId = auth.currentUser?.uid;

  if (begenenler.includes(currentUserId) || dislikelayanlar.includes(currentUserId)) {
    alert("Bu konuya zaten oy verdiniz.");
    return;
  }

  const updates = {
    [begeniMi ? "begeniler" : "dislikelar"]: increment(1),
    [begeniMi ? "begenenler" : "dislikelayanlar"]: [...(begeniMi ? begenenler : dislikelayanlar), currentUserId]
  };

  await updateDoc(konuRef, updates);
  konulariYukle();
};

window.konuRaporla = async function (konuId) {
  const currentUser = auth.currentUser;
  if (!currentUser) return alert("Giriş yapmalısın.");

  await addDoc(collection(db, "raporlar"), {
    tur: "konu",
    konuId,
    uid: currentUser.uid,
    tarih: serverTimestamp()
  });

  alert("Raporun gönderildi. Gerekli inceleme admin tarafından yapılacaktır.");
};
