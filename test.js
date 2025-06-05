import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  updateDoc,
  getDoc
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";
import {
  getAuth,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

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

let user = null;
let currentUserDocRef = null;
let currentScore = 0;
let currentQuestionIndex = 0;
let questions = [];

onAuthStateChanged(auth, async (u) => {
  if (u) {
    user = u;
    const docRef = doc(db, "kullanicilar", user.uid);
    currentUserDocRef = docRef;

    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      currentScore = docSnap.data().puan || 0;
    }

    loadQuestions();
  } else {
    alert("Lütfen giriş yapınız.");
    window.location.href = "giris.html";
  }
});

function getKategoriAdi() {
  const dosya = window.location.pathname.split("/").pop();
  return dosya.replace(".html", "");
}

async function loadQuestions() {
  const kategoriAdi = getKategoriAdi(); // Örn: test-mizah
  const ref = collection(db, kategoriAdi);
  const snapshot = await getDocs(ref);

  snapshot.forEach(doc => {
    questions.push(doc.data());
  });

  shuffleArray(questions);
  showQuestion();
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function showQuestion() {
  const q = questions[currentQuestionIndex];
  if (!q) {
    document.getElementById("soru-alani").innerHTML = "<h3>🎉 Test Bitti!</h3>";
    document.getElementById("secenekler").innerHTML = `
      <button onclick="window.location.href='index.html'" class="btn">Ana Sayfa</button>
    `;
    return;
  }

  document.getElementById("soru-alani").innerHTML = `<h3>${q.soru}</h3>`;
  const secenekler = q.secenekler.map(secenek => `
    <button class="secenek-btn" onclick="cevapla(this, '${secenek}', '${q.cevap}')">${secenek}</button>
  `).join("");

  document.getElementById("secenekler").innerHTML = secenekler;
}

window.cevapla = async function (btn, secilen, dogru) {
  const butonlar = document.querySelectorAll(".secenek-btn");
  butonlar.forEach(b => b.disabled = true);

  if (secilen === dogru) {
    btn.classList.add("dogru");
    currentScore += 10;
    await updateDoc(currentUserDocRef, { puan: currentScore });
  } else {
    btn.classList.add("yanlis");
    butonlar.forEach(b => {
      if (b.textContent === dogru) {
        b.classList.add("dogru");
      }
    });
  }

  setTimeout(() => {
    currentQuestionIndex++;
    showQuestion();
  }, 1500);
};
