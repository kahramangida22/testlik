// Firebase transaction kayıt, cüzdan, para çekme ve admin paneli için auth.js güncellenmiş versiyonu
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, updateDoc, increment, collection, addDoc, query, orderBy, getDocs, updateDoc as updateDocRef } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js";

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
const auth = getAuth(app);
const db = getFirestore(app);

window.register = function() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  createUserWithEmailAndPassword(auth, email, password)
    .then(async (userCredential) => {
      const uid = userCredential.user.uid;
      await setDoc(doc(db, "users", uid), {
        email: email,
        points: 0
      });
      window.location.href = "dashboard.html";
    })
    .catch(error => alert(error.message));
};

window.login = function() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      window.location.href = "dashboard.html";
    })
    .catch(error => alert(error.message));
};

window.logout = function() {
  signOut(auth).then(() => {
    window.location.href = "login.html";
  });
};

onAuthStateChanged(auth, async (user) => {
  if (user && document.getElementById("userpoints")) {
    const userDoc = await getDoc(doc(db, "users", user.uid));
    const userData = userDoc.data();
    document.getElementById("userpoints").textContent = userData.points;
  }
  if (user && document.getElementById("transactions")) {
    const txnQuery = query(collection(db, "users", user.uid, "transactions"), orderBy("date", "desc"));
    const txnSnap = await getDocs(txnQuery);
    let html = "";
    txnSnap.forEach(doc => {
      const t = doc.data();
      html += `<div class='txn'><strong>+${t.points} puan</strong> - ${t.title} <br/><small>${new Date(t.date.seconds * 1000).toLocaleString()}</small></div>`;
    });
    document.getElementById("transactions").innerHTML = html || "<em>Henüz işlem yok.</em>";
  }
  if (user && document.getElementById("withdrawalsList")) {
    const usersSnap = await getDocs(collection(db, "users"));
    let html = "";
    for (const userDoc of usersSnap.docs) {
      const withdrawalsRef = collection(db, "users", userDoc.id, "withdrawals");
      const withdrawalsSnap = await getDocs(withdrawalsRef);
      withdrawalsSnap.forEach(w => {
        const data = w.data();
        html += `<div class='txn'>
          <strong>${data.amount} puan</strong> - ${data.iban}<br/>
          <small>${new Date(data.date.seconds * 1000).toLocaleString()}</small><br/>
          Açıklama: ${data.explanation}<br/>
          Durum: <strong>${data.status}</strong><br/>
          <button onclick="approveWithdrawal('${userDoc.id}', '${w.id}')">Onayla</button>
          <button onclick="rejectWithdrawal('${userDoc.id}', '${w.id}')">Reddet</button>
        </div><hr/>`;
      });
    }
    document.getElementById("withdrawalsList").innerHTML = html || "<em>Çekim talebi yok.</em>";
  }
});

window.addPoints = async function(points, title = "Test Çözümü") {
  const user = auth.currentUser;
  if (!user) return;
  const userRef = doc(db, "users", user.uid);
  await updateDoc(userRef, { points: increment(points) });
  await addDoc(collection(db, "users", user.uid, "transactions"), {
    title: title,
    points: points,
    date: new Date()
  });
  alert(points + " puan eklendi!");
};

window.requestWithdrawal = async function() {
  const iban = document.getElementById("iban").value;
  const amount = parseInt(document.getElementById("amount").value);
  const explanation = document.getElementById("explanation").value;
  const user = auth.currentUser;
  if (!user) return alert("Lütfen giriş yapın.");

  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);
  const currentPoints = userSnap.data().points;

  if (amount > currentPoints) return alert("Yeterli puan yok.");
  if (amount < 100) return alert("Minimum çekim limiti 100 puandır.");

  await addDoc(collection(db, "users", user.uid, "withdrawals"), {
    iban: iban,
    amount: amount,
    explanation: explanation,
    date: new Date(),
    status: "Beklemede"
  });

  alert("Çekim talebin alındı! 48 saat içinde incelenecek.");
};

window.approveWithdrawal = async function(uid, wid) {
  const ref = doc(db, "users", uid, "withdrawals", wid);
  await updateDocRef(ref, { status: "Ödendi" });
  alert("Talep onaylandı.");
};

window.rejectWithdrawal = async function(uid, wid) {
  const ref = doc(db, "users", uid, "withdrawals", wid);
  await updateDocRef(ref, { status: "Reddedildi" });
  alert("Talep reddedildi.");
};
