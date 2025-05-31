import React from 'react';
import { View, Text } from 'react-native';
import { ArrowDown } from 'lucide-react-native';

export const TestStripGuide = () => {
  return (
    <View className="absolute w-full h-full justify-between items-center bg-black/30">
      <View className="w-full items-center p-4 mt-12">
        <Text className="font-inter-bold text-white text-lg text-center shadow-text">
          Align test strip within the markers
        </Text>
      </View>
      
      <View className="w-4/5 h-1/2 border-2 border-white/70 rounded-xl justify-center items-center relative ">
        {/* Top Left Corner */}
        <View className="absolute top-0 left-0 w-5 h-5 border-blue-600 border-3" />
        {/* Top Right Corner */}
        <View className="absolute top-0 right-0 w-5 h-5 border-blue-600 border-3" />
        {/* Bottom Left Corner */}
        <View className="absolute bottom-0 left-0 w-5 h-5 border-blue-600 border-3" />
        {/* Bottom Right Corner */}
        <View className="absolute bottom-0 right-0 w-5 h-5 border-blue-600 border-3" />
        
        <View className="items-center opacity-70">
          <ArrowDown size={32} color="#FFFFFF" />
          <Text className="font-inter-medium text-white text-base mt-2 shadow-text">
            Center Strip Here
          </Text>
        </View>
      </View>
      
      <View className="w-full items-center p-4 mb-28">
        <Text className="font-inter-regular text-white text-sm text-center shadow-text">
          Ensure good lighting and keep strip flat
        </Text>
      </View>
    </View>
  );
};