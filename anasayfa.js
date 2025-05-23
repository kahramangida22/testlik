// Firebase bağlantısı
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

// ✅ Testleri çek ve ekrana yaz
async function loadTests() {
  const testListDiv = document.getElementById("test-list");
  testListDiv.innerHTML = "<p>Yükleniyor...</p>";

  try {
    const querySnapshot = await getDocs(collection(db, "testler"));
    if (querySnapshot.empty) {
      testListDiv.innerHTML = "<p>Test bulunamadı.</p>";
      return;
    }

    let html = "";
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      html += `
        <div style="border: 1px solid #ccc; border-radius: 10px; padding: 20px; margin: 15px 0;">
          <h3>${data.title || "Adsız Test"}</h3>
          <p>${data.description || ""}</p>
          <a href="test-render.html?id=${doc.id}">
            <button style="padding: 10px 20px;">Teste Git</button>
          </a>
        </div>
      `;
    });

    testListDiv.innerHTML = html;
  } catch (error) {
    testListDiv.innerHTML = "<p>Testler yüklenemedi. Hata: " + error.message + "</p>";
  }
}

loadTests();
