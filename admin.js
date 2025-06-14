import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import {
  getFirestore, collection, addDoc, updateDoc, doc, getDocs
} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";
import {
  getAuth, onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";

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
const auth = getAuth();

const adminUID = "admin123"; // admin kullanıcı UID'si buraya yazılmalı

onAuthStateChanged(auth, user => {
  if (!user || user.uid !== adminUID) {
    alert("Bu sayfaya erişim yetkiniz yok.");
    window.location.href = "index.html";
  }
});

// Test ekle
const testEkleBtn = document.getElementById("testEkleBtn");
if (testEkleBtn) {
  testEkleBtn.onclick = async () => {
    try {
      const veri = JSON.parse(document.getElementById("testJson").value);
      await addDoc(collection(db, "testler"), veri);
      alert("Test başarıyla eklendi");
    } catch (e) {
      alert("JSON formatında hata var veya eklenemedi.");
    }
  };
}

// Haber ekle
const haberEkleBtn = document.getElementById("haberEkleBtn");
if (haberEkleBtn) {
  haberEkleBtn.onclick = async () => {
    const baslik = document.getElementById("haberBaslik").value;
    const kategori = document.getElementById("haberKategori").value;
    const icerik = document.getElementById("haberIcerik").value;
    if (!baslik || !kategori || !icerik) return alert("Tüm alanları doldurun");

    await addDoc(collection(db, "haberler"), {
      baslik,
      kategori,
      icerik,
      tiklanmaSayisi: 0,
      tarih: new Date()
    });
    alert("Haber başarıyla eklendi");
  };
}

// Puan sıfırla
const puanSifirlaBtn = document.getElementById("puanSifirlaBtn");
if (puanSifirlaBtn) {
  puanSifirlaBtn.onclick = async () => {
    const snapshot = await getDocs(collection(db, "kullanicilar"));
    for (const docItem of snapshot.docs) {
      await updateDoc(doc(db, "kullanicilar", docItem.id), { puan: 0 });
    }
    alert("Tüm puanlar sıfırlandı");
  };
}

// Bildirim gönder (örnek - veri ekle)
const bildirimGonderBtn = document.getElementById("bildirimGonderBtn");
if (bildirimGonderBtn) {
  bildirimGonderBtn.onclick = async () => {
    const mesaj = document.getElementById("bildirimMesaji").value;
    if (!mesaj) return alert("Mesaj boş olamaz");

    await addDoc(collection(db, "bildirimler"), {
      mesaj,
      tarih: new Date()
    });
    alert("Bildirim kaydedildi (örnek amaçlı)");
  };
}
