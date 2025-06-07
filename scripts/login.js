import { auth, signInWithEmailAndPassword, setDoc, getDoc, doc, db } from "./firebase-config.js";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const mesaj = document.getElementById("mesaj");

window.girisYap = async () => {
  try {
    const email = emailInput.value;
    const password = passwordInput.value;
    await signInWithEmailAndPassword(auth, email, password);
    mesaj.textContent = "Giriş başarılı! Yönlendiriliyorsunuz...";
    window.location.href = "index.html";
  } catch (error) {
    mesaj.textContent = "❌ Giriş başarısız: " + error.message;
  }
};

window.kayitOl = async () => {
  try {
    const email = emailInput.value;
    const password = passwordInput.value;
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    // Yeni kullanıcı için puan sıfırla
    await setDoc(doc(db, "users", userCredential.user.uid), {
      email: email,
      puan: 0
    });
    mesaj.textContent = "✅ Kayıt başarılı! Ana sayfaya yönlendiriliyorsunuz...";
    window.location.href = "index.html";
  } catch (error) {
    mesaj.textContent = "❌ Kayıt başarısız: " + error.message;
  }
};
