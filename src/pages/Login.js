import React, { useState, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { login, register } = useContext(AuthContext);
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      if (isRegister) {
        await register(email, pass);
      } else {
        await login(email, pass);
      }
      navigate("/");
    } catch (e) {
      setErr("Hatalı giriş: " + e.message);
    }
  };

  return (
    <div className="login-form">
      <h1>{isRegister ? "Kayıt Ol" : "Giriş Yap"}</h1>
      <form onSubmit={handleSubmit}>
        <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="E-posta" required />
        <input value={pass} onChange={e => setPass(e.target.value)} type="password" placeholder="Şifre" required />
        {err && <div className="error">{err}</div>}
        <button type="submit">{isRegister ? "Kayıt Ol" : "Giriş Yap"}</button>
      </form>
      <button onClick={() => setIsRegister(r => !r)}>
        {isRegister ? "Zaten hesabın var mı? Giriş Yap" : "Hesabın yok mu? Kayıt Ol"}
      </button>
    </div>
  );
};

export default Login;
