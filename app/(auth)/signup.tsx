import React, { useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { ReactNativeModal } from "react-native-modal";
import InputField from "@/components/ui/InputField";
import CustomButton from "@/components/ui/CustomButton";
import { fetchAPI } from "@/lib/fetch";
import  config  from "@/app.config";
export default function SignUpScreen() {
  const router = useRouter();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleSignUp = async () => {
    if (!form.email || !form.password) {
      setError('Email and password are required');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const response = await fetchAPI('/(api)/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'signup', // Add this line
          email: form.email,
          password: form.password,
        }),
      });

      if (!response.token) {
        throw new Error('No token received');
      }

      await SecureStore.setItemAsync('userToken', response.token);
      setShowSuccessModal(true);
    } catch (error) {
      console.log('[SignUp] Error:', error);
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (name: string, value: string) => {
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="flex-1 p-6  mt-20">
        <Text className="font-inter-bold text-3xl text-gray-900 mb-8">
          Create Account
        </Text>

        {error ? (
          <Text className="font-inter-regular text-error mb-4">{error} asd</Text>
        ) : null}

        <View className="">
          <InputField
            label="Email"
            placeholder="Enter email"
            value={form.email}
            onChangeText={(value) => handleChange('email', value)}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <InputField
            label="Password"
            placeholder="Enter password"
            value={form.password}
            onChangeText={(value) => handleChange('password', value)}
            secureTextEntry
          />

          <CustomButton
            title="Sign Up"
            onPress={handleSignUp}
            disabled={loading}
            className="mt-6"
          />
        </View>

        <Text
          className="font-inter-regular text-gray-600 text-center mt-6"
          onPress={() => router.push('/signin')}
        >
          Already have an account?{' '}
          <Text className="font-inter-medium text-primary">Sign In</Text>
        </Text>

        <ReactNativeModal isVisible={showSuccessModal}>
          <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px]">
            <Text className="text-3xl font-inter-bold text-center">
              Success!
            </Text>
            <Text className="text-base text-gray-400 font-inter text-center mt-2">
              Your account has been created successfully.
            </Text>
            <CustomButton
              title="Continue"
              onPress={() => router.replace('/(tabs)')}
              className="mt-5"
            />
          </View>
        </ReactNativeModal>
      </View>
    </ScrollView>
  );
}