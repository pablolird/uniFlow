import { Stack } from "expo-router";

export default function IndexLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ title: "Welcome back!" }}
      />
      <Stack.Screen name="activity/[id]" options={{ title: "Activity" }} />
      <Stack.Screen
        name="scan/QRScanner"
        options={{ title: "Scanner" }}
      />
    </Stack>
  );
}
