import { View, Text, StatusBar, Image, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'
import { useUser } from "@clerk/clerk-expo";
import { useAuth } from "@clerk/clerk-expo";
import { router } from "expo-router";
import { icons, images } from "@/constants";

export default function HistoryScreen() {
  const { user } = useUser();
  const { signOut } = useAuth();

  const handleSignOut = () => {
    signOut();
    router.replace("/(auth)/sign-in");
  };

  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-white">
      <Text className='text-red-500'>expo52 nativewind</Text>
      <StatusBar style="auto" />
      <TouchableOpacity
        onPress={handleSignOut}
        className="justify-center items-center w-10 h-10 rounded-full bg-white"
      >
        <Image source={icons.out} className="w-4 h-4" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

