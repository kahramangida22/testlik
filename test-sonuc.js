import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDcneigub2eAJjTrfrkiETuLgy5ule8L6s",
  authDomain: "testlik.firebaseapp.com",
  projectId: "testlik"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

onAuthStateChanged(auth, async user => {
  if (!user) {
    document.getElementById("resultTitle").textContent = "Giriş Yapmadınız!";
    return;
  }

  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    document.getElementById("resultTitle").textContent = "Kullanıcı bulunamadı.";
    return;
  }

  const points = userSnap.data().points || 0;
  document.getElementById("resultPoints").textContent = `Toplam Puan: ${points}`;

  // Görsel ve mesaj seçimi
  let image = "";
  let title = "";
  let message = "";

  if (points < 50) {
    image = "https://i.imgur.com/ITWQ5Lv.png";
    title = "Sakin Güç";
    message = "Sen huzuru ve dengeyi temsil ediyorsun.";
  } else if (points < 100) {
    image = "https://i.imgur.com/VlvUR9z.png";
    title = "Meraklı Kaşif";
    message = "Yeni bilgiler peşindesin ve durmadan araştırıyorsun.";
  } else {
    image = "https://i.imgur.com/1bX5QH6.png";
    title = "Lider Ruh";
    message = "Senin doğanda liderlik var! İnsanları etkiliyorsun.";
  }

  document.getElementById("resultImage").src = image;
  document.getElementById("resultTitle").textContent = title;
  document.getElementById("resultMessage").textContent = message;
});