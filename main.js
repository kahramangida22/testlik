// main.js
import { db } from "./firebase.js";

const testList = document.getElementById("test-list");

// Testleri Firestore'dan çek ve ekrana yaz
async function loadTests() {
  if (!testList) return;

  testList.innerHTML = "<p>Testler yükleniyor...</p>";

  try {
    // Tüm testleri al (daha sonra kategorilere göre filtre ekleyebiliriz)
    const snapshot = await db.collection("tests").get();

    if (snapshot.empty) {
      testList.innerHTML = "<p>Henüz test yok!</p>";
      return;
    }

    testList.innerHTML = "";
    snapshot.forEach(doc => {
      const t = doc.data();
      testList.innerHTML += `
        <div class="test-card">
          <img src="${t.image || 'test-default.png'}" alt="Test Görseli" />
          <div class="category">${t.category || 'Genel'}</div>
          <h3>${t.title || ''}</h3>
          <p>${t.description || ''}</p>
          <a href="test-render.html?id=${doc.id}" class="cta-btn">Testi Çöz</a>
        </div>
      `;
    });
  } catch (err) {
    testList.innerHTML = "<p>Testler yüklenemedi!</p>";
    console.error(err);
  }
}

window.addEventListener("DOMContentLoaded", loadTests);
