import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

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
const auth = getAuth(app);
const db = getFirestore(app);

// Elementler
const loginBtn = document.getElementById("login-btn");
const logoutBtn = document.getElementById("logout-btn");
const userInfo = document.getElementById("user-info");
const userNameSpan = document.getElementById("user-name");
const userScoreSpan = document.getElementById("user-score");

// Giriş Yap butonuna tıklanınca yönlendir
if (loginBtn) {
  loginBtn.addEventListener("click", () => {
    window.location.href = "giris.html";
  });
}

// Çıkış Yap
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    signOut(auth).then(() => {
      window.location.reload();
    });
  });
}

// Oturum kontrolü
onAuthStateChanged(auth, async (user) => {
  if (user) {
    loginBtn.style.display = "none";
    userInfo.classList.remove("hidden");

    const userRef = doc(db, "kullanicilar", user.uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const data = userSnap.data();
      userNameSpan.textContent = data.kullaniciAdi || user.email;
      userScoreSpan.textContent = `${data.puan || 0} Puan`;
    }
  } else {
    loginBtn.style.display = "inline-block";
    userInfo.classList.add("hidden");
  }
});

// Rastgele test butonu
window.rastgeleTest = function () {
  const testler = [
    "test-mizah.html", "test-film.html", "test-muzik.html",
    "test-bilgi.html", "test-spor.html", "test-turkiye.html",
    "test-dunya.html", "test-yapayzeka.html", "test-internet.html",
    "test-basketbol.html", "test-tarih.html", "test-bilgisayar.html"
  ];
  const rastgele = testler[Math.floor(Math.random() * testler.length)];
  window.location.href = rastgele;
};
