import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Platform, Alert } from 'react-native';
import { Camera as CameraIcon, Image as ImageIcon, Loader } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useAnalysis } from '@/context/AnalysisContext';
import { TestStripGuide } from '@/components/TestStripGuide';

export default function CameraScreen() {
  const router = useRouter();
  const [cameraType, setCameraType] = useState<'back' | 'front'>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const { setCurrentImage, setIsAnalyzing } = useAnalysis();
  const [showGuide, setShowGuide] = useState(true);
  const cameraRef = useRef<any>(null);

  useEffect(() => {
    requestPermission();
  }, []);

  const handleCapture = async () => {
    if (!cameraRef.current) return;

    try {
      setIsAnalyzing(true);
      const photo = await cameraRef.current.takePictureAsync();

      // Process the image - crop and resize for analysis
      const processedImage = await ImageManipulator.manipulateAsync(
        photo.uri,
        [{ resize: { width: 600 } }],
        { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
      );

      setCurrentImage(processedImage.uri);
      router.push('/(tabs)/results');
    } catch (error) {
      console.error('Error capturing image:', error);
      Alert.alert('Error', 'Failed to capture image. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handlePickImage = async () => {
    try {
      // Request permissions first
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission required",
          "Camera roll permissions are required to select an image."
        );
        return;
      }

      setIsAnalyzing(true);
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "images",
        allowsEditing: true,
        aspect: [3, 4],
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        // Process the selected image
        const processedImage = await ImageManipulator.manipulateAsync(
          result.assets[0].uri,
          [{ resize: { width: 600 } }],
          { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
        );

        setCurrentImage(processedImage.uri);
        router.push('/(tabs)/results');
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const toggleGuide = () => {
    setShowGuide(!showGuide);
  };

  if (!permission?.granted) {
    // Camera permissions are not granted yet
    return (
      <View style={styles.container}>
        <Text style={styles.text}>We need your permission to use the camera</Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {Platform.OS === 'web' ? (
        <View style={styles.webCameraPlaceholder}>
          <Text style={styles.text}>Camera not available on web</Text>
          <Text style={styles.subText}>Please upload an image instead</Text>
          <TouchableOpacity style={styles.button} onPress={handlePickImage}>
            <ImageIcon size={24} color="#FFFFFF" />
            <Text style={styles.buttonText}>Upload Image</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <CameraView
          ref={cameraRef}
          style={styles.camera}
          facing={cameraType}
          onMountError={(error) => {
            console.error('Camera error:', error);
          }}
        >
          {showGuide && <TestStripGuide />}

          <View style={styles.controls}>
            <TouchableOpacity
              style={styles.guideButton}
              onPress={toggleGuide}
            >
              <Text style={styles.guideButtonText}>
                {showGuide ? 'Hide Guide' : 'Show Guide'}
              </Text>
            </TouchableOpacity>

            <View style={styles.bottomControls}>
              <TouchableOpacity
                style={styles.galleryButton}
                onPress={handlePickImage}
              >
                <ImageIcon size={24} color="#FFFFFF" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.captureButton}
                onPress={handleCapture}
              >
                <CameraIcon size={32} color="#FFFFFF" />
              </TouchableOpacity>

              <View style={styles.placeholder} />
            </View>
          </View>
        </CameraView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  camera: {
    flex: 1,
  },
  webCameraPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E2E8F0',
  },
  text: {
    fontFamily: 'Inter-Medium',
    fontSize: 18,
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: 8,
  },
  subText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 24,
  },
  controls: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 16,
  },
  bottomControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  captureButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#0078D7',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  galleryButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholder: {
    width: 48,
    height: 48,
  },
  guideButton: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 8,
    borderRadius: 8,
    marginTop: 16,
  },
  guideButtonText: {
    fontFamily: 'Inter-Medium',
    color: 'white',
    fontSize: 14,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0078D7',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginTop: 16,
  },
  buttonText: {
    fontFamily: 'Inter-Medium',
    color: 'white',
    marginLeft: 8,
    fontSize: 16,
  },
});