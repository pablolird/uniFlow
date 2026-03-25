import { Slot, useRouter, useSegments, useRootNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Title from "../components/Title";
import { AuthProvider, useSession } from "../contexts/AuthContext";

function RootLayoutNav() {
  const { isAuthenticated } = useSession();
  const router = useRouter();
  const segments = useSegments();
  const rootNavigation = useRootNavigation();
  const [isNavigationReady, setNavigationReady] = useState(false);

  useEffect(() => {
    const unsubscribe = rootNavigation?.addListener("state", () => {
      setNavigationReady(true);
    });
    return () => unsubscribe?.();
  }, [rootNavigation]);

  useEffect(() => {
    if (!isNavigationReady) return;

    const inPublicRoute = segments[0] === "signin";

    if (!isAuthenticated && !inPublicRoute) {
      router.replace("/signin");
    } else if (isAuthenticated && inPublicRoute) {
      router.replace("/");
    }
  }, [isNavigationReady, isAuthenticated, segments]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <Title />
      <Slot />
    </SafeAreaView>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  div: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F00",
  },
});
