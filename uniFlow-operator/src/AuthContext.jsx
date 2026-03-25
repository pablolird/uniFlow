import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";

const API_URL = import.meta.env.VITE_API_BASE_URL;

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(); // Username
  const [accessToken, setAccessToken] = useState(); // Token
  const [authLoading, setAuthLoading] = useState(); // Boolean
  let isAuthenticated = !!accessToken;
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated]);

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

  // LOG OUT METHOD IS MISSING
  // {
  //      
  // }

  return (
    <AuthContext.Provider
      value={{ user, accessToken, authLoading, isAuthenticated, login }}
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

// import {
//   createContext,
//   useContext,
//   useEffect,
//   useState,
//   type ReactNode,
// } from "react";

// type User = {
//   email: string;
//   username: string;
// };

// const API_URL = import.meta.env.VITE_API_URL;

// type AuthContextType = {
//   user: User | null;
//   accessToken: string | null;
//   authLoading: boolean;
//   isAuthenticated: boolean;
//   login: (email: string, password: string) => Promise<void>;
//   logout: () => Promise<void>;
// };

// const AuthContext = createContext<AuthContextType | null>(null);

// interface AuthProviderProps {
//   children: ReactNode;
// }

// export function AuthProvider(props: AuthProviderProps) {
//   const [user, setUser] = useState<User | null>(null);
//   const [authLoading, setAuthLoading] = useState<boolean>(true);
//   const [accessToken, setAccessToken] = useState<string | null>(null);
//   const isAuthenticated = !!accessToken;

//   // Refresh access token on mount - not implemented yet.
// //   useEffect(() => {
// //     const RefreshAccessToken = async () => {
// //       setAuthLoading(true);
// //       try {
// //         const res = await fetch(`${API_URL}/auth/refresh_token`, {
// //           credentials: "include",
// //         });

// //         if (!res.ok) {
// //           const err = await res.json();
// //           throw new Error(err.message || "Something went wrong");
// //         }

// //         const response = await res.json();
// //         setAccessToken(response.data.accessToken);
// //         setUser(response.data.user);
// //       } catch {
// //         setAccessToken(null);
// //       } finally {
// //         setAuthLoading(false);
// //       }
// //     };

// //     RefreshAccessToken();
// //   }, []);

//   const login = async (email: string, password: string) => {
//     setAuthLoading(true);
//     try {
//       const res = await fetch(`${API_URL}/auth/login`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         credentials: "include",
//         body: JSON.stringify({ email, password }),
//       });

//       if (!res.ok) {
//         const err = await res.json();
//         throw new Error(err.message || "Something went wrong");
//       }

//       const response = await res.json();
//       console.log(response);
//       setAccessToken(response.data.accessToken);
//       setUser(response.data.user);
//     } catch (e) {
//       setAccessToken(null);
//         (null);
//       if (e instanceof Error) {
//         throw new Error(e.message);
//       } else {
//         throw new Error("Couldn't authenticate correctly.");
//       }
//     } finally {
//       setAuthLoading(false);
//     }
//   };

//   const logout = async () => {
//     setAuthLoading(true);
//     try {
//       await fetch(`${API_URL}/auth/refresh_token`, {
//         method: "DELETE",
//         credentials: "include",
//       });
//     } finally {
//       setAccessToken(null);
//       setUser(null);
//       setAuthLoading(false);
//     }
//   };

//   return (
//     <AuthContext.Provider
//       value={{ user, accessToken, authLoading, isAuthenticated, login, logout }}
//     >
//       {props.children}
//     </AuthContext.Provider>
//   );
// }

// export function useAuth() {
//   const ctx = useContext(AuthContext);
//   if (!ctx) {
//     throw new Error("Component must be inside AuthProvider");
//   }

//   return ctx;
// }
