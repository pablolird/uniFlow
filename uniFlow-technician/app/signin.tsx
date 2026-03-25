import { useState } from "react";
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSession } from "../contexts/AuthContext";

export default function SignIn() {
  const { login, authLoading } = useSession();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    if (!username || !password) {
      setError("Please enter username and password.");
      return;
    }
    try {
      setError(null);
      await login(username, password);
    } catch (e) {
      setError("Invalid credentials. Please try again.");
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 24 }}>
      <Text style={{ fontSize: 24, fontWeight: "700", marginBottom: 32 }}>
        Sign In
      </Text>

      <TextInput
        style={{
          borderWidth: 1,
          borderColor: "#D1D5DB",
          borderRadius: 8,
          padding: 12,
          marginBottom: 16,
          fontSize: 16,
        }}
        placeholder="Username"
        autoCapitalize="none"
        autoCorrect={false}
        value={username}
        onChangeText={setUsername}
      />

      <TextInput
        style={{
          borderWidth: 1,
          borderColor: "#D1D5DB",
          borderRadius: 8,
          padding: 12,
          marginBottom: 8,
          fontSize: 16,
        }}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {error && (
        <Text style={{ color: "#EF4444", marginBottom: 16, fontSize: 14 }}>
          {error}
        </Text>
      )}

      <TouchableOpacity
        onPress={handleLogin}
        disabled={authLoading}
        style={{
          backgroundColor: "#111827",
          borderRadius: 8,
          padding: 14,
          alignItems: "center",
          marginTop: 8,
          opacity: authLoading ? 0.6 : 1,
        }}
      >
        {authLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={{ color: "#fff", fontWeight: "600", fontSize: 16 }}>
            Sign In
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
}
