import {
  createContext,
  useContext,
  useState,
  type PropsWithChildren,
} from "react";

type AsyncLoginType = (username: string, password: string) => Promise<void>;

const AuthContext = createContext<{
  login: AsyncLoginType;
  //   logout: () => void;
  user: string | null;
  authLoading: boolean;
  accessToken: string | null;
  isAuthenticated: boolean;
}>({
  login: async (username: string, password: string) => {},
  //   logout: () => null,
  user: null,
  authLoading: false,
  accessToken: null,
  isAuthenticated: false,
});

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

export function AuthProvider({ children }: PropsWithChildren) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [user, setUser] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(false);
  const isAuthenticated = !!accessToken;

  const login = async (username: string, password: string) => {
    try {
      setAuthLoading(true);

      const response = await fetch(`${API_BASE_URL}/v1/auth/login`, {
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
        throw new Error(response.status.toString());
      }

      const data = await response.json();
      console.log(data);

      setAccessToken(data.access_token);
      setUser(username);
    } catch (e) {
      console.log(e);
      throw e;
    } finally {
      setAuthLoading(false);
    }
  };

  // Logout needed
  // {
  //
  // }

  return (
    <AuthContext.Provider
      value={{ login, accessToken, user, authLoading, isAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// This hook can be used to access the user info.
export function useSession() {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error("useSession must be wrapped in a <SessionProvider />");
  }

  return value;
}
