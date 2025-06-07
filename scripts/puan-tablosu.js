import { auth, db, onAuthStateChanged, collection, getDocs } from "./firebase-config.js";

const puanListesi = document.getElementById("puanListesi");
const userInfo = document.getElementById("user-info");

let currentUserUid = null;

onAuthStateChanged(auth, async (user) => {
  if (user) {
    currentUserUid = user.uid;
    userInfo.innerHTML = `<span>👤 ${user.email}</span> <button onclick="window.location.href='index.html'">Çıkış</button>`;
  } else {
    userInfo.innerHTML = `<button onclick="window.location.href='giris.html'">Giriş Yap</button>`;
  }

  await puanTablosunuYukle();
});

async function puanTablosunuYukle() {
  const snapshot = await getDocs(collection(db, "users"));
  const kullanicilar = [];

  snapshot.forEach(doc => {
    const data = doc.data();
    kullanicilar.push({
      id: doc.id,
      email: data.email || "Bilinmiyor",
      puan: data.puan || 0
    });
  });

  // Sıralama: En yüksek puan üste
  kullanicilar.sort((a, b) => b.puan - a.puan);

  puanListesi.innerHTML = "";
  kullanicilar.forEach((user, index) => {
    const row = document.createElement("tr");
    if (user.id === currentUserUid) {
      row.classList.add("aktif-kullanici");
    }
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${user.email}</td>
      <td>${user.puan}</td>
    `;
    puanListesi.appendChild(row);
  });
}
