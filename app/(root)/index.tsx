import { useAuth } from "@clerk/clerk-expo";
import { Redirect } from "expo-router";

// this is the entry point for the app, and it handles the initial redirect based on authentication status.
// it checks if the user is signed in and redirects to the appropriate screen


const Page = () => {
  const { isSignedIn } = useAuth();

  if (isSignedIn) return <Redirect href="/(root)/(tabs)/home" />;

  return <Redirect href="/(auth)/welcome" />;
};

export default Page;
