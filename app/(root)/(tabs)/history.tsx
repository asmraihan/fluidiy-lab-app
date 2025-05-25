import { View, Text, StatusBar, Image, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'
import { useUser } from "@clerk/clerk-expo";
import { useClerk } from '@clerk/clerk-expo'
import * as Linking from 'expo-linking'

import { router } from "expo-router";
import { icons, images } from "@/constants";
import CustomButton from '@/components/CustomButton';

export default function HistoryScreen() {
  const { user } = useUser();
  const { signOut } = useClerk()

  // const handleSignOut = () => {
  //   signOut();
  //   router.replace("/(auth)/sign-in");
  // };

  const handleSignOut = async () => {
    console.log(user)

    try {
      await signOut()
      // Redirect to your desired page
      Linking.openURL(Linking.createURL('/(auth)/sign-in'))
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2))
    }
  }

  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-white">
      <Text className='text-blue-500'>expo53 nativewind</Text>
      <StatusBar style="auto" />
      <CustomButton
        title="Browse Home"
        onPress={() => router.push(`/(root)/(tabs)/home`)}
        className="mt-5"
      />
      <CustomButton
        title="Sign Out"
        onPress={handleSignOut}
        className="mt-5 bg-red-500"
      />
    </SafeAreaView>
  );
}

