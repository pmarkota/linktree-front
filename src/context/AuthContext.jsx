"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../services/authService";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for token in localStorage on mount
    const token = localStorage.getItem("token");
    if (token) {
      validateAndRestoreSession(token);
    } else {
      setLoading(false);
    }
  }, []);

  const validateAndRestoreSession = async (token) => {
    try {
      const response = await authService.validateToken(token);
      if (response.success) {
        setUser({ token });
      } else {
        // If token is invalid, clear it
        localStorage.removeItem("token");
      }
    } catch (error) {
      console.error("Error validating token:", error);
      localStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  };

  const login = (token) => {
    localStorage.setItem("token", token);
    setUser({ token });
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  if (loading) {
    return null; // or a loading spinner
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
