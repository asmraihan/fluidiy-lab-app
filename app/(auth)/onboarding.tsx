import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowRight } from 'lucide-react-native';

export default function OnboardingScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-white">
      <View className="flex-1 justify-center items-center p-6">
        <Image
          source={{ uri: 'https://images.pexels.com/photos/4021775/pexels-photo-4021775.jpeg' }}
          className="w-72 h-72 rounded-3xl mb-8"
        />
        
        <Text className="font-inter-bold text-3xl text-gray-900 text-center mb-4">
          Urinalysis Made Simple
        </Text>
        
        <Text className="font-inter-regular text-lg text-gray-600 text-center mb-8">
          Get accurate urinalysis results instantly with our advanced AI-powered analysis
        </Text>
        
        <TouchableOpacity
          className="bg-primary px-8 py-4 rounded-xl flex-row items-center"
          onPress={() => router.push('/signin')}
        >
          <Text className="font-inter-medium text-white text-lg mr-2">
            Get Started
          </Text>
          <ArrowRight size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}