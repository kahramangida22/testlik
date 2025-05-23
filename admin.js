
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";

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

document.getElementById("testForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const title = document.getElementById("testTitle").value.trim();
  const category = document.getElementById("testCategory").value.trim();
  const description = document.getElementById("testDescription").value.trim();
  const content = document.getElementById("testJSON").value.trim();

  try {
    const jsonContent = JSON.parse(content);
    await setDoc(doc(db, "testler", title), {
      title,
      category,
      description,
      questions: jsonContent.questions || []
    });
    document.getElementById("status").textContent = "✅ Test başarıyla eklendi!";
  } catch (err) {
    document.getElementById("status").textContent = "❌ Hata: " + err.message;
  }
});
