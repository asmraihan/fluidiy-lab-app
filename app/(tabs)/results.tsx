import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { AlertTriangle, ArrowLeft, Camera, Check } from 'lucide-react-native';
import { useAnalysis, AnalysisResult, ParameterResult } from '@/context/AnalysisContext';
import { analyzeImage } from '@/utils/colorAnalysis';

export default function ResultsScreen() {
  const router = useRouter();
  const { 
    currentImage, 
    isAnalyzing, 
    setIsAnalyzing, 
    currentResult,
    setCurrentResult,
    historyResults,
    addResultToHistory
  } = useAnalysis();
  const [selectedResult, setSelectedResult] = useState<AnalysisResult | null>(null);

  useEffect(() => {
    if (currentImage && !currentResult) {
      performAnalysis();
    } else if (currentResult && !selectedResult) {
      setSelectedResult(currentResult);
    } else if (historyResults.length > 0 && !selectedResult) {
      setSelectedResult(historyResults[0]);
    }
  }, [currentImage, currentResult, historyResults]);

  const performAnalysis = async () => {
    if (!currentImage) return;
    
    setIsAnalyzing(true);
    try {
      // Simulate analysis delay for UI feedback
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Real analysis would happen here using TensorFlow.js
      const result = await analyzeImage(currentImage);
      
      setCurrentResult(result);
      addResultToHistory(result);
      setSelectedResult(result);
    } catch (error) {
      console.error('Analysis error:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const navigateToCamera = () => {
    router.push('/(tabs)/camera');
  };

  const getStatusColor = (level: string) => {
    switch (level) {
      case 'normal': return 'text-emerald-500 bg-emerald-500/20';
      case 'abnormal': return 'text-amber-500 bg-amber-500/20';
      case 'critical': return 'text-red-600 bg-red-600/20';
      default: return 'text-slate-500 bg-slate-500/20';
    }
  };

  const getStatusIcon = (level: string) => {
    switch (level) {
      case 'normal':
        return <Check size={16} color="#10B981" />;
      case 'abnormal':
        return <AlertTriangle size={16} color="#FFB900" />;
      case 'critical':
        return <AlertTriangle size={16} color="#E81123" />;
      default:
        return null;
    }
  };

  if (isAnalyzing) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#0078D7" />
        <Text className="font-inter-medium text-lg text-gray-900 mt-4">
          Analyzing test strip...
        </Text>
        <Text className="font-inter-regular text-sm text-gray-500 mt-2">
          This may take a few moments
        </Text>
      </View>
    );
  }

  if (!selectedResult && historyResults.length === 0) {
    return (
      <View className="flex-1 justify-center items-center p-4 bg-gray-50">
        <Text className="font-inter-bold text-xl text-gray-900 mb-2">
          No Results Yet
        </Text>
        <Text className="font-inter-regular text-base text-gray-500 text-center mb-6">
          Capture a test strip image to see your analysis results here.
        </Text>
        <TouchableOpacity 
          className="flex-row items-center justify-center bg-blue-600 rounded-lg py-3 px-6"
          onPress={navigateToCamera}
        >
          <Camera size={24} color="#FFFFFF" />
          <Text className="font-inter-medium text-white text-base ml-2">
            Capture Test Strip
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      {historyResults.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="bg-white p-4"
        >
          {historyResults.map((result) => {
            const isSelected = selectedResult?.id === result.id;
            const abnormalCount = result.parameters.filter(p => p.level !== 'normal').length;
            
            return (
              <TouchableOpacity
                key={result.id}
                className={`w-20 h-20 justify-center items-center rounded-lg mr-3 ${
                  isSelected ? 'bg-blue-600' : 'bg-gray-200'
                }`}
                onPress={() => setSelectedResult(result)}
              >
                <Text className="font-inter-regular text-xs text-gray-500">
                  {new Date(result.date).toLocaleDateString()}
                </Text>
                {abnormalCount > 0 ? (
                  <View className="absolute top-2 right-2 w-4 h-4 rounded-full bg-amber-500 justify-center items-center">
                    <Text className="font-inter-bold text-[10px] text-white">
                      {abnormalCount}
                    </Text>
                  </View>
                ) : (
                  <View className="absolute top-2 right-2 w-4 h-4 rounded-full bg-emerald-500 justify-center items-center">
                    <Check size={12} color="#FFFFFF" />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}
      
      {selectedResult && (
        <ScrollView className="flex-1 bg-gray-50">
          <View className="p-4">
            <Text className="font-inter-regular text-sm text-gray-500">
              {new Date(selectedResult.date).toLocaleDateString()}{' '}
              {new Date(selectedResult.date).toLocaleTimeString()}
            </Text>
            <Text className="font-inter-bold text-xl text-gray-900 mt-1">
              Test Strip Analysis
            </Text>
          </View>
          
          {selectedResult.imageUri && (
            <View className="mx-4 h-[150px] bg-white rounded-lg overflow-hidden items-center justify-center">
              <Image
                source={{ uri: selectedResult.imageUri }}
                className="w-full h-full"
                resizeMode="contain"
              />
            </View>
          )}
          
          <View className="p-4">
            <Text className="font-inter-bold text-lg text-gray-900 mb-4">
              Results
            </Text>
            
            {selectedResult.parameters.map((param) => (
              <View key={param.name} className="bg-white rounded-lg p-4 mb-3 shadow-sm">
                <View className="flex-row justify-between items-center mb-3">
                  <Text className="font-inter-bold text-base text-gray-900">
                    {param.name}
                  </Text>
                  <View className={`flex-row items-center rounded-full px-2 py-1 ${getStatusColor(param.level)}`}>
                    {getStatusIcon(param.level)}
                    <Text className={`font-inter-medium text-xs ml-1 ${getStatusColor(param.level)}`}>
                      {param.level.charAt(0).toUpperCase() + param.level.slice(1)}
                    </Text>
                  </View>
                </View>
                
                <View className="flex-row justify-between">
                  <View className="flex-1">
                    <Text className="font-inter-regular text-xs text-gray-500 mb-1">
                      Result
                    </Text>
                    <Text className="font-inter-medium text-sm text-gray-900">
                      {param.value} {param.unit}
                    </Text>
                  </View>
                  
                  <View className="flex-1">
                    <Text className="font-inter-regular text-xs text-gray-500 mb-1">
                      Reference Range
                    </Text>
                    <Text className="font-inter-medium text-sm text-gray-900">
                      {param.referenceRange}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
          
          <View className="p-4 pb-8">
            <TouchableOpacity 
              className="flex-row items-center justify-center bg-blue-600 rounded-lg py-3 px-6"
              onPress={navigateToCamera}
            >
              <Camera size={20} color="#FFFFFF" />
              <Text className="font-inter-medium text-white text-base ml-2">
                New Analysis
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
    </View>
  );
}