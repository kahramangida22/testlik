
import { getFirestore, collection, addDoc } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js';
import { app } from './firebase.js';

const db = getFirestore(app);

function generateTestWithResult() {
  return {
    title: "AI ile Oluşturulmuş Test",
    questions: [{'question': 'Hangi mevsimi seversin?', 'image': 'https://source.unsplash.com/400x200/?season', 'options': [{'text': 'Seçenek A', 'image': 'https://source.unsplash.com/100x100/?season,a'}, {'text': 'Seçenek B', 'image': 'https://source.unsplash.com/100x100/?season,b'}, {'text': 'Seçenek C', 'image': 'https://source.unsplash.com/100x100/?season,c'}]}, {'question': 'En sevdiğin renk hangisi?', 'image': 'https://source.unsplash.com/400x200/?color', 'options': [{'text': 'Seçenek A', 'image': 'https://source.unsplash.com/100x100/?color,a'}, {'text': 'Seçenek B', 'image': 'https://source.unsplash.com/100x100/?color,b'}, {'text': 'Seçenek C', 'image': 'https://source.unsplash.com/100x100/?color,c'}]}, {'question': 'Hangisi seni tanımlar?', 'image': 'https://source.unsplash.com/400x200/?personality', 'options': [{'text': 'Seçenek A', 'image': 'https://source.unsplash.com/100x100/?personality,a'}, {'text': 'Seçenek B', 'image': 'https://source.unsplash.com/100x100/?personality,b'}, {'text': 'Seçenek C', 'image': 'https://source.unsplash.com/100x100/?personality,c'}]}, {'question': 'Boş zamanlarında ne yaparsın?', 'image': 'https://source.unsplash.com/400x200/?hobby', 'options': [{'text': 'Seçenek A', 'image': 'https://source.unsplash.com/100x100/?hobby,a'}, {'text': 'Seçenek B', 'image': 'https://source.unsplash.com/100x100/?hobby,b'}, {'text': 'Seçenek C', 'image': 'https://source.unsplash.com/100x100/?hobby,c'}]}, {'question': 'Kendini nasıl tanımlarsın?', 'image': 'https://source.unsplash.com/400x200/?self', 'options': [{'text': 'Seçenek A', 'image': 'https://source.unsplash.com/100x100/?self,a'}, {'text': 'Seçenek B', 'image': 'https://source.unsplash.com/100x100/?self,b'}, {'text': 'Seçenek C', 'image': 'https://source.unsplash.com/100x100/?self,c'}]}, {'question': 'En çok etkilendiğin şey nedir?', 'image': 'https://source.unsplash.com/400x200/?emotion', 'options': [{'text': 'Seçenek A', 'image': 'https://source.unsplash.com/100x100/?emotion,a'}, {'text': 'Seçenek B', 'image': 'https://source.unsplash.com/100x100/?emotion,b'}, {'text': 'Seçenek C', 'image': 'https://source.unsplash.com/100x100/?emotion,c'}]}],
    resultLogic: {
      type: "basic",
      results: [
        "Sen enerjik bir karaktersin!",
        "Sen sakin ve düşüncelisin.",
        "Sen yaratıcı ve hayalperestsin."
      ]
    }
  };
}

window.generateAITestFromAdmin = async function () {
  const test = generateTestWithResult();
  try {
    await addDoc(collection(db, 'tests'), {
      title: test.title,
      questions: test.questions,
      resultLogic: test.resultLogic,
      createdAt: new Date()
    });
    alert("Yapay zeka ile test (5-8 soru ve sonuçlu) üretildi ve eklendi!");
  } catch (err) {
    alert("Test üretilemedi: " + err.message);
  }
};
