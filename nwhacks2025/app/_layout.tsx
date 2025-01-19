import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack initialRouteName="index">
      <Stack.Screen
        name="index"
        options={{
          headerTitle: "Login", // Custom header for login screen
        }}
      />
      <Stack.Screen
        name="spacesScreen"
        options={{
          headerTitle: "Spaces", // Custom header for spaces screen
        }}
      />
      <Stack.Screen
        name="signupScreen"
        options={{
          headerTitle: "Sign Up", // Custom header for signup screen
        }}
      />
    </Stack>
  );
}
