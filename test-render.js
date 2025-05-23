import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDcneigub2eAJjTrfrkiETuLgy5ule8L6s",
  authDomain: "testlik.firebaseapp.com",
  projectId: "testlik"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const params = new URLSearchParams(window.location.search);
const testId = params.get("id");
const qIndex = parseInt(params.get("q") || "1");

const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const nextBtn = document.getElementById("nextBtn");

async function loadQuestion() {
  const ref = doc(db, "testler", testId);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    questionEl.textContent = "Test bulunamadı.";
    return;
  }

  const test = snap.data();
  if (!test.questions || test.questions.length < qIndex) {
    questionEl.textContent = "Test tamamlandı.";
    window.location.href = "test-sonuc.html";
    return;
  }

  const currentQ = test.questions[qIndex - 1];
  questionEl.textContent = qIndex + ". " + currentQ.question;
  optionsEl.innerHTML = "";

  currentQ.options.forEach(opt => {
    const label = document.createElement("label");
    const input = document.createElement("input");
    input.type = "radio";
    input.name = "answer";
    input.value = opt;
    label.appendChild(input);
    label.append(" " + opt);
    optionsEl.appendChild(label);
    optionsEl.appendChild(document.createElement("br"));
  });

  nextBtn.style.display = "inline-block";
}

nextBtn.onclick = () => {
  const selected = document.querySelector("input[name='answer']:checked");
  if (!selected) {
    alert("Lütfen bir seçenek seçin.");
    return;
  }
  const next = qIndex + 1;
  window.location.href = `test-render.html?id=${testId}&q=${next}`;
};

loadQuestion();