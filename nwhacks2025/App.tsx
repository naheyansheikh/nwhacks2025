import { ExpoRoot } from "expo-router";
import { registerRootComponent } from "expo";

export default function App() {
  return <ExpoRoot context={require.context(".", true, /\.(js|jsx|ts|tsx)$/)} />;
}

// Register the root component
registerRootComponent(App);
