
import { getFirestore, collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js';
import { app } from './firebase.js';

const db = getFirestore(app);

// Yeni test ekleme
window.addNewTest = async function () {
  const title = document.getElementById('newTestTitle').value;
  const rawData = document.getElementById('newTestData').value;

  try {
    const json = JSON.parse(rawData);
    await addDoc(collection(db, 'tests'), {
      title: title,
      questions: json,
      createdAt: new Date()
    });
    alert('Test başarıyla eklendi!');
  } catch (err) {
    alert('Test eklenemedi. JSON hatası olabilir: ' + err.message);
  }
};

// Kullanıcıları listele
window.listUsers = async function () {
  const usersList = document.getElementById('userList');
  usersList.innerHTML = '';
  try {
    const usersSnapshot = await getDocs(collection(db, 'users'));
    usersSnapshot.forEach((docSnap) => {
      const user = docSnap.data();
      const li = document.createElement('li');
      li.textContent = `${user.email} (${user.role})`;
      usersList.appendChild(li);
    });
  } catch (err) {
    alert('Kullanıcılar listelenemedi: ' + err.message);
  }
};

// Lider tablosunu sıfırla (örnek: puan sıfırlama işlemi)
window.resetLeaderboard = async function () {
  try {
    const usersSnapshot = await getDocs(collection(db, 'users'));
    for (const docSnap of usersSnapshot.docs) {
      const ref = doc(db, 'users', docSnap.id);
      await updateDoc(ref, { score: 0 });
    }
    alert('Lider tablosu sıfırlandı!');
  } catch (err) {
    alert('Sıfırlama başarısız: ' + err.message);
  }
};
