import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import {
  getFirestore, collection, getDocs, query, orderBy
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import {
  getAuth, onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

// Firebase yapılandırması
const firebaseConfig = {
  apiKey: "AIzaSyDcneigub2eAJjTrfrkiETuLgy5ule8L6s",
  authDomain: "testlik.firebaseapp.com",
  projectId: "testlik",
  storageBucket: "testlik.firebasestorage.app",
  messagingSenderId: "668524500496",
  appId: "1:668524500496:web:579bb4fc5990c87afedc95"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();

const puanListesi = document.getElementById("puan-listesi");
const kendiPuanKutusu = document.getElementById("kendi-puan");
const girisIsim = document.getElementById("giris-isim");

let kullaniciUID = null;

// Giriş yapan kullanıcıyı bul
onAuthStateChanged(auth, async (user) => {
  if (user) {
    kullaniciUID = user.uid;
    girisIsim.textContent = `👤 ${user.displayName || user.email}`;
    puanlariGetir();
  } else {
    girisIsim.textContent = "🔑 Giriş Yapılmadı";
    kendiPuanKutusu.textContent = "🔒 Giriş yaparak kendi puanınızı görebilirsiniz.";
    puanlariGetir(); // misafir için sadece liste
  }
});

// Firestore'dan puan verilerini getir
async function puanlariGetir() {
  const q = query(collection(db, "kullanicilar"), orderBy("puan", "desc"));
  const querySnapshot = await getDocs(q);

  let index = 1;
  querySnapshot.forEach((docSnap) => {
    const data = docSnap.data();
    const li = document.createElement("li");
    li.innerHTML = `<span>#${index} - ${data.kullaniciAdi}</span><span>${data.puan} 🏅</span>`;
    puanListesi.appendChild(li);

    if (docSnap.id === kullaniciUID) {
      kendiPuanKutusu.textContent = `🎯 Senin Puanın: ${data.puan} | Sıralama: #${index}`;
    }

    index++;
  });
}
