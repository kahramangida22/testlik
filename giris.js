import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

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

window.girisYap = function () {
  const email = document.getElementById("email").value;
  const sifre = document.getElementById("password").value;
  const hata = document.getElementById("hata");

  signInWithEmailAndPassword(auth, email, sifre)
    .then((userCredential) => {
      window.location.href = "index.html";
    })
    .catch((error) => {
      hata.textContent = "Giriş başarısız: " + error.message;
    });
};
