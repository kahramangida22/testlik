import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

const CategoryTests = () => {
  const { id } = useParams();
  const [tests, setTests] = useState([]);

  useEffect(() => {
    const getTests = async () => {
      const q = query(collection(db, "tests"), where("category", "==", id));
      const snap = await getDocs(q);
      setTests(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    };
    getTests();
  }, [id]);

  return (
    <div className="container">
      <h1>Kategorideki Testler</h1>
      <div className="test-list">
        {tests.map(test => (
          <Link key={test.id} to={`/test/${test.id}`} className="test-card">
            <h2>{test.title}</h2>
            <p>{test.shortDesc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoryTests;
