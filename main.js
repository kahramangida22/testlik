// main.js

// Oturum ve menü kontrolü
firebase.auth().onAuthStateChanged(function(user) {
  // Çıkış yap/gizle butonları
  var logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    if (user) {
      logoutBtn.style.display = "inline-block";
      logoutBtn.onclick = function(e) {
        e.preventDefault();
        firebase.auth().signOut().then(() => window.location.href = "index.html");
      };
    } else {
      logoutBtn.style.display = "none";
    }
  }

  // Kullanıcıya özel menü, profil, dashboard erişimi
  // (Kullanıcı giriş yaptıysa bazı butonlar gösterilecek)
  const protectedLinks = [
    "favoriler.html",
    "profil.html",
    "dashboard.html",
    "istatistik.html"
  ];
  protectedLinks.forEach(page => {
    let link = document.querySelector(`a[href="${page}"]`);
    if (link) link.style.display = user ? "inline-block" : "none";
  });
});

// Kategori ve testleri anasayfada göstermek için (index.html)
function kategorileriYukle() {
  const kategoriList = document.getElementById("kategori-list");
  if (!kategoriList) return;
  db.collection("kategoriler").get().then(snap => {
    let html = "";
    snap.forEach(doc => {
      const k = doc.data();
      html += `
        <div class="kategori-card" onclick="window.location.href='kategori-testleri.html?cat=${encodeURIComponent(k.slug)}'">
          <img src="${k.image || 'img/soru-isareti.png'}" alt="Kategori Görseli">
          <h3>${k.name || 'Kategori'}</h3>
        </div>
      `;
    });
    kategoriList.innerHTML = html || "<div style='color:#bbb;'>Hiç kategori yok.</div>";
  });
}

function testleriYukle() {
  // Yeni testler
  const yeniTestler = document.getElementById("yeni-testler");
  if (yeniTestler) {
    db.collection("tests").orderBy("createdAt", "desc").limit(6).get().then(snap => {
      let html = "";
      snap.forEach(doc => {
        const t = doc.data();
        html += `
          <div class="kategori-card" onclick="window.location.href='test-render.html?id=${doc.id}'">
            <img src="${t.image || 'img/soru-isareti.png'}" alt="Test Görseli">
            <h3>${t.title || "Test"}</h3>
            <p>${t.description || ""}</p>
          </div>
        `;
      });
      yeniTestler.innerHTML = html || "<div style='color:#bbb;'>Yeni test yok.</div>";
    });
  }
  // Popüler testler
  const popTestler = document.getElementById("populer-testler");
  if (popTestler) {
    db.collection("tests").orderBy("popularity", "desc").limit(6).get().then(snap => {
      let html = "";
      snap.forEach(doc => {
        const t = doc.data();
        html += `
          <div class="kategori-card" onclick="window.location.href='test-render.html?id=${doc.id}'">
            <img src="${t.image || 'img/soru-isareti.png'}" alt="Test Görseli">
            <h3>${t.title || "Test"}</h3>
            <p>${t.description || ""}</p>
          </div>
        `;
      });
      popTestler.innerHTML = html || "<div style='color:#bbb;'>Popüler test yok.</div>";
    });
  }
}

// Favoriye ekle/çıkar fonksiyonu (örnek)
async function toggleFavorite(testId) {
  const user = firebase.auth().currentUser;
  if (!user) return alert("Favoriye eklemek için giriş yapmalısın!");
  const userRef = db.collection("users").doc(user.uid);
  const userDoc = await userRef.get();
  let favs = userDoc.data()?.favorites || [];
  if (favs.includes(testId)) {
    favs = favs.filter(id => id !== testId);
  } else {
    favs.push(testId);
  }
  await userRef.update({ favorites: favs });
  // Favoriler güncellendi uyarısı verebilirsin
}

// Diğer modüllerde benzer şekilde Firestore işlemlerini bu dosyadan kontrol edebilirsin.

// Mobil menü için ufak ekleme yapılabilir
