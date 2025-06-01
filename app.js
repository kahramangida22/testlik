
import { app } from './firebase.js';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js';
import { getFirestore, doc, setDoc, getDoc } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js';

const auth = getAuth(app);
const db = getFirestore(app);

async function login() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists() && userSnap.data().role === 'admin') {
      document.getElementById('admin').style.display = 'block';
    } else {
      document.getElementById('admin').style.display = 'none';
    }

    alert('Giriş başarılı');
  } catch (error) {
    alert('Giriş başarısız: ' + error.message);
  }
}

async function signup() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;

    // Yeni kullanıcı varsayılan olarak user rolüyle kayıt ediliyor
    await setDoc(doc(db, 'users', uid), {
      email: email,
      role: 'user'
    });

    document.getElementById('admin').style.display = 'none';
    alert('Kayıt başarılı');
  } catch (error) {
    alert('Kayıt başarısız: ' + error.message);
  }
}

window.login = login;
window.signup = signup;


// Test çözüldüğünde puan verme (örnek)
window.submitTest = async function () {
  const user = auth.currentUser;
  if (!user) return alert('Giriş yapmalısın!');

  const userRef = doc(db, 'users', user.uid);
  const userSnap = await getDoc(userRef);
  const currentScore = userSnap.data().score || 0;

  await updateDoc(userRef, {
    score: currentScore + 20  // Test başına +20 puan
  });

  alert('Test çözümü için +20 puan kazandın!');
};

window.showTestResult = function () {
  const possibleResults = [
    "Sen enerjik bir karaktersin!",
    "Sen sakin ve düşüncelisin.",
    "Sen yaratıcı ve hayalperestsin."
  ];
  const selected = possibleResults[Math.floor(Math.random() * possibleResults.length)];
  document.getElementById("result-text").innerText = selected;
  document.getElementById("test-result").style.display = "block";
};

window.showEnhancedResult = function () {
  const selectedOptions = document.querySelectorAll(".option.selected");
  const textCounts = {};

  selectedOptions.forEach(opt => {
    const text = opt.dataset.text;
    textCounts[text] = (textCounts[text] || 0) + 1;
  });

  let resultKey = "Bilinmiyor";
  let max = 0;

  for (const [key, val] of Object.entries(textCounts)) {
    if (val > max) {
      max = val;
      resultKey = key;
    }
  }

  const results = {
    "Lider": {
      text: "Sen doğal bir lidersin, insanları etkileme yeteneğin çok yüksek.",
      image: "https://source.unsplash.com/600x300/?leader"
    },
    "Sanatçı": {
      text: "Sen yaratıcı bir sanatçısın, duygularını eserlerine yansıtıyorsun.",
      image: "https://source.unsplash.com/600x300/?artist"
    },
    "Bilimci": {
      text: "Sen meraklı bir bilim insanısın, dünyayı analiz etmeyi seviyorsun.",
      image: "https://source.unsplash.com/600x300/?scientist"
    }
  };

  const result = results[resultKey] || {
    text: "Kendine has, eşsiz bir karaktersin!",
    image: "https://source.unsplash.com/600x300/?abstract"
  };

  document.getElementById("result-text").innerText = result.text;
  document.getElementById("test-result").style.display = "block";

  const resultCard = document.getElementById("result-card");
  resultCard.innerHTML = `<img src="${result.image}" style="max-width:100%;border-radius:1rem;margin-bottom:1em;" />
  <p>${result.text}</p>`;
};

document.addEventListener("click", function (e) {
  if (e.target.closest(".option")) {
    const options = e.target.closest(".options").querySelectorAll(".option");
    options.forEach(opt => opt.classList.remove("selected"));
    e.target.closest(".option").classList.add("selected");
  }
});
