// --- KATEGORİLER --- //
const kategoriler = [
  {
    ad: "Genel",
    icon: "category-genel.png",
    desc: "Gündemden, genel kültür ve hayat testi!"
  },
  {
    ad: "Eğlence",
    icon: "category-eglence.png",
    desc: "Kahkaha ve eğlence dolu quizler!"
  },
  {
    ad: "Bilgi",
    icon: "category-bilgi.png",
    desc: "Beyin yakan bilgi soruları."
  },
  {
    ad: "Psikoloji",
    icon: "category-psikoloji.png",
    desc: "Kendini keşfet, kişilik ve psikoloji testleri."
  },
  {
    ad: "Oyun",
    icon: "category-oyun.png",
    desc: "Oyun dünyasının testleri ve gamer soruları."
  }
];

function renderKategoriler() {
  const grid = document.getElementById("kategori-grid");
  if (!grid) return;
  grid.innerHTML = "";
  kategoriler.forEach(kat => {
    grid.innerHTML += `
      <div class="card" style="cursor:pointer;" onclick="window.location.href='kategori-testleri.html?cat=${encodeURIComponent(kat.ad)}'">
        <img src="${kat.icon}" class="card-img" alt="${kat.ad}" />
        <div class="card-title">${kat.ad}</div>
        <div class="card-desc">${kat.desc}</div>
      </div>
    `;
  });
}
renderKategoriler();

// --- YENİ TESTLER / POPÜLER TESTLER --- //
async function renderTestler() {
  const yeniDiv = document.getElementById("yeni-testler");
  const popDiv = document.getElementById("populer-testler");
  if (!yeniDiv || !popDiv) return;

  yeniDiv.innerHTML = `<div style="color:#bba5fa;width:100%;">Yükleniyor...</div>`;
  popDiv.innerHTML = `<div style="color:#bba5fa;width:100%;">Yükleniyor...</div>`;

  // Firestore'dan testler çek
  let yeniSnap = await db.collection("tests").orderBy("createdAt","desc").limit(8).get();
  let popSnap = await db.collection("tests").orderBy("solved","desc").limit(8).get();

  // YENİ TESTLER
  let html1 = "";
  yeniSnap.forEach(doc => {
    const t = doc.data();
    html1 += `
      <div class="card" onclick="window.location.href='test-render.html?id=${doc.id}'" style="cursor:pointer;position:relative;">
        <img src="${t.image || 'test-category-default.png'}" class="card-img" alt="Test" />
        <div class="card-title">${t.title || "Test Başlığı"}</div>
        <div class="card-desc">${t.description || ""}</div>
        <div class="card-desc" style="font-size:.94em;color:#ed4a88;margin-top:7px;">${t.category || ""}</div>
      </div>
    `;
  });
  yeniDiv.innerHTML = html1 || `<div style="color:#ed4a88;width:100%;">Henüz test yok!</div>`;

  // POPÜLER TESTLER
  let html2 = "";
  popSnap.forEach(doc => {
    const t = doc.data();
    html2 += `
      <div class="card" onclick="window.location.href='test-render.html?id=${doc.id}'" style="cursor:pointer;position:relative;">
        <img src="${t.image || 'test-category-default.png'}" class="card-img" alt="Test" />
        <div class="card-title">${t.title || "Test Başlığı"}</div>
        <div class="card-desc">${t.description || ""}</div>
        <div class="card-desc" style="font-size:.94em;color:#ed4a88;margin-top:7px;">${t.category || ""}</div>
      </div>
    `;
  });
  popDiv.innerHTML = html2 || `<div style="color:#ed4a88;width:100%;">Henüz popüler test yok!</div>`;
}
renderTestler();

// --- GİRİŞ / KAYIT / MİSAFİR MODAL LOGIC --- //
// GOOGLE GİRİŞ
function loginGoogle() {
  var provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithPopup(provider).then(() => {
    closeModal();
    location.reload();
  }).catch(err => {
    document.getElementById("login-error").innerText = "Google ile giriş başarısız!";
  });
}

// E-MAİL GİRİŞ
function loginEmail() {
  var email = document.getElementById("login-email").value.trim();
  var pass = document.getElementById("login-pass").value.trim();
  if (!email || !pass) {
    document.getElementById("login-error").innerText = "Lütfen e-posta ve şifre gir!";
    return;
  }
  firebase.auth().signInWithEmailAndPassword(email, pass)
    .then(() => { closeModal(); location.reload(); })
    .catch(e => { document.getElementById("login-error").innerText = "Giriş başarısız!"; });
}

// KAYIT OL
function registerEmail() {
  var email = document.getElementById("login-email").value.trim();
  var pass = document.getElementById("login-pass").value.trim();
  if (!email || !pass) {
    document.getElementById("login-error").innerText = "Lütfen e-posta ve şifre gir!";
    return;
  }
  firebase.auth().createUserWithEmailAndPassword(email, pass)
    .then(() => { closeModal(); location.reload(); })
    .catch(e => { document.getElementById("login-error").innerText = "Kayıt başarısız!"; });
}

// MİSAFİR (Üyeliksiz) DEVAM ET
function guestLogin() {
  firebase.auth().signInAnonymously()
    .then(() => { closeModal(); location.reload(); })
    .catch(e => { document.getElementById("login-error").innerText = "Giriş başarısız!"; });
}

// MODAL FONKSİYONLARI
function closeModal() { document.getElementById("login-modal").style.display = "none"; }
function openModal() { document.getElementById("login-modal").style.display = "flex"; }

// SAYFA YENİLENİNCE KULLANICIYI TEKRAR KONTROL ET
firebase.auth().onAuthStateChanged(function(user) {
  // Modal otomatik açılır/kapanır
  if (!user) openModal();
  else closeModal();
  // Admin linkini sadece admin kullanıcıya aç
  var adminLink = document.getElementById('admin-link');
  if (adminLink) {
    if (user && (user.email === "admin@testlik.com" || user.email === "seninadminmailin@...")) adminLink.style.display = "inline-block";
    else adminLink.style.display = "none";
  }
});
