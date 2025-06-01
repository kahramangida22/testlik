import { app } from './firebase.js';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  collection,
  addDoc
} from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js';

const auth = getAuth(app);
const db = getFirestore(app);

// Giriş işlemi
async function login() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);

    const adminPanel = document.getElementById('admin');
    if (adminPanel && userSnap.exists()) {
      const role = userSnap.data().role;
      if (role === 'admin') {
        adminPanel.style.display = 'block';
        alert("Hoşgeldin Admin!");
      } else {
        adminPanel.style.display = 'none';
        alert("Giriş başarılı.");
      }
    }
  } catch (error) {
    alert('Giriş başarısız: ' + error.message);
  }
}

// Kayıt işlemi
async function signup() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;

    await setDoc(doc(db, 'users', uid), {
      email: email,
      role: 'user',
      score: 0
    });

    alert('Kayıt başarılı. Şimdi giriş yapabilirsin.');
  } catch (error) {
    alert('Kayıt başarısız: ' + error.message);
  }
}

// Admin panel fonksiyonları
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

window.login = login;
window.signup = signup;
