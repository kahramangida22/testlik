import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import {
  getFirestore,
  collection,
  getDoc,
  getDocs,
  doc,
  query,
  where
} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

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

// Haber ID'yi al
const params = new URLSearchParams(window.location.search);
const haberId = params.get("id");

const haberBaslik = document.getElementById("haberBaslik");
const haberIcerik = document.getElementById("haberIcerik");

async function haberiGetir() {
  const docRef = doc(db, "haberler", haberId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const data = docSnap.data();
    haberBaslik.textContent = data.baslik;
    haberIcerik.textContent = data.icerik;

    // Butonlar için kategori bilgisi
    const kategori = data.kategori;
    document.getElementById("sonrakiHaberBtn").onclick = () => sonrakiHabereGit(kategori);
    document.getElementById("rastgeleHaberBtn").onclick = rastgeleHabereGit;
  } else {
    haberBaslik.textContent = "Haber bulunamadı.";
    haberIcerik.textContent = "";
  }
}

async function sonrakiHabereGit(kategori) {
  const q = query(collection(db, "haberler"), where("kategori", "==", kategori));
  const snapshot = await getDocs(q);
  const haberler = [];

  snapshot.forEach(doc => {
    haberler.push({ id: doc.id, ...doc.data() });
  });

  haberler.sort((a, b) => a.baslik.localeCompare(b.baslik));
  const index = haberler.findIndex(h => h.id === haberId);
  const sonraki = haberler[index + 1] || haberler[0];
  window.location.href = `haber-detay.html?id=${sonraki.id}`;
}

async function rastgeleHabereGit() {
  const q = query(collection(db, "haberler"));
  const snapshot = await getDocs(q);
  const haberler = [];

  snapshot.forEach(doc => haberler.push(doc.id));
  const rastgele = haberler[Math.floor(Math.random() * haberler.length)];
  window.location.href = `haber-detay.html?id=${rastgele}`;
}

haberiGetir();
