// Çıkış butonunu göster/gizle ve işlevi
firebase.auth().onAuthStateChanged(function(user) {
  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.style.display = user ? "inline-block" : "none";
    logoutBtn.onclick = function(e){
      e.preventDefault();
      firebase.auth().signOut().then(function() {
        window.location.href = "giris.html";
      });
    };
  }
});

// Giriş yapılmamışsa korumalı sayfalardan yönlendir
const korumaliSayfalar = [
  "profil.html", "dashboard.html", "istatistik.html", "favoriler.html",
  "leaderboard.html", "admin.html", "akademi.html"
];
if (korumaliSayfalar.includes(location.pathname.split("/").pop())) {
  firebase.auth().onAuthStateChanged(function(user) {
    if (!user) window.location.href = "giris.html";
  });
}

// Basit toast fonksiyonu
function toast(mesaj, renk="#ed4a88") {
  let t = document.createElement("div");
  t.style.cssText = `position:fixed;bottom:44px;left:50%;transform:translateX(-50%);background:${renk};color:#fff;
    padding:13px 33px;border-radius:18px;font-size:1.07em;font-weight:700;z-index:3000;box-shadow:0 4px 22px #735aff44;`;
  t.innerText = mesaj;
  document.body.appendChild(t);
  setTimeout(()=>t.remove(), 2400);
}

// Kullanıcı adı ve email getirme örneği (kullanıcı girişli sayfalarda)
function getKullaniciAdi() {
  const user = firebase.auth().currentUser;
  return user ? (user.displayName || user.email.split("@")[0]) : "";
}

// Tarihi güzel formatla
function formatTarih(dateObj) {
  if (!dateObj) return "";
  const d = (dateObj.seconds) ? new Date(dateObj.seconds*1000) : new Date(dateObj);
  return d.toLocaleDateString("tr-TR") + " " + d.toLocaleTimeString("tr-TR", { hour: '2-digit', minute: '2-digit' });
}
