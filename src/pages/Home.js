import React, { useEffect, useState } from "react";
import { getTrendingTests, getCategories } from "../utils/firestoreApi";
import { Link } from "react-router-dom";

const Home = () => {
  const [trendingTests, setTrendingTests] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    getTrendingTests().then(setTrendingTests);
    getCategories().then(setCategories);
  }, []);

  return (
    <div className="container">
      <section>
        <h1>En Beğenilen Testler</h1>
        <div className="test-list">
          {trendingTests.map(test => (
            <Link key={test.id} to={`/test/${test.id}`} className="test-card">
              <h2>{test.title}</h2>
              <p>{test.shortDesc}</p>
              <span>❤️ {test.likes}</span>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2>Kategoriler</h2>
        <div className="category-list">
          {categories.map(cat => (
            <Link key={cat.id} to={`/categories/${cat.id}`} className="cat-card">
              {cat.name}
            </Link>
          ))}
        </div>
      </section>

      <section className="ads-area">
        <div className="adsense-banner">Reklam Alanı</div>
      </section>
    </div>
  );
};

export default Home;
