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
  arrayUnion
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
    const refSnap = await getDoc(ref);
    const refData = refSnap.data();
    if ((refData.begenenler || []).includes(currentUser.uid)) {
      alert("Zaten beğendiniz.");
      return;
    }
    await updateDoc(ref, {
      begeniler: increment(1),
      begenenler: arrayUnion(currentUser.uid)
    });
    alert("❤️ Beğendin!");
  };

  document.getElementById("dislikeBtn").onclick = async () => {
    const refSnap = await getDoc(ref);
    const refData = refSnap.data();
    if ((refData.dislikelayanlar || []).includes(currentUser.uid)) {
      alert("Zaten beğenmeme yaptınız.");
      return;
    }
    await updateDoc(ref, {
      dislikelar: increment(1),
      dislikelayanlar: arrayUnion(currentUser.uid)
    });
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
