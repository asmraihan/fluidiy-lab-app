import { View, Text, StatusBar, Image, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'
import { useUser } from "@clerk/clerk-expo";
import { useAuth } from "@clerk/clerk-expo";
import { router } from "expo-router";
import { icons, images } from "@/constants";
import CustomButton from '@/components/CustomButton';

export default function HistoryScreen() {
  const { user } = useUser();
  const { signOut } = useAuth();

  const handleSignOut = () => {
    signOut();
    router.replace("/(auth)/sign-in");
  };

  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-white">
      <Text className='text-blue-500'>expo53 nativewind</Text>
      <StatusBar style="auto" />
      <View className="relative w-full h-[250px]">
        <View className='flex-1 flex-row gap-4 items-center justify-center bg-red-500  mx-10 my-28 rounded-lg'>
          <Text className="text-xl font-JakartaBold text-center  text-white">Log out</Text>
          <TouchableOpacity
            onPress={handleSignOut}
            className=""
          >
            <Image source={icons.out} className="w-4 h-4" />
          </TouchableOpacity>
        </View>
      </View>
      <CustomButton
        title="Browse Home"
        onPress={() => router.push(`/(root)/(tabs)/home`)}
        className="mt-5"
      />
    </SafeAreaView>
  );
}

