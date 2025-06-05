import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  getDoc,
  updateDoc
} from "firebase/firestore";
import {
  getAuth,
  onAuthStateChanged
} from "firebase/auth";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDcneigub2eAJjTrfrkiETuLgy5ule8L6s",
  authDomain: "testlik.firebaseapp.com",
  projectId: "testlik",
  storageBucket: "testlik.firebasestorage.app",
  messagingSenderId: "668524500496",
  appId: "1:668524500496:web:579bb4fc5990c87afedc95",
  measurementId: "G-8ZEYBJCV3T"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

let sorular = [];
let mevcutSoru = 0;
let kullanici = null;
let cevaplandi = false;

// Soru alanları
const soruElement = document.getElementById("soru");
const seceneklerElement = document.getElementById("secenekler");
const dogruDiv = document.getElementById("dogruCevap");
const sonrakiBtn = document.getElementById("sonrakiBtn");

// Kullanıcı kontrolü
onAuthStateChanged(auth, (user) => {
  if (user) {
    kullanici = user;
    const kullaniciBilgi = document.getElementById("kullaniciBilgi");
    kullaniciBilgi.innerHTML = `<strong>${user.displayName || "Kullanıcı"}</strong> - 🧠 Puan: <span id="puanYaz">Yükleniyor...</span><br><button onclick="logout()">Çıkış Yap</button>`;
    puaniGoster();
  } else {
    kullanici = null;
  }
});

// Puanı göster
function puaniGoster() {
  const userDocRef = doc(db, "kullanicilar", kullanici.uid);
  getDoc(userDocRef).then((docSnap) => {
    if (docSnap.exists()) {
      const puan = docSnap.data().puan || 0;
      document.getElementById("puanYaz").textContent = puan;
    }
  });
}

// Soruları getir (kategoriye göre)
const kategori = document.body.getAttribute("data-kategori");
const soruKoleksiyonu = collection(db, kategori || "mizah");

getDocs(soruKoleksiyonu).then((snapshot) => {
  snapshot.forEach((doc) => {
    sorular.push(doc.data());
  });

  // Soruları karıştır
  sorular = sorular.sort(() => Math.random() - 0.5);
  soruGoster();
});

// Soru göster
function soruGoster() {
  cevaplandi = false;
  const soru = sorular[mevcutSoru];
  soruElement.textContent = soru.soru;
  seceneklerElement.innerHTML = "";
  dogruDiv.textContent = "";
  sonrakiBtn.style.display = "none";

  soru.secenekler.forEach((secenek) => {
    const btn = document.createElement("button");
    btn.textContent = secenek;
    btn.classList.add("secenek");
    btn.onclick = () => cevapKontrol(secenek, soru);
    seceneklerElement.appendChild(btn);
  });
}

// Cevap kontrol
function cevapKontrol(secenek, soru) {
  if (cevaplandi) return;
  cevaplandi = true;

  if (secenek === soru.cevap) {
    dogruDiv.textContent = "✅ Doğru!";
    dogruDiv.style.color = "lightgreen";

    // Giriş yaptıysa puan ver
    if (kullanici) {
      const userDocRef = doc(db, "kullanicilar", kullanici.uid);
      getDoc(userDocRef).then((docSnap) => {
        if (docSnap.exists()) {
          const mevcutPuan = docSnap.data().puan || 0;
          const yeniPuan = mevcutPuan + 10;

          updateDoc(userDocRef, { puan: yeniPuan }).then(() => {
            puaniGoster();
          });
        }
      });
    } else {
      dogruDiv.textContent += " (Giriş yapmadığınız için puan kazanmadınız)";
    }

  } else {
    dogruDiv.innerHTML = `❌ Yanlış! <br>✅ Doğru cevap: <strong>${soru.cevap}</strong>`;
    dogruDiv.style.color = "#ffcccb";
  }

  sonrakiBtn.style.display = "inline-block";
}

// Sonraki soruya geç
sonrakiBtn.addEventListener("click", () => {
  mevcutSoru++;
  if (mevcutSoru < sorular.length) {
    soruGoster();
  } else {
    document.getElementById("testAlani").innerHTML = `
      <h2>🎉 Test Tamamlandı!</h2>
      <button onclick="window.location.href='index.html'">🏠 Ana Sayfaya Dön</button>
      <button onclick="location.reload()">🔁 Aynı kategoride başka test çöz</button>
    `;
  }
});

// Çıkış işlemi
window.logout = function () {
  auth.signOut().then(() => {
    location.reload();
  });
};
