import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { AlertTriangle, Camera, Info, Upload } from 'lucide-react-native';
import { useAnalysis } from '@/context/AnalysisContext';

export default function HomeScreen() {
  const router = useRouter();
  const { historyResults } = useAnalysis();

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-4 pt-6">
        <Text className="font-inter-bold text-2xl text-gray-900 mb-2">
          Urinalysis Test Strip Analyzer
        </Text>
        <Text className="font-inter-regular text-base text-gray-600">
          Analyze urinalysis test strips with medical-grade precision
        </Text>
      </View>

      <View className="mx-4 rounded-xl overflow-hidden h-48 mb-6">
        <Image
          source={{ uri: 'https://images.pexels.com/photos/6823547/pexels-photo-6823547.jpeg' }}
          className="w-full h-full"
          resizeMode="cover"
        />
      </View>

      <View className="flex-row px-4 gap-4 mb-6">
        <TouchableOpacity
          className="flex-1 bg-primary rounded-xl p-4 flex-row items-center justify-center"
          onPress={() => router.push('/camera')}
        >
          <Camera size={24} color="#FFFFFF" />
          <Text className="font-inter-medium text-white ml-2">Capture Strip</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-1 bg-secondary rounded-xl p-4 flex-row items-center justify-center"
          onPress={() => router.push('/results')}
        >
          <Upload size={24} color="#FFFFFF" />
          <Text className="font-inter-medium text-white ml-2">View Results</Text>
        </TouchableOpacity>
      </View>

      <View className="mx-4 bg-white rounded-xl p-4 mb-6 shadow-sm">
        <View className="flex-row items-center mb-3">
          <Info size={20} color="#0078D7" />
          <Text className="font-inter-bold text-lg text-gray-900 ml-2">
            How It Works
          </Text>
        </View>
        <Text className="font-inter-regular text-gray-600 leading-5">
          Our app uses advanced TensorFlow.js technology to analyze the colors on your urinalysis
          test strip and provide accurate readings for 10 different health parameters.
        </Text>
        <TouchableOpacity
          className="mt-4"
          onPress={() => router.push('/information')}
        >
          <Text className="font-inter-medium text-primary">Learn More</Text>
        </TouchableOpacity>
      </View>

      {historyResults.length > 0 && (
        <View className="mx-4 mb-8">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="font-inter-bold text-lg text-gray-900">Recent Results</Text>
            <TouchableOpacity onPress={() => router.push('/results')}>
              <Text className="font-inter-medium text-primary">View All</Text>
            </TouchableOpacity>
          </View>

          <View className="bg-white rounded-xl p-4 shadow-sm">
            <Text className="font-inter-medium text-gray-500 mb-3">
              {new Date(historyResults[0].date).toLocaleDateString()}
            </Text>
            <View className="space-y-2">
              {historyResults[0].parameters
                .filter((param) => param.level !== 'normal')
                .slice(0, 3)
                .map((param) => (
                  <View
                    key={param.name}
                    className={`flex-row items-center p-2 rounded-lg ${
                      param.level === 'critical' ? 'bg-red-50' : 'bg-amber-50'
                    }`}
                  >
                    <AlertTriangle
                      size={16}
                      color={param.level === 'critical' ? '#E81123' : '#FFB900'}
                    />
                    <Text className="font-inter-medium text-gray-900 ml-2 flex-1">
                      {param.name}
                    </Text>
                    <Text className="font-inter-medium text-gray-900">
                      {param.value}
                    </Text>
                  </View>
                ))}
            </View>
          </View>
        </View>
      )}
    </ScrollView>
  );
}