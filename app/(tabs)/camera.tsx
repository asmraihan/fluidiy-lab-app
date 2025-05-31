import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Platform, Alert } from 'react-native';
import { Camera as CameraIcon, Image as ImageIcon } from 'lucide-react-native';
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
      console.log("ImagePicker result:", result);

      if (!result.canceled && result.assets && result.assets.length > 0) {
        // Process the selected image
        const processedImage = await ImageManipulator.manipulateAsync(
          result.assets[0].uri,
          [{ resize: { width: 600 } }],
          { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
        );
        console.log("currentImage", processedImage.uri);
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
    return (
      <View className="flex-1 bg-gray-50">
        <Text className="font-inter-medium text-lg text-gray-900 text-center mb-2">
          We need your permission to use the camera
        </Text>
        <TouchableOpacity
          className="flex-row items-center justify-center bg-blue-600 rounded-lg py-3 px-6 mt-4"
          onPress={requestPermission}
        >
          <Text className="font-inter-medium text-white text-base ml-2">
            Grant Permission
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      {Platform.OS === 'web' ? (
        <View className="flex-1 justify-center items-center bg-gray-200">
          <Text className="font-inter-medium text-lg text-gray-900 text-center mb-2">
            Camera not available on web
          </Text>
          <Text className="font-inter-regular text-base text-gray-500 text-center mb-6">
            Please upload an image instead
          </Text>
          <TouchableOpacity
            className="flex-row items-center justify-center bg-blue-600 rounded-lg py-3 px-6 mt-4"
            onPress={handlePickImage}
          >
            <ImageIcon size={24} color="#FFFFFF" />
            <Text className="font-inter-medium text-white text-base ml-2">
              Upload Image
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <CameraView
          ref={cameraRef}
          className="flex-1"
          facing={cameraType}
          onMountError={(error) => {
            console.error('Camera error:', error);
          }}
        >
          {showGuide && <TestStripGuide />}

          <View className="flex-1 justify-end p-4">
            <View className="flex-row justify-between items-center mb-6">
              <TouchableOpacity
                className="w-12 h-12 rounded-full bg-black/50 justify-center items-center"
                onPress={handlePickImage}
              >
                <ImageIcon size={24} color="#FFFFFF" />
              </TouchableOpacity>

              <TouchableOpacity
                className="w-18 h-18 p-4 rounded-full bg-blue-600 justify-center items-center shadow-lg"
                onPress={handleCapture}
              >
                <CameraIcon size={32} color="#FFFFFF" />
              </TouchableOpacity>

              <TouchableOpacity
                className="w-12 h-12 rounded-full bg-black/50 justify-center items-center"
                onPress={toggleGuide}
              >
                <Text className="font-inter-medium text-white text-xs">
                  {showGuide ? 'Hide' : 'Guide'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </CameraView>
      )}
    </View>
  );
}