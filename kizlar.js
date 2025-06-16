// kizlar.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import {
  getFirestore, doc, getDoc, setDoc, updateDoc, addDoc, increment,
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

  if (userData.cinsiyet !== "kadın") {
    alert("❌ Kızlar Kulübü sadece kadın kullanıcılarımıza özeldir. Anlayışınız için teşekkür ederiz.");
    return setTimeout(() => (window.location.href = "index.html"), 3000);
  }

  document.getElementById("icerik").style.display = "block";
  konulariYukle();
});

const cinsiyetSec = async (secim) => {
  if (!window.userRef) return;
  if (secim === "kadın") {
    await updateDoc(window.userRef, { cinsiyet: "kadın" });
    location.reload();
  } else {
    alert("❌ Kızlar Kulübü sadece kadın kullanıcılarımıza özeldir. Anlayışınız için teşekkür ederiz.");
    setTimeout(() => (window.location.href = "index.html"), 3000);
  }
};
window.cinsiyetSec = cinsiyetSec;

const konulariYukle = async () => {
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
};
