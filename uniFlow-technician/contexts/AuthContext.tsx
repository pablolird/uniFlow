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
  technicianId: string | null;
  isAuthenticated: boolean;
}>({
  login: async (_username: string, _password: string) => {},
  //   logout: () => null,
  user: null,
  authLoading: false,
  accessToken: null,
  technicianId: null,
  isAuthenticated: false,
});

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;


export function AuthProvider({ children }: PropsWithChildren) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [technicianId, setTechnicianId] = useState<string | null>(null);
  const [user, setUser] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(false);
  const isAuthenticated = !!accessToken;

  const login = async (username: string, password: string) => {
    try {
      setAuthLoading(true);

      const loginResponse = await fetch(`${API_BASE_URL}/v1/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!loginResponse.ok) {
        throw new Error(loginResponse.status.toString());
      }

      const { access_token } = await loginResponse.json();

      const profileResponse = await fetch(`${API_BASE_URL}/v1/auth/profile`, {
        headers: { Authorization: `Bearer ${access_token}` },
      });

      if (!profileResponse.ok) {
        throw new Error(profileResponse.status.toString());
      }

      const profile = await profileResponse.json();

      setAccessToken(access_token);
      setTechnicianId(profile.technicianId ?? null);
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
      value={{ login, accessToken, technicianId, user, authLoading, isAuthenticated }}
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
