import { Slot } from "expo-router";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Title from "../components/Title";
import { ServiceRequestsProvider } from "../contexts/ServiceRequestsContext";

export default function RootLayout() {
  return (
    <ServiceRequestsProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
        <Title />
        <Slot />
      </SafeAreaView>
    </ServiceRequestsProvider>
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