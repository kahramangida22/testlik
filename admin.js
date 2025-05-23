import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDcneigub2eAJjTrfrkiETuLgy5ule8L6s",
  authDomain: "testlik.firebaseapp.com",
  projectId: "testlik"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

window.addQuestion = function() {
  const div = document.createElement("div");
  div.className = "question-block";
  div.innerHTML = \`
    <input type="text" placeholder="Soru metni" class="question-text">
    <textarea placeholder="Seçenekleri virgülle ayırarak girin" class="question-options"></textarea>
  \`;
  document.getElementById("questions").appendChild(div);
};

window.addResult = function() {
  const div = document.createElement("div");
  div.className = "result-block";
  div.innerHTML = \`
    <input type="number" placeholder="Minimum puan" class="result-min">
    <input type="number" placeholder="Maksimum puan" class="result-max">
    <input type="text" placeholder="Sonuç metni" class="result-text">
    <input type="text" placeholder="Görsel URL" class="result-image">
  \`;
  document.getElementById("results").appendChild(div);
};

window.submitTest = async function() {
  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;
  const category = document.getElementById("category").value;

  const questionBlocks = document.querySelectorAll(".question-block");
  const questions = Array.from(questionBlocks).map(q => ({
    question: q.querySelector(".question-text").value,
    options: q.querySelector(".question-options").value.split(",").map(opt => opt.trim())
  }));

  const resultBlocks = document.querySelectorAll(".result-block");
  const results = Array.from(resultBlocks).map(r => ({
    min: parseInt(r.querySelector(".result-min").value),
    max: parseInt(r.querySelector(".result-max").value),
    text: r.querySelector(".result-text").value,
    image: r.querySelector(".result-image").value
  }));

  const testId = title.toLowerCase().replace(/ /g, "-");

  await setDoc(doc(db, "testler", testId), {
    title,
    description,
    category,
    questions,
    results
  });

  alert("Test başarıyla kaydedildi!");
};