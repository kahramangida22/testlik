// kizlar.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import {
  getFirestore, doc, getDoc, setDoc, updateDoc, addDoc, increment,
  collection, query, orderBy, getDocs, serverTimestamp
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
let aktifKonuId = null;

onAuthStateChanged(auth, async (user) => {
  if (!user) return (window.location.href = "giris.html");

  const userRef = doc(db, "kullanicilar", user.uid);
  let userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    await setDoc(userRef, {
      kullaniciAdi: user.email.split("@")[0],
      uid: user.uid,
      puan: 0,
      cinsiyet: ""
    });
    userSnap = await getDoc(userRef);
  }

  const userData = userSnap.data();

  if (!userData.cinsiyet) {
    document.getElementById("cinsiyetModal").style.display = "flex";
    window.userRef = userRef;
    return;
  }

  if (userData.cinsiyet !== "kadın") {
    alert("❌ Kızlar Kulübü sadece kadın kullanıcılarımıza özeldir. Anlayışınız için teşekkür ederiz.");
    return setTimeout(() => (window.location.href = "index.html"), 3000);
  }

  document.getElementById("icerik").style.display = "block";
  konulariYukle();
});
