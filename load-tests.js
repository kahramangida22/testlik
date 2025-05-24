
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js";

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

async function loadTests() {
  const testListDiv = document.getElementById("test-list");
  try {
    const querySnapshot = await getDocs(collection(db, "testler"));
    if (querySnapshot.empty) {
      testListDiv.innerHTML = "<p>Test bulunamadı.</p>";
      return;
    }
    testListDiv.innerHTML = "";
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const title = data.title || "Adsız Test";
      const div = document.createElement("div");
      div.innerHTML = `<a href="test-render.html?id=${doc.id}">${title}</a>`;
      testListDiv.appendChild(div);
    });
  } catch (error) {
    testListDiv.innerHTML = "<p>Testler yüklenemedi.</p>";
  }
}

loadTests();
