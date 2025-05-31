import React, { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { ReactNativeModal } from "react-native-modal";
import InputField from "@/components/ui/InputField";
import CustomButton from "@/components/ui/CustomButton";
import { fetchAPI } from "@/lib/fetch";

export default function SignInScreen() {
  const router = useRouter();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignIn = async () => {
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
          action: 'signin',
          email: form.email,
          password: form.password,
        }),
      });

      if (!response.token) {
        throw new Error('No token received');
      }

      await SecureStore.setItemAsync('userToken', response.token);
      router.replace('/(tabs)');
    } catch (error) {
      console.log('[SignIn] Error:', error);
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
      <View className="flex-1 p-6 mt-20">
        <Text className="font-inter-bold text-3xl text-gray-900 mb-8">
          Welcome Back
        </Text>

        {error ? (
          <Text className="font-inter-regular text-error mb-4">{error}</Text>
        ) : null}

        <View className="">
          <InputField
            label="Email"
            placeholder="Enter email"
            value={form.email}
            onChangeText={(value) => handleChange('email', value)}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            textContentType="emailAddress"
            importantForAutofill="yes"
          />

          <InputField
            label="Password"
            placeholder="Enter password"
            value={form.password}
            onChangeText={(value) => handleChange('password', value)}
            secureTextEntry
            autoComplete="password"
            textContentType="password"
            importantForAutofill="yes"
          />

          <CustomButton
            title="Sign In"
            onPress={handleSignIn}
            disabled={loading}
            className="mt-6"
          />
        </View>

        <Text
          className="font-inter-regular text-gray-600 text-center mt-6"
          onPress={() => router.push('/signup')}
        >
          Don't have an account?{' '}
          <Text className="font-inter-medium text-primary">Sign Up</Text>
        </Text>
      </View>
    </ScrollView>
  );
}