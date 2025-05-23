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

// HTML'e listele
async function loadTests() {
  const testContainer = document.getElementById("test-list");

  try {
    const querySnapshot = await getDocs(collection(db, "testler"));
    if (querySnapshot.empty) {
      testContainer.innerHTML = "<p>Hiç test bulunamadı.</p>";
      return;
    }

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const title = data.title || "Başlıksız Test";
      const description = data.description || "";
      const testId = doc.id;

      const card = document.createElement("div");
      card.className = "test-card";
      card.innerHTML = `
        <h3>${title}</h3>
        <p>${description}</p>
        <a href="test-render.html?id=${testId}" class="test-btn">Teste Git</a>
      `;

      testContainer.appendChild(card);
    });
  } catch (error) {
    testContainer.innerHTML = `<p>Testler yüklenirken hata oluştu: ${error.message}</p>`;
    console.error("Hata:", error);
  }
}

window.addEventListener("DOMContentLoaded", loadTests);
