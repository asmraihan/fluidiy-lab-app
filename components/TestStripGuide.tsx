import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ArrowDown } from 'lucide-react-native';

export const TestStripGuide = () => {
  return (
    <View style={styles.guideContainer}>
      <View style={styles.topSection}>
        <Text style={styles.guideText}>
          Align test strip within the markers
        </Text>
      </View>
      
      <View style={styles.guideFrame}>
        <View style={styles.corner} />
        <View style={styles.corner} />
        <View style={styles.corner} />
        <View style={styles.corner} />
        
        <View style={styles.centerGuide}>
          <ArrowDown size={32} color="#FFFFFF" />
          <Text style={styles.centerText}>Center Strip Here</Text>
        </View>
      </View>
      
      <View style={styles.bottomSection}>
        <Text style={styles.infoText}>
          Ensure good lighting and keep strip flat
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  guideContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  topSection: {
    width: '100%',
    alignItems: 'center',
    padding: 16,
    marginTop: 20,
  },
  guideText: {
    fontFamily: 'Inter-Bold',
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  guideFrame: {
    width: '80%',
    height: '50%',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderColor: '#0078D7',
    borderWidth: 3,
  },
  centerGuide: {
    alignItems: 'center',
  },
  centerText: {
    fontFamily: 'Inter-Medium',
    color: 'white',
    fontSize: 16,
    marginTop: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  bottomSection: {
    width: '100%',
    alignItems: 'center',
    padding: 16,
    marginBottom: 120,
  },
  infoText: {
    fontFamily: 'Inter-Regular',
    color: 'white',
    fontSize: 14,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});