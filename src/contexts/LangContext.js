import React, { createContext, useEffect, useState } from "react";

export const LangContext = createContext();

const getBrowserLang = () => {
  const l = navigator.language.slice(0, 2);
  return l === "tr" ? "tr" : "en";
};

export const LangProvider = ({ children }) => {
  const [lang, setLang] = useState(() =>
    localStorage.getItem("lang") || getBrowserLang()
  );

  useEffect(() => {
    localStorage.setItem("lang", lang);
  }, [lang]);

  return (
    <LangContext.Provider value={{ lang, setLang }}>
      {children}
    </LangContext.Provider>
  );
};
