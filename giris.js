import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup
} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDcneigub2eAJjTrfrkiETuLgy5ule8L6s",
  authDomain: "testlik.firebaseapp.com",
  projectId: "testlik",
  storageBucket: "testlik.appspot.com",
  messagingSenderId: "668524500496",
  appId: "1:668524500496:web:579bb4fc5990c87afedc95",
  measurementId: "G-8ZEYBJCV3T"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

let currentUser;

document.getElementById("girisBtn").addEventListener("click", async () => {
  const provider = new GoogleAuthProvider();

  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    currentUser = user;

    const userRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(userRef);

    if (!docSnap.exists()) {
      await setDoc(userRef, {
        uid: user.uid,
        puan: 0
      });
    }

    const data = (await getDoc(userRef)).data();
    if (!data.kullaniciAdi || !data.cinsiyet) {
      document.getElementById("profilModal").style.display = "flex";
    } else {
      window.location.href = "index.html";
    }

  } catch (error) {
    alert("Giriş yapılamadı: " + error.message);
  }
});

// Modal kayıt butonu
document.getElementById("kaydetBtn").addEventListener("click", async () => {
  const kullaniciAdi = document.getElementById("kullaniciAdiInput").value.trim();
  const cinsiyet = document.querySelector('input[name="cinsiyet"]:checked')?.value;

  if (!kullaniciAdi || !cinsiyet) {
    alert("Lütfen tüm alanları doldurun.");
    return;
  }

  const userRef = doc(db, "users", currentUser.uid);
  await updateDoc(userRef, {
    kullaniciAdi,
    cinsiyet
  });

  window.location.href = "index.html";
});
