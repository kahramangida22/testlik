// Modal aç/kapat
window.openModal = function() {
  document.getElementById("login-modal").style.display = "flex";
}
window.closeModal = function() {
  document.getElementById("login-modal").style.display = "none";
}

// Admin linki görünürlüğü
function checkAdminLink(user) {
  var adminLink = document.getElementById('admin-link');
  if (adminLink) {
    if (user && (user.email === "admin@testlik.com" || user.email === "seninadminmailin@...")) adminLink.style.display = "inline-block";
    else adminLink.style.display = "none";
  }
}

// Otomatik dil algılama
window.addEventListener("DOMContentLoaded", ()=>{
  if (navigator.language && !localStorage.getItem("testlikLang")) {
    let lang = navigator.language.split("-")[0];
    localStorage.setItem("testlikLang", lang);
    // (Opsiyonel: Çoklu dil desteği için yönlendirme eklenebilir)
  }
});

// Favoriye ekleme/kaldırma
window.toggleFavori = function(testId) {
  firebase.auth().onAuthStateChanged(function(user) {
    if (!user) return openModal();
    db.collection("users").doc(user.uid).get().then(doc=>{
      let favs = (doc.data() && doc.data().favorites) || [];
      if (favs.includes(testId)) {
        db.collection("users").doc(user.uid).update({favorites: favs.filter(f=>f!==testId)});
      } else {
        db.collection("users").doc(user.uid).update({favorites: [...favs, testId]});
      }
    });
  });
}

// Çözüldü etiketi (test kartlarında)
window.isTestSolved = function(testId, cb) {
  firebase.auth().onAuthStateChanged(function(user) {
    if (!user) return cb(false);
    db.collection("users").doc(user.uid).get().then(doc=>{
      let solved = (doc.data() && doc.data().solvedTests) || [];
      cb(solved.includes(testId));
    });
  });
}

// Giriş çıkış butonları
firebase.auth().onAuthStateChanged(function(user) {
  checkAdminLink(user);
  var logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) logoutBtn.style.display = user ? 'inline-block' : 'none';
  if (logoutBtn) logoutBtn.onclick = function(e) {
    e.preventDefault();
    firebase.auth().signOut().then(() => { window.location.href = "index.html"; });
  }
});

// Anasayfa test yükleme (örnek)
window.onload = function() {
  if (document.getElementById("anasayfa-testler")) {
    // Son eklenen ve popüler testleri çek
    db.collection("tests").orderBy("createdAt","desc").limit(4).get().then(qs=>{
      let html = "";
      qs.forEach(doc=>{
        let t = doc.data();
        html += `
          <div class="test-card">
            <img src="${t.image||'test-category-default.png'}" class="test-img"/>
            <div class="test-title">${t.title}</div>
            <div class="test-desc">${t.description||""}</div>
            <button class="test-btn" onclick="window.location.href='test-render.html?id=${doc.id}'">Çöz</button>
          </div>`;
      });
      document.getElementById("anasayfa-testler").innerHTML = html;
    });
    // Benzer şekilde popüler testler ve kategori için ayrı grid eklenebilir
  }
}
