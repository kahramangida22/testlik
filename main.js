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
        <div class="test-card" style="max-width:360px;">
          <img src="${t.image || 'img/test-category-default.png'}" alt="Test Görseli" loading="lazy"/>
          <div class="category">${t.category || 'Genel'}</div>
          <h3 style="color:#735aff;margin-bottom:7px;font-size:1.18em;">${t.title}</h3>
          <p style="color:#8f7fff;font-size:.98em;min-height:30px;">${t.description || ''}</p>
          <a href="test-render.html?id=${doc.id}" class="cta-btn" style="margin-top:10px;">Testi Çöz</a>
        </div>
      `;
    });
  } catch (err) {
    testList.innerHTML = "<p>Testler yüklenirken hata oluştu!</p>";
    console.error(err);
  }
});
