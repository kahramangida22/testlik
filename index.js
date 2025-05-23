
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";
import { getFirestore, collection, getDocs, doc, setDoc } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDcneigub2eAJjTrfrkiETuLgy5ule8L6s",
  authDomain: "testlik.firebaseapp.com",
  projectId: "testlik"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

let currentUser = null;
let allTests = [];

const testList = document.getElementById("testList");
const categoryFilter = document.getElementById("categoryFilter");

onAuthStateChanged(auth, (user) => {
  currentUser = user;
});

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
      <button class="favorite-btn" onclick="addToFavorites('${test.id}', '${test.title}')">⭐</button>
      <h3>${test.title}</h3>
      <p><strong>Kategori:</strong> ${test.category}</p>
      <p>${test.description}</p>
      <a href="test-render.html?id=${test.id}&q=1">Teste Git</a>
    </div>
  `).join("");
}

window.addToFavorites = async (testId, title) => {
  if (!currentUser) return alert("Favorilere eklemek için giriş yapmalısınız.");
  await setDoc(doc(db, "users", currentUser.uid, "favorites", testId), {
    testId: testId,
    title: title,
    addedAt: new Date()
  });
  alert("Favorilere eklendi!");
};

fetchTests();
