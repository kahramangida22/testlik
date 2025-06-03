import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDcneigub2eAJjTrfrkiETuLgy5ule8L6s",
  authDomain: "testlik.firebaseapp.com",
  projectId: "testlik",
  storageBucket: "testlik.firebasestorage.app",
  messagingSenderId: "668524500496",
  appId: "1:668524500496:web:579bb4fc5990c87afedc95"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

window.uyeOl = function () {
  const email = document.getElementById("email").value;
  const sifre = document.getElementById("password").value;
  const kullaniciAdi = document.getElementById("username").value;
  const hata = document.getElementById("hata");

  if (!kullaniciAdi.trim()) {
    hata.textContent = "Kullanıcı adı boş bırakılamaz.";
    return;
  }

  createUserWithEmailAndPassword(auth, email, sifre)
    .then(async (userCredential) => {
      const user = userCredential.user;
      await setDoc(doc(db, "puanlar", user.uid), {
        ad: kullaniciAdi,
        puan: 0
      });
      window.location.href = "index.html";
    })
    .catch((error) => {
      hata.textContent = "Üyelik başarısız: " + error.message;
    });
};
