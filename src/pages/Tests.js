import React, { useEffect, useState, useContext } from "react";
import { getAllTestsForUser } from "../utils/firestoreApi";
import { AuthContext } from "../contexts/AuthContext";
import { Link } from "react-router-dom";

const Tests = () => {
  const [tests, setTests] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      getAllTestsForUser(user.uid).then(setTests);
    }
  }, [user]);

  return (
    <div className="container">
      <h1>Tüm Testler</h1>
      <div className="test-list">
        {tests.map(test => (
          <Link key={test.id} to={`/test/${test.id}`} className={`test-card ${test.isNew ? "new" : ""}`}>
            <h2>{test.title}</h2>
            <p>{test.shortDesc}</p>
            {test.isNew && <span className="badge-new">Yeni!</span>}
            {test.isSolved ? <span className="badge-solved">Çözüldü</span> : null}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Tests;
