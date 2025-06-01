// main.js

// Firebase ve kullanıcı kontrolleri
firebase.auth().onAuthStateChanged(function(user) {
  var logoutBtn = document.getElementById('logout-btn');
  var adminNavLink = document.getElementById('admin-nav-link');
  if (logoutBtn) {
    if (user) logoutBtn.style.display = 'inline-block';
    else logoutBtn.style.display = 'none';
  }
  if (adminNavLink) {
    if (user && user.email === "admin@testlik.com") adminNavLink.style.display = "inline-block";
    else adminNavLink.style.display = "none";
  }
});

document.addEventListener('DOMContentLoaded', function() {
  var logoutBtnElem = document.getElementById('logout-btn');
  if (logoutBtnElem) {
    logoutBtnElem.onclick = function(e) {
      e.preventDefault();
      firebase.auth().signOut().then(() => {
        window.location.href = "index.html";
      });
    }
  }
  // Eğer fonksiyonlar gerekiyorsa burada başlatılır
  if (typeof testleriYukle === "function") testleriYukle();
  if (typeof kategorileriYukle === "function") kategorileriYukle();
  if (typeof kullaniciVerisiniYukle === "function") kullaniciVerisiniYukle();
  if (typeof carkiHazirla === "function") carkiHazirla();
});

// Ana sayfa için yeni ve popüler testler (index.html)
async function testleriYukle() {
  const yeniTestler = document.getElementById("yeni-testler");
  const populerTestler = document.getElementById("populer-testler");

  if (yeniTestler) {
    // En yeni 8 test
    const yeniSnap = await db.collection("tests").orderBy("createdAt", "desc").limit(8).get();
    let htmlYeni = "";
    yeniSnap.forEach(doc => {
      const t = doc.data();
      htmlYeni += `
        <div class="test-card">
          <img class="test-img" src="${t.image || 'img/soru-isareti.png'}" alt="Test Görseli"/>
          <div class="test-title">${t.title || "Test Başlığı"}</div>
          <div class="test-desc">${t.description || ""}</div>
          <button class="test-btn" onclick="window.location.href='test-render.html?id=${doc.id}'">Teste Git</button>
        </div>
      `;
    });
    yeniTestler.innerHTML = htmlYeni || "<div>Test bulunamadı.</div>";
  }

  if (populerTestler) {
    // En çok çözülen 8 test
    const popSnap = await db.collection("tests").orderBy("solvedCount", "desc").limit(8).get();
    let htmlPop = "";
    popSnap.forEach(doc => {
      const t = doc.data();
      htmlPop += `
        <div class="test-card">
          <img class="test-img" src="${t.image || 'img/soru-isareti.png'}" alt="Test Görseli"/>
          <div class="test-title">${t.title || "Test Başlığı"}</div>
          <div class="test-desc">${t.description || ""}</div>
          <button class="test-btn" onclick="window.location.href='test-render.html?id=${doc.id}'">Teste Git</button>
        </div>
      `;
    });
    populerTestler.innerHTML = htmlPop || "<div>Test bulunamadı.</div>";
  }
}

// Kategoriler sayfası için kategori listeleme (kategoriler.html)
async function kategorileriYukle() {
  const kategoriList = document.getElementById("kategori-list");
  if (!kategoriList) return;

  // Kategoriler manuel veya veritabanından çekilebilir
  const kategoriler = [
    { key: "Genel", title: "Genel", desc: "Gündemden her şey", img: "img/category-genel.png" },
    { key: "Eğlence", title: "Eğlence", desc: "Keyifli, komik, özgün", img: "img/category-eglence.png" },
    { key: "Bilgi", title: "Bilgi", desc: "Beyin yakan sorular", img: "img/category-bilgi.png" },
    { key: "Psikoloji", title: "Psikoloji", desc: "Kişilik, zeka testleri", img: "img/category-psikoloji.png" },
  ];
  let html = "";
  kategoriler.forEach(kat => {
    html += `
      <div class="kategori-card" onclick="window.location.href='kategori-testleri.html?cat=${kat.key}'">
        <img src="${kat.img}" class="kategori-img" alt="${kat.title}">
        <div class="kategori-title">${kat.title}</div>
        <div class="kategori-desc">${kat.desc}</div>
      </div>
    `;
  });
  kategoriList.innerHTML = html;
}

// Profil, dashboard, çark, favoriler vb. için diğer fonksiyonları eklemen gerekiyorsa buraya yazabilirsin.
// Örn: kullanıcı verisi çekme, çark döndürme, favorilere ekleme, vs.

