// konu.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import {
  getFirestore, doc, getDoc, collection, query, where,
  addDoc, serverTimestamp, orderBy, getDocs, updateDoc, increment
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

let currentUser;
let aktifKonuId;

// Yardımcı: URL'den id al
function getQueryParam(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

// Kullanıcı kontrolü
onAuthStateChanged(auth, async (user) => {
  if (!user) return (window.location.href = "giris.html");
  currentUser = user;

  aktifKonuId = getQueryParam("id");
  if (!aktifKonuId) return (window.location.href = "kizlar-klubu.html");

  await updateDoc(doc(db, "konular", aktifKonuId), { okunma: increment(1) });
  yukleKonu();
  yorumlariGetir();
});

// Konu verisini getir
async function yukleKonu() {
  const docRef = doc(db, "konular", aktifKonuId);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) return;

  const veri = docSnap.data();
  document.getElementById("konuDetay").innerHTML = `
    <div class="konu-kutu">
      <h2>${veri.baslik}</h2>
      <p>${veri.aciklama}</p>
      <small>${veri.kullaniciAdi} • ${veri.tarih?.toDate().toLocaleString() || ""}</small>
    </div>
  `;
}

// Yorum gönder
const yorumInput = document.getElementById("yorumInput");
const yorumGonderBtn = document.getElementById("yorumGonderBtn");

yorumGonderBtn.addEventListener("click", async () => {
  const yorum = yorumInput.value.trim();
  if (yorum.length < 5) return alert("Yorum çok kısa.");

  await addDoc(collection(db, `konular/${aktifKonuId}/yorumlar`), {
    yorum,
    uid: currentUser.uid,
    kullaniciAdi: currentUser.email.split("@")[0],
    tarih: serverTimestamp(),
    parentId: null
  });
  yorumInput.value = "";
  yorumlariGetir();
});

// Yorumları getir ve iç içe yaz
async function yorumlariGetir() {
  const yorumlarRef = collection(db, `konular/${aktifKonuId}/yorumlar`);
  const q = query(yorumlarRef, orderBy("tarih"));
  const snap = await getDocs(q);

  const yorumlar = [];
  snap.forEach((docu) => {
    yorumlar.push({ id: docu.id, ...docu.data() });
  });

  const agac = kurYorumAgaci(yorumlar);
  const container = document.getElementById("yorumlar");
  container.innerHTML = "";
  agac.forEach((y) => container.appendChild(olusturYorumHTML(y)));
}

function kurYorumAgaci(yorumlar, parentId = null) {
  return yorumlar
    .filter((y) => y.parentId === parentId)
    .map((y) => ({ ...y, alt: kurYorumAgaci(yorumlar, y.id) }));
}

function olusturYorumHTML(yorum) {
  const div = document.createElement("div");
  div.className = "yorum-kutu";
  div.innerHTML = `
    <p>${yorum.yorum}</p>
    <small>${yorum.kullaniciAdi} • ${yorum.tarih?.toDate().toLocaleString() || ""}</small>
    <div class="cevap-form">
      <textarea placeholder="Cevap yaz..." id="cevap-${yorum.id}"></textarea>
      <button onclick="window.yanitlaYorum('${yorum.id}')">Yanıtla</button>
    </div>
  `;
  if (yorum.alt?.length > 0) {
    const altlar = document.createElement("div");
    altlar.className = "yorum-alt";
    yorum.alt.forEach((alt) => altlar.appendChild(olusturYorumHTML(alt)));
    div.appendChild(altlar);
  }
  return div;
}

window.yanitlaYorum = async function (parentId) {
  const textarea = document.getElementById("cevap-" + parentId);
  const metin = textarea.value.trim();
  if (metin.length < 3) return alert("Cevap çok kısa.");
  await addDoc(collection(db, `konular/${aktifKonuId}/yorumlar`), {
    yorum: metin,
    uid: currentUser.uid,
    kullaniciAdi: currentUser.email.split("@")[0],
    tarih: serverTimestamp(),
    parentId: parentId
  });
  textarea.value = "";
  yorumlariGetir();
};
