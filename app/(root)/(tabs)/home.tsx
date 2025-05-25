import React, { useState } from "react";
import { Image, View, Text, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";

export default function HomeScreen() {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Request permission and pick image
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission required", "Camera roll permissions are required to select an image.");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  // Placeholder for TensorFlow color detection
  const detectColor = async () => {
    setLoading(true);
    // TODO: Integrate TensorFlow color detection here
    setTimeout(() => {
      setLoading(false);
      Alert.alert("Color Detection", "TensorFlow color detection result goes here.");
    }, 1500);
  };

  return (
    <ThemedView className="flex-1 px-10 items-center justify-center bg-transparent">
      <ThemedText type="title" className="mb-2 text-2xl text-center font-bold">
        Image Color Detection
      </ThemedText>
      <Text className="mb-6 text-base text-gray-500 text-center">
        Pick an image and detect dominant colors using TensorFlow.
      </Text>
      <TouchableOpacity
        className="bg-indigo-500 py-3 px-8 rounded-lg mb-6 w-full"
        onPress={pickImage}
      >
        <Text className="text-white text-lg text-center font-semibold">Pick Image</Text>
      </TouchableOpacity>
      {image && (
        <View className="items-center mt-4 w-full">
          <Image source={{ uri: image }} className="w-64 h-64 rounded-xl mb-4 border-2 border-indigo-500" />
          <TouchableOpacity
            className="bg-emerald-500 py-2 px-16 rounded-lg"
            onPress={detectColor}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white text-lg text-center font-semibold">Detect Color</Text>
            )}
          </TouchableOpacity>
        </View>
      )}
    </ThemedView>
  );
}