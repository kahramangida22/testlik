import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { db } from "../firebase";
import {
  getDocs, collection, addDoc, deleteDoc, doc, updateDoc
} from "firebase/firestore";

const ADMIN_UID = "QDiJTANIQ8XBlCwf3TMPqO9DXhX2";

const AdminPanel = () => {
  const { user } = useContext(AuthContext);
  const [tests, setTests] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newCat, setNewCat] = useState("");
  const [editCat, setEditCat] = useState({ id: "", name: "" });

  const loadAll = async () => {
    const catSnap = await getDocs(collection(db, "categories"));
    setCategories(catSnap.docs.map(d => ({ id: d.id, ...d.data() })));
    const testSnap = await getDocs(collection(db, "tests"));
    setTests(testSnap.docs.map(d => ({ id: d.id, ...d.data() })));
  };

  useEffect(() => {
    if (user?.uid === ADMIN_UID) loadAll();
  }, [user]);

  const handleAddCat = async (e) => {
    e.preventDefault();
    if (!newCat) return;
    await addDoc(collection(db, "categories"), { name: newCat });
    setNewCat("");
    loadAll();
  };

  const handleDeleteCat = async (id) => {
    await deleteDoc(doc(db, "categories", id));
    loadAll();
  };

  const handleEditCat = async (e) => {
    e.preventDefault();
    await updateDoc(doc(db, "categories", editCat.id), { name: editCat.name });
    setEditCat({ id: "", name: "" });
    loadAll();
  };

  const handleDeleteTest = async (id) => {
    await deleteDoc(doc(db, "tests", id));
    loadAll();
  };

  if (!user || user.uid !== ADMIN_UID) return <div>Yetkiniz yok.</div>;

  return (
    <div className="admin-panel">
      <h1>Admin Panel</h1>
      <section>
        <h2>Kategori Yönetimi</h2>
        <form onSubmit={handleAddCat}>
          <input
            value={newCat}
            onChange={e => setNewCat(e.target.value)}
            placeholder="Yeni kategori adı"
          />
          <button type="submit">Ekle</button>
        </form>
        <ul>
          {categories.map(cat => (
            <li key={cat.id}>
              {editCat.id === cat.id ? (
                <form onSubmit={handleEditCat} style={{ display: "inline" }}>
                  <input
                    value={editCat.name}
                    onChange={e => setEditCat({ ...editCat, name: e.target.value })}
                  />
                  <button type="submit">Kaydet</button>
                  <button type="button" onClick={() => setEditCat({ id: "", name: "" })}>İptal</button>
                </form>
              ) : (
                <>
                  {cat.name}
                  <button onClick={() => setEditCat({ id: cat.id, name: cat.name })}>Düzenle</button>
                  <button onClick={() => handleDeleteCat(cat.id)}>Sil</button>
                </>
              )}
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h2>Testler</h2>
        <ul>
          {tests.map(t => (
            <li key={t.id}>
              {t.title}
              <button onClick={() => handleDeleteTest(t.id)}>Sil</button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default AdminPanel;
