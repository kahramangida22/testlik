import React, { useEffect, useState } from "react";
import { getCategories } from "../utils/firestoreApi";
import { Link } from "react-router-dom";

const Categories = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  return (
    <div className="container">
      <h1>Kategoriler</h1>
      <div className="category-list">
        {categories.map(cat => (
          <Link key={cat.id} to={`/categories/${cat.id}`} className="cat-card">
            {cat.name}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Categories;
