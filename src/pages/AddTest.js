import React, { useState, useContext } from "react";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import { AuthContext } from "../contexts/AuthContext";
import { getCategories } from "../utils/firestoreApi";

const AddTest = () => {
  const [title, setTitle] = useState("");
  const [shortDesc, setShortDesc] = useState("");
  const [category, setCategory] = useState("");
  const [questions, setQuestions] = useState([{ q: "", options: ["", "", "", ""], correct: 0 }]);
  const [categories, setCategories] = useState([]);
  const { user } = useContext(AuthContext);

  React.useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  const handleQuestionChange = (idx, field, value) => {
    setQuestions(questions =>
      questions.map((q, i) => i === idx ? { ...q, [field]: value } : q)
    );
  };

  const handleOptionChange = (qIdx, opIdx, value) => {
    setQuestions(questions =>
      questions.map((q, i) => i === qIdx
        ? { ...q, options: q.options.map((op, oi) => oi === opIdx ? value : op) }
        : q
      )
    );
  };

  const handleAddQuestion = () => {
    setQuestions([...questions, { q: "", options: ["", "", "", ""], correct: 0 }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !category) return alert("Başlık ve kategori zorunlu!");
    await addDoc(collection(db, "tests"), {
      title, shortDesc, category,
      questions,
      createdBy: user.uid,
      likes: 0,
      createdAt: Date.now(),
    });
    alert("Test başarıyla eklendi!");
    setTitle(""); setShortDesc(""); setCategory(""); setQuestions([{ q: "", options: ["", "", "", ""], correct: 0 }]);
  };

  return (
    <div className="add-test-form">
      <h1>Test Ekle</h1>
      <form onSubmit={handleSubmit}>
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Başlık" required />
        <input value={shortDesc} onChange={e => setShortDesc(e.target.value)} placeholder="Kısa Açıklama" />
        <select value={category} onChange={e => setCategory(e.target.value)} required>
          <option value="">Kategori Seç</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
        {questions.map((q, qi) => (
          <div key={qi} className="question-block">
            <input value={q.q} onChange={e => handleQuestionChange(qi, "q", e.target.value)} placeholder={`Soru ${qi + 1}`} required />
            {q.options.map((op, oi) => (
              <input
                key={oi}
                value={op}
                onChange={e => handleOptionChange(qi, oi, e.target.value)}
                placeholder={`Şık ${oi + 1}`}
                required
              />
            ))}
            <label>
              Doğru Şık:
              <select value={q.correct} onChange={e => handleQuestionChange(qi, "correct", Number(e.target.value))}>
                {[0, 1, 2, 3].map(n => <option key={n} value={n}>Şık {n + 1}</option>)}
              </select>
            </label>
          </div>
        ))}
        <button type="button" onClick={handleAddQuestion}>Soru Ekle</button>
        <button type="submit">Kaydet</button>
      </form>
    </div>
  );
};

export default AddTest;
