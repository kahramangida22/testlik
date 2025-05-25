
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "API_KEY",
    authDomain: "testlik.firebaseapp.com",
    projectId: "testlik",
    storageBucket: "testlik.appspot.com",
    messagingSenderId: "SENDER_ID",
    appId: "APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const testListesiDiv = document.getElementById("test-listesi");

async function yukleTestler() {
    testListesiDiv.innerHTML = "Yükleniyor...";

    try {
        const testlerRef = collection(db, "testçi");
        const querySnapshot = await getDocs(testlerRef);

        let html = "";
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            html += `
                <div class="test-kutusu">
                    <a href="test-render.html?id=${doc.id}">${doc.id}</a><br>
                    <small>${data.description || ''}</small>
                </div>
            `;
        });

        testListesiDiv.innerHTML = html || "Hiç test bulunamadı.";
    } catch (err) {
        testListesiDiv.innerHTML = "Hata oluştu: " + err.message;
    }
}

yukleTestler();
