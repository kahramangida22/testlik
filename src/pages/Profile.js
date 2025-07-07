import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useParams } from "react-router-dom";
import { getAllTestsForUser } from "../utils/firestoreApi";

const Profile = () => {
  const { user } = useContext(AuthContext);
  const { uid } = useParams();
  const [solvedTests, setSolvedTests] = useState([]);

  useEffect(() => {
    if (user && user.uid === uid) {
      getAllTestsForUser(user.uid).then(tests => {
        setSolvedTests(tests.filter(t => t.isSolved));
      });
    }
  }, [user, uid]);

  if (!user || user.uid !== uid) return <div>Profil görüntülenemiyor.</div>;

  return (
    <div className="profile-page">
      <h1>{user.email}</h1>
      <h2>Çözdüğün Testler</h2>
      <ul>
        {solvedTests.map(t => (
          <li key={t.id}>{t.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default Profile;
