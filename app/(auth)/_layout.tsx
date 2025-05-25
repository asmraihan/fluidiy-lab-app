import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

const Layout = () => {
  return (
    <>
      <StatusBar style="light"
      backgroundColor="transparent"
      translucent
      />
      <Stack>
        <Stack.Screen name="welcome" options={{ headerShown: false }} />
        <Stack.Screen name="sign-up" options={{ headerShown: false }} />
        <Stack.Screen name="sign-in" options={{ headerShown: false }} />
      </Stack>
    </>
  );
};

export default Layout;