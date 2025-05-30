import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
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
      case 'normal':
        return '#10B981';
      case 'abnormal':
        return '#FFB900';
      case 'critical':
        return '#E81123';
      default:
        return '#64748B';
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

  const renderHistoryItem = (result: AnalysisResult) => {
    const isSelected = selectedResult?.id === result.id;
    const abnormalCount = result.parameters.filter(p => p.level !== 'normal').length;
    
    return (
      <TouchableOpacity
        key={result.id}
        style={[
          styles.historyItem,
          isSelected && styles.selectedHistoryItem,
        ]}
        onPress={() => setSelectedResult(result)}
      >
        <Text style={styles.historyDate}>
          {new Date(result.date).toLocaleDateString()}
        </Text>
        {abnormalCount > 0 ? (
          <View style={styles.abnormalBadge}>
            <Text style={styles.abnormalBadgeText}>{abnormalCount}</Text>
          </View>
        ) : (
          <View style={styles.normalBadge}>
            <Check size={12} color="#FFFFFF" />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  if (isAnalyzing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0078D7" />
        <Text style={styles.loadingText}>Analyzing test strip...</Text>
        <Text style={styles.loadingSubText}>This may take a few moments</Text>
      </View>
    );
  }

  if (!selectedResult && historyResults.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>No Results Yet</Text>
        <Text style={styles.emptyText}>
          Capture a test strip image to see your analysis results here.
        </Text>
        <TouchableOpacity style={styles.captureButton} onPress={navigateToCamera}>
          <Camera size={24} color="#FFFFFF" />
          <Text style={styles.captureButtonText}>Capture Test Strip</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {historyResults.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.historyContainer}
        >
          {historyResults.map(renderHistoryItem)}
        </ScrollView>
      )}
      
      {selectedResult && (
        <ScrollView style={styles.resultContainer}>
          <View style={styles.header}>
            <Text style={styles.dateText}>
              {new Date(selectedResult.date).toLocaleDateString()}{' '}
              {new Date(selectedResult.date).toLocaleTimeString()}
            </Text>
            <Text style={styles.title}>Test Strip Analysis</Text>
          </View>
          
          {selectedResult.imageUri && (
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: selectedResult.imageUri }}
                style={styles.image}
                resizeMode="contain"
              />
            </View>
          )}
          
          <View style={styles.parametersContainer}>
            <Text style={styles.sectionTitle}>Results</Text>
            
            {selectedResult.parameters.map((param) => (
              <View key={param.name} style={styles.parameterCard}>
                <View style={styles.parameterHeader}>
                  <Text style={styles.parameterName}>{param.name}</Text>
                  <View style={[
                    styles.statusBadge,
                    { backgroundColor: getStatusColor(param.level) + '20' }
                  ]}>
                    {getStatusIcon(param.level)}
                    <Text style={[
                      styles.statusText,
                      { color: getStatusColor(param.level) }
                    ]}>
                      {param.level.charAt(0).toUpperCase() + param.level.slice(1)}
                    </Text>
                  </View>
                </View>
                
                <View style={styles.parameterDetails}>
                  <View style={styles.valueContainer}>
                    <Text style={styles.valueLabel}>Result</Text>
                    <Text style={styles.valueText}>{param.value} {param.unit}</Text>
                  </View>
                  
                  <View style={styles.valueContainer}>
                    <Text style={styles.valueLabel}>Reference Range</Text>
                    <Text style={styles.valueText}>{param.referenceRange}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
          
          <View style={styles.actionContainer}>
            <TouchableOpacity 
              style={styles.actionButton} 
              onPress={navigateToCamera}
            >
              <Camera size={20} color="#FFFFFF" />
              <Text style={styles.actionButtonText}>New Analysis</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
  },
  loadingText: {
    fontFamily: 'Inter-Medium',
    fontSize: 18,
    color: '#0F172A',
    marginTop: 16,
  },
  loadingSubText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#64748B',
    marginTop: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F5F7FA',
  },
  emptyTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#0F172A',
    marginBottom: 8,
  },
  emptyText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 24,
  },
  captureButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0078D7',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  captureButtonText: {
    fontFamily: 'Inter-Medium',
    color: 'white',
    marginLeft: 8,
    fontSize: 16,
  },
  historyContainer: {
    padding: 16,
    backgroundColor: 'white',
  },
  historyItem: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E2E8F0',
    borderRadius: 8,
    marginRight: 12,
    padding: 8,
  },
  selectedHistoryItem: {
    backgroundColor: '#0078D7',
  },
  historyDate: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
  },
  abnormalBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#FFB900',
    justifyContent: 'center',
    alignItems: 'center',
  },
  abnormalBadgeText: {
    fontFamily: 'Inter-Bold',
    fontSize: 10,
    color: 'white',
  },
  normalBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultContainer: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    padding: 16,
  },
  dateText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#64748B',
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#0F172A',
    marginTop: 4,
  },
  imageContainer: {
    margin: 16,
    height: 150,
    backgroundColor: 'white',
    borderRadius: 8,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  parametersContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#0F172A',
    marginBottom: 16,
  },
  parameterCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  parameterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  parameterName: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: '#0F172A',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  statusText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    marginLeft: 4,
  },
  parameterDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  valueContainer: {
    flex: 1,
  },
  valueLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#64748B',
    marginBottom: 4,
  },
  valueText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#0F172A',
  },
  actionContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0078D7',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  actionButtonText: {
    fontFamily: 'Inter-Medium',
    color: 'white',
    marginLeft: 8,
    fontSize: 16,
  },
});