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

document.getElementById("girisBtn").addEventListener("click", async () => {
  const provider = new GoogleAuthProvider();

  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    const userRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(userRef);

    if (!docSnap.exists()) {
      // Yeni kullanıcı: boş profil oluştur
      await setDoc(userRef, {
        uid: user.uid,
        puan: 0
      });
    }

    // Kullanıcıya ad ve cinsiyet sor (eğer yoksa)
    const snapshot = await getDoc(userRef);
    const userData = snapshot.data();

    if (!userData.kullaniciAdi || !userData.cinsiyet) {
      const kullaniciAdi = prompt("Kullanıcı adınızı girin:");
      const cinsiyet = prompt("Cinsiyetinizi girin (kadın/erkek):");

      if (kullaniciAdi && cinsiyet) {
        await updateDoc(userRef, {
          kullaniciAdi,
          cinsiyet
        });
      }
    }

    window.location.href = "index.html";
  } catch (error) {
    alert("Giriş yapılamadı: " + error.message);
  }
});
