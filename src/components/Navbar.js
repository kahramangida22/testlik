import React from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const loc = useLocation();

  return (
    <nav className="navbar">
      <Link to="/" className={loc.pathname === "/" ? "active" : ""}>Ana Sayfa</Link>
      <Link to="/tests" className={loc.pathname.startsWith("/tests") ? "active" : ""}>Testler</Link>
      <Link to="/categories" className={loc.pathname.startsWith("/categories") ? "active" : ""}>Kategoriler</Link>
      <Link to="/add-test">Test Ekle</Link>
      <Link to="/profile/me">Profilim</Link>
      <Link to="/admin">Admin</Link>
      <Link to="/login">Giriş/Kayıt</Link>
    </nav>
  );
};

export default Navbar;
