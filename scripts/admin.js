import { db, collection, addDoc, getDocs, updateDoc, doc } from "./firebase-config.js";

const mesajAlani = document.getElementById("adminMesaj");

window.testEkle = async () => {
  const jsonInput = document.getElementById("jsonInput").value;
  const kategori = document.getElementById("kategoriInput").value.trim().toLowerCase();

  if (!jsonInput || !kategori) {
    mesajAlani.textContent = "❌ Tüm alanları doldurun.";
    return;
  }

  try {
    const sorular = JSON.parse(jsonInput);
    const testRef = collection(db, "testler", kategori, "sorular");

    for (const soru of sorular) {
      await addDoc(testRef, soru);
    }

    mesajAlani.style.color = "green";
    mesajAlani.textContent = "✅ Test başarıyla eklendi!";
  } catch (err) {
    mesajAlani.style.color = "red";
    mesajAlani.textContent = "❌ JSON formatı hatalı veya ekleme başarısız.";
    console.error(err);
  }
};

window.puanSifirla = async () => {
  try {
    const usersRef = collection(db, "users");
    const snapshot = await getDocs(usersRef);

    for (const userDoc of snapshot.docs) {
      await updateDoc(doc(db, "users", userDoc.id), { puan: 0 });
    }

    mesajAlani.style.color = "green";
    mesajAlani.textContent = "✅ Tüm puanlar sıfırlandı!";
  } catch (err) {
    mesajAlani.style.color = "red";
    mesajAlani.textContent = "❌ Puanlar sıfırlanırken hata oluştu.";
    console.error(err);
  }
};
