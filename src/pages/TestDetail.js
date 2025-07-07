import React, { useEffect, useState, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getTestById, saveUserAnswer, likeTest, getNextUnsolvedTest } from "../utils/firestoreApi";
import { AuthContext } from "../contexts/AuthContext";

const TestDetail = () => {
  const { testId } = useParams();
  const { user } = useContext(AuthContext);
  const [test, setTest] = useState(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selected, setSelected] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    getTestById(testId).then(testData => {
      setTest(testData);
      setLikeCount(testData.likes);
      setIsLiked(testData.likedBy?.includes(user?.uid));
    });
  }, [testId, user]);

  if (!test) return <div>Yükleniyor...</div>;

  const handleOptionClick = (optionIdx) => {
    if (selected !== null) return;
    setSelected(optionIdx);

    const isCorrect = optionIdx === test.questions[currentQ].correct;
    if (isCorrect) setScore(score + 10);

    if (user) {
      saveUserAnswer(user.uid, testId, currentQ, optionIdx, isCorrect);
    }

    setTimeout(() => {
      setSelected(null);
      if (currentQ + 1 < test.questions.length) {
        setCurrentQ(currentQ + 1);
      } else {
        setShowResult(true);
      }
    }, 900);
  };

  const handleLike = () => {
    if (user && !isLiked) {
      likeTest(testId, user.uid).then(() => {
        setIsLiked(true);
        setLikeCount(likeCount + 1);
      });
    }
  };

  const handleContinue = async () => {
    const nextTest = await getNextUnsolvedTest(user.uid, test.category, [testId]);
    if (nextTest) {
      navigate(`/test/${nextTest.id}`);
    } else {
      navigate("/tests");
    }
  };

  return (
    <div className="test-detail">
      <h1>{test.title}</h1>
      <p>{test.description}</p>
      <div className="like-row">
        <button className={`like-btn ${isLiked ? "liked" : ""}`} onClick={handleLike}>❤️</button>
        <span>{likeCount}</span>
      </div>

      {!showResult ? (
        <div className="question-card">
          <div className="q-index">Soru {currentQ + 1}/{test.questions.length}</div>
          <div className="question-text">{test.questions[currentQ].q}</div>
          <div className="options">
            {test.questions[currentQ].options.map((op, i) => (
              <button
                key={i}
                className={
                  selected === null
                    ? ""
                    : i === test.questions[currentQ].correct
                      ? "correct"
                      : selected === i
                        ? "wrong"
                        : "disabled"
                }
                onClick={() => handleOptionClick(i)}
                disabled={selected !== null}
              >
                {op}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="test-result">
          <h2>Puanın: {score}</h2>
          <button onClick={handleContinue}>Aynı kategoriden yeni test çöz</button>
          <Link to="/tests" className="btn">Testlere Dön</Link>
        </div>
      )}

      <div className="ads-area">
        <div className="adsense-banner">Reklam Alanı</div>
      </div>
    </div>
  );
};

export default TestDetail;
