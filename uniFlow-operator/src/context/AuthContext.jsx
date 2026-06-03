import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";

const API_URL = import.meta.env.VITE_API_BASE_URL;

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(); // Username
  const [accessToken, setAccessToken] = useState(); // Token
  const [authLoading, setAuthLoading] = useState(true); // Boolean
  let isAuthenticated = !!accessToken;
  const navigate = useNavigate();

  // Use Refresh token on mount to login if possible
  useEffect(() => {
    const RefreshAccessToken = async () => {
      setAuthLoading(true);
      console.log("Starting refresh token update");
      try {
        const res = await fetch(`${API_URL}/v1/auth/refresh`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },

          credentials: "include",
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.message || "Something went wrong");
        }

        const response = await res.json();
        setAccessToken(response.access_token);
        setUser("operator");
      } catch (e) {
        setAccessToken(null);
      } finally {
        setAuthLoading(false);
      }
    };

    RefreshAccessToken();
  }, []);

  const login = async (username, password) => {
    try {
      setAuthLoading(true);
      setAccessToken(null);
      setUser(null);

      const response = await fetch(`${API_URL}/v1/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      if (!response.ok) {
        throw new Error(response.status);
      }

      const data = await response.json();

      console.log(data);

      setAccessToken(data.access_token);
      // This information should be provided by the backend, placeholder for now
      setUser(username);
    } catch (err) {
      setAccessToken(null);
      throw err;
    } finally {
      setAuthLoading(false);
    }
  };

  const logout = async () => {
    try {
      setAuthLoading(true);

      const response = await fetch(`${API_URL}/v1/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        headers: { Authorization: `Bearer ${accessToken}` },
        credentials: "include",
      });

      const data = await response.json();

      console.log(data);

      setAccessToken();
      setUser();
    } catch {
    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, accessToken, authLoading, isAuthenticated, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("Component must be inside AuthProvider");
  }

  return ctx;
}
