import React, { Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LangProvider } from "./contexts/LangContext";
import { AuthProvider } from "./contexts/AuthContext";
import { ToastProvider } from "./contexts/ToastContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Tests from "./pages/Tests";
import Categories from "./pages/Categories";
import CategoryTests from "./pages/CategoryTests";
import TestDetail from "./pages/TestDetail";
import Profile from "./pages/Profile";
import AdminPanel from "./pages/AdminPanel";
import AddTest from "./pages/AddTest";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import ErrorBoundary from "./components/ErrorBoundary";

function App() {
  return (
    <ThemeProvider>
      <LangProvider>
        <AuthProvider>
          <ToastProvider>
            <ErrorBoundary>
              <Router>
                <Navbar />
                <Suspense fallback={<div>Yükleniyor...</div>}>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/tests" element={<Tests />} />
                    <Route path="/categories" element={<Categories />} />
                    <Route path="/categories/:id" element={<CategoryTests />} />
                    <Route path="/test/:testId" element={<TestDetail />} />
                    <Route path="/profile/:uid" element={<Profile />} />
                    <Route path="/admin" element={<AdminPanel />} />
                    <Route path="/add-test" element={<AddTest />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              </Router>
            </ErrorBoundary>
          </ToastProvider>
        </AuthProvider>
      </LangProvider>
    </ThemeProvider>
  );
}

export default App;
