// main.js

// Anasayfa: Testleri getirip ekrana basar
document.addEventListener("DOMContentLoaded", async function() {
  const testList = document.getElementById("test-list");
  if (!testList) return;

  testList.innerHTML = "<p>Testler yükleniyor...</p>";

  try {
    let urlParams = new URLSearchParams(window.location.search);
    let catFilter = urlParams.get("category");
    let ref = db.collection("tests");
    if (catFilter) {
      ref = ref.where("category", "==", catFilter);
    }
    ref = ref.orderBy("createdAt", "desc");
    const snapshot = await ref.get();

    if (snapshot.empty) {
      testList.innerHTML = "<p>Henüz hiç test eklenmemiş!</p>";
      return;
    }

    testList.innerHTML = "";
    snapshot.forEach(doc => {
      const t = doc.data();
      testList.innerHTML += `
        <div class="test-card">
          <img src="${t.image || 'test-default.png'}" alt="Test Görseli" />
          <div class="category">${t.category || 'Genel'}</div>
          <h3>${t.title}</h3>
          <p>${t.description || ''}</p>
          <a href="test-render.html?id=${doc.id}" class="cta-btn">Testi Çöz</a>
        </div>
      `;
    });
  } catch (err) {
    testList.innerHTML = "<p>Testler yüklenirken hata oluştu!</p>";
    console.error(err);
  }
});
