
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js";

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

const testList = document.getElementById("testList");
const categoryFilter = document.getElementById("categoryFilter");

let allTests = [];

async function fetchTests() {
  const querySnapshot = await getDocs(collection(db, "testler"));
  allTests = [];
  querySnapshot.forEach(doc => {
    const data = doc.data();
    data.id = doc.id;
    allTests.push(data);
  });
  displayCategories();
  displayTests();
}

function displayCategories() {
  const categories = [...new Set(allTests.map(t => t.category))];
  categoryFilter.innerHTML = '<button onclick="filterCategory('all')">Tümü</button>' +
    categories.map(cat => `<button onclick="filterCategory('${cat}')">${cat}</button>`).join("");
}

window.filterCategory = (cat) => {
  const filtered = (cat === "all") ? allTests : allTests.filter(t => t.category === cat);
  displayTests(filtered);
}

function displayTests(list = allTests) {
  testList.innerHTML = list.map(test => `
    <div class="test-card">
      <h3>${test.title}</h3>
      <p><strong>Kategori:</strong> ${test.category}</p>
      <p>${test.description}</p>
      <a href="test-render.html?id=${test.id}">Teste Git</a>
    </div>
  `).join("");
}

fetchTests();
