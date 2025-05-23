
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js";

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

const testData = {
  title: "Kişilik Tipini Öğren!",
  description: "Bu testle kişilik tipini öğrenmeye hazır mısın?",
  questions: [
    {
      question: "En sevdiğin renk hangisi?",
      options: ["Kırmızı", "Mavi", "Yeşil", "Siyah"]
    },
    {
      question: "Boş zamanlarında ne yapmayı seversin?",
      options: ["Kitap okumak", "Spor yapmak", "Film izlemek", "Uyumak"]
    },
    {
      question: "Seni en iyi anlatan kelime nedir?",
      options: ["Enerjik", "Duygusal", "Mantıklı", "Yaratıcı"]
    },
    {
      question: "Bir sorunla karşılaştığında ne yaparsın?",
      options: ["Sakince düşünürüm", "Destek isterim", "Hemen harekete geçerim", "Ertelemeye çalışırım"]
    },
    {
      question: "En çok hangi ortamlarda bulunmaktan hoşlanırsın?",
      options: ["Kalabalık", "Doğa", "Ev", "Sahne"]
    }
  ],
  results: [
    {
      minScore: 0,
      maxScore: 5,
      title: "Sakin ve Düşünceli",
      description: "Sen genellikle içe dönük ve huzurlu birisin. Sakinliğinle dikkat çekiyorsun.",
      image: "https://example.com/images/sakin.png"
    },
    {
      minScore: 6,
      maxScore: 10,
      title: "Enerjik ve Sosyal",
      description: "Sen dışa dönük, enerjik ve sosyal bir insansın. İnsanlarla iletişimin çok güçlü.",
      image: "https://example.com/images/enerjik.png"
    }
  ]
};

// Firestore'a kaydet
async function uploadTest() {
  await setDoc(doc(db, "tests", "test-1"), testData);
  console.log("✅ test-1 başarıyla yüklendi.");
}

uploadTest();
