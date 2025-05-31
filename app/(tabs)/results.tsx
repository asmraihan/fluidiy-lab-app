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
  const [analyzedImageUri, setAnalyzedImageUri] = useState<string | null>(null);

  useEffect(() => {
    if (currentImage && currentImage !== analyzedImageUri) {
      performAnalysis();
      setAnalyzedImageUri(currentImage);
    } else if (currentResult && !selectedResult) {
      setSelectedResult(currentResult);
    } else if (historyResults.length > 0 && !selectedResult) {
      setSelectedResult(historyResults[0]);
    }
  }, [currentImage]); // Only depend on currentImage changes

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
    setAnalyzedImageUri(null); // Reset the analyzed image tracking
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

  // Loading State
  if (isAnalyzing) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#0078D7" />
        <Text className="font-inter-semibold text-xl text-gray-900 mt-6">
          Analyzing test strip...
        </Text>
        <Text className="font-inter-regular text-base text-gray-500 mt-2">
          This may take a few moments
        </Text>
      </View>
    );
  }

  // Empty State
  if (!selectedResult && historyResults.length === 0) {
    return (
      <View className="flex-1 justify-center items-center p-6 bg-white">
        <View className="bg-gray-50 p-8 rounded-2xl items-center max-w-sm w-full">
          <Text className="font-inter-bold text-2xl text-gray-900 mb-3 text-center">
            No Results Yet
          </Text>
          <Text className="font-inter-regular text-base text-gray-600 text-center mb-8">
            Capture a test strip image to see your analysis results here.
          </Text>
          <TouchableOpacity 
            className="flex-row items-center justify-center bg-blue-600 rounded-xl py-4 px-6 w-full"
            onPress={navigateToCamera}
          >
            <Camera size={24} color="#FFFFFF" />
            <Text className="font-inter-semibold text-white text-base ml-2">
              Capture Test Strip
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Main Results View
  return (
    <View className="flex-1 bg-gray-50">
      {/* History Strip */}
      {historyResults.length > 0 && (
        <View className="bg-white border-b border-gray-200">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="py-4 px-4"
          >
            {historyResults.map((result) => (
              <TouchableOpacity
                key={result.id}
                className={`mr-3 rounded-xl overflow-hidden ${
                  selectedResult?.id === result.id 
                    ? 'border-2 border-blue-600' 
                    : 'border border-gray-200'
                }`}
                onPress={() => setSelectedResult(result)}
              >
                <Image
                  source={{ uri: result.imageUri }}
                  className="w-20 h-20"
                  resizeMode="cover"
                />
                <View className={`absolute top-2 right-2 w-6 h-6 rounded-full 
                  ${result.parameters.some(p => p.level !== 'normal') 
                    ? 'bg-amber-500' 
                    : 'bg-emerald-500'} 
                  justify-center items-center`}>
                  {result.parameters.some(p => p.level !== 'normal') ? (
                    <Text className="font-inter-bold text-xs text-white">
                      {result.parameters.filter(p => p.level !== 'normal').length}
                    </Text>
                  ) : (
                    <Check size={14} color="#FFFFFF" />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
      
      {/* Main Content */}
      {selectedResult && (
        <ScrollView className="flex-1">
          {/* Header */}
          <View className="bg-white p-6 border-b border-gray-200">
            <Text className="font-inter-regular text-sm text-gray-500 mb-1">
              {new Date(selectedResult.date).toLocaleDateString()}{' '}
              {new Date(selectedResult.date).toLocaleTimeString()}
            </Text>
            <Text className="font-inter-bold text-2xl text-gray-900">
              Test Strip Analysis
            </Text>
          </View>
          
          {/* Test Strip Image */}
          {selectedResult.imageUri && (
            <View className="m-6 bg-white rounded-xl overflow-hidden shadow-sm">
              <Image
                source={{ uri: selectedResult.imageUri }}
                className="w-full h-[200px]"
                resizeMode="cover"
              />
            </View>
          )}
          
          {/* Results Grid */}
          <View className="p-6">
            <Text className="font-inter-bold text-xl text-gray-900 mb-4">
              Parameters
            </Text>
            
            <View className="space-y-4">
              {selectedResult.parameters.map((param) => (
                <View key={param.name} 
                  className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                  <View className="flex-row justify-between items-center mb-4">
                    <Text className="font-inter-bold text-lg text-gray-900">
                      {param.name}
                    </Text>
                    <View className={`flex-row items-center rounded-full px-3 py-1.5 
                      ${param.level === 'normal' 
                        ? 'bg-emerald-50' 
                        : param.level === 'abnormal' 
                          ? 'bg-amber-50' 
                          : 'bg-red-50'}`}>
                      {getStatusIcon(param.level)}
                      <Text className={`font-inter-medium text-sm ml-1.5
                        ${param.level === 'normal' 
                          ? 'text-emerald-700' 
                          : param.level === 'abnormal' 
                            ? 'text-amber-700' 
                            : 'text-red-700'}`}>
                        {param.level.charAt(0).toUpperCase() + param.level.slice(1)}
                      </Text>
                    </View>
                  </View>
                  
                  <View className="flex-row justify-between">
                    <View className="flex-1 mr-4">
                      <Text className="font-inter-medium text-sm text-gray-500 mb-1">
                        Result
                      </Text>
                      <Text className="font-inter-bold text-xl text-gray-900">
                        {param.value}
                        <Text className="font-inter-regular text-base text-gray-600">
                          {' '}{param.unit}
                        </Text>
                      </Text>
                    </View>
                    
                    <View className="flex-1">
                      <Text className="font-inter-medium text-sm text-gray-500 mb-1">
                        Reference Range
                      </Text>
                      <Text className="font-inter-regular text-base text-gray-900">
                        {param.referenceRange}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>
          
          {/* Action Button */}
          <View className="p-6 pb-8">
            <TouchableOpacity 
              className="flex-row items-center justify-center bg-blue-600 rounded-xl py-4 px-6 shadow-lg shadow-blue-600/30"
              onPress={navigateToCamera}
            >
              <Camera size={20} color="#FFFFFF" />
              <Text className="font-inter-semibold text-white text-base ml-2">
                New Analysis
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
    </View>
  );
}