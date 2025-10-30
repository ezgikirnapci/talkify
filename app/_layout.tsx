import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "fade", // genel fade efekti
        presentation: "card",
        gestureEnabled: true,
      }}
    >
      <Stack.Screen name="index" options={{ animation: "fade" }} />
      <Stack.Screen name="register" options={{ animation: "fade" }} />
      <Stack.Screen name="home" options={{ animation: "fade" }} />
      <Stack.Screen name="aiChat" options={{ animation: "fade" }} />
    </Stack>
  );
}
