import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";

export default function layout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: { backgroundColor: "#fff", paddingTop: 10, borderTopColor: '#D1D5DB', borderTopWidth: 1 },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="(index)"
        options={{
          title: "Scheduled",
          headerShown: false,
          tabBarIcon: ({ color, focused }) =>
            focused ? (
              <Ionicons name="calendar" size={24} color={color} />
            ) : (
              <Ionicons name="calendar-outline" size={24} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="finished"
        options={{
          title: "Finished",
          headerShown: false,
          tabBarIcon: ({ color, focused }) =>
            focused ? (
              <Ionicons name="checkbox" size={24} color={color} />
            ) : (
              <Ionicons name="checkbox-outline" size={24} color={color} />
            ),
        }}
      />
    </Tabs>
  );
}
