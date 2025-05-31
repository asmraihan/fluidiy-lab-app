import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { ChevronDown, ChevronUp, Info, LogOut, User } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

type FAQItem = {
  question: string;
  answer: string;
};

type ParameterInfo = {
  name: string;
  description: string;
  normalRange: string;
  medicalImplications: string[];
};

export default function InformationScreen() {
  const router = useRouter();
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [expandedParam, setExpandedParam] = useState<number | null>(null);

  const handleLogout = useCallback(async () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            await SecureStore.deleteItemAsync('userToken');
            router.replace('/signin');
          }
        }
      ]
    );
  }, [router]);

  const toggleFAQ = (index: number) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  const toggleParam = (index: number) => {
    setExpandedParam(expandedParam === index ? null : index);
  };

  const faqItems: FAQItem[] = [
    {
      question: 'How accurate is the app?',
      answer: 'Our app uses advanced TensorFlow.js technology calibrated specifically for urinalysis test strips. It achieves a minimum of 95% color detection accuracy when used correctly with proper lighting and positioning. However, results should always be confirmed by a healthcare professional.',
    },
    {
      question: 'How do I properly position the test strip?',
      answer: 'For best results, place the test strip on a plain white background. Make sure the strip is centered within the guide markers, all pads are visible, and lighting is even. Avoid shadows and glare on the strip. Follow the on-screen guides for proper positioning.',
    },
    {
      question: 'Can I use any brand of test strip?',
      answer: 'Our app is calibrated to work with most major brands of urinalysis test strips. However, for optimal accuracy, we recommend using strips from established manufacturers like Siemens, Roche, or similar medical-grade products.',
    },
    {
      question: 'What should I do if I get abnormal results?',
      answer: 'If you receive abnormal or critical results, its important to consult with a healthcare professional. This app is designed as a screening tool and not a replacement for medical diagnosis. Always follow up with your doctor for proper evaluation.',
    },
    {
      question: 'How should I store my test strips?',
      answer: 'Test strips should be stored in their original container with the cap tightly closed. Keep them in a cool, dry place away from direct sunlight and moisture. Do not use expired strips as they can provide inaccurate results.',
    },
  ];

  const parameterInfo: ParameterInfo[] = [
    {
      name: 'Glucose',
      description: 'Measures the amount of glucose (sugar) in urine. Normally, urine contains little or no glucose.',
      normalRange: 'Negative (0 mg/dL)',
      medicalImplications: [
        'High levels may indicate diabetes mellitus',
        'Can appear during pregnancy',
        'May indicate kidney disease affecting glucose reabsorption'
      ],
    },
    {
      name: 'Protein',
      description: 'Detects the presence of proteins, primarily albumin, in urine. Healthy kidneys filter proteins from blood and keep them in circulation.',
      normalRange: 'Negative to trace (<20 mg/dL)',
      medicalImplications: [
        'Kidney disease or damage',
        'Urinary tract infection',
        'Temporarily elevated after strenuous exercise',
        'Can indicate preeclampsia during pregnancy'
      ],
    },
    {
      name: 'pH',
      description: 'Measures the acidity or alkalinity of urine. Diet, medications, and certain medical conditions can affect urine pH.',
      normalRange: '4.5-8.0',
      medicalImplications: [
        'Low pH (acidic) may indicate diabetic ketoacidosis',
        'High pH (alkaline) may indicate urinary tract infection',
        'Helps assess kidney stone risk',
        'Can be affected by diet and medications'
      ],
    },
    {
      name: 'Ketones',
      description: 'Detects ketone bodies, which are produced when the body burns fat for energy instead of carbohydrates.',
      normalRange: 'Negative (0 mg/dL)',
      medicalImplications: [
        'Present in diabetic ketoacidosis',
        'May appear during fasting or with low-carbohydrate diets',
        'Can indicate metabolic disorders',
        'May be present during severe vomiting or diarrhea'
      ],
    },
    {
      name: 'Blood',
      description: 'Detects hemoglobin from red blood cells or intact red blood cells in urine, which is not normally visible to the naked eye.',
      normalRange: 'Negative',
      medicalImplications: [
        'Urinary tract infection',
        'Kidney stones',
        'Kidney or bladder injury',
        'Kidney disease',
        'Menstruation in females can cause false positives'
      ],
    },
    {
      name: 'Bilirubin',
      description: 'Detects bilirubin, a waste product from the breakdown of red blood cells, which is not normally found in urine.',
      normalRange: 'Negative',
      medicalImplications: [
        'Liver disease or damage',
        'Bile duct obstruction',
        'Hepatitis',
        'Can indicate jaundice before its visibly apparent'
      ],
    },
    {
      name: 'Urobilinogen',
      description: 'Measures urobilinogen, a product of bilirubin breakdown that is normally present in small amounts in urine.',
      normalRange: '0.1-1.0 mg/dL',
      medicalImplications: [
        'Elevated in liver diseases',
        'Low or absent in bile duct obstruction',
        'Can be increased with hemolytic anemia',
        'Helpful in differentiating types of jaundice'
      ],
    },
    {
      name: 'Specific Gravity',
      description: 'Measures the concentration of particles in urine and indicates how well the kidneys are diluting or concentrating urine.',
      normalRange: '1.005-1.030',
      medicalImplications: [
        'Low values may indicate diabetes insipidus or kidney damage',
        'High values may indicate dehydration',
        'Helps assess kidney function and hydration status',
        'Varies throughout the day based on fluid intake'
      ],
    },
    {
      name: 'Leukocytes',
      description: 'Detects white blood cells in urine, which fight infection and are not normally present in significant numbers.',
      normalRange: 'Negative',
      medicalImplications: [
        'Urinary tract infection',
        'Kidney infection',
        'Inflammation in the urinary tract',
        'Sometimes present with kidney stones'
      ],
    },
    {
      name: 'Nitrite',
      description: 'Detects nitrites produced by certain bacteria that reduce dietary nitrates to nitrites in the urine.',
      normalRange: 'Negative',
      medicalImplications: [
        'Positive result strongly suggests bacterial infection',
        'Commonly used to detect urinary tract infections',
        'Not all bacteria produce nitrites',
        'Requires urine to remain in the bladder for several hours'
      ],
    },
  ];

  return (
    <ScrollView className="flex-1 bg-gray-50">
      {/* User Info Section */}
      <View className="bg-white p-4 mb-4 flex-row justify-between items-center border-b border-gray-200">
        <View className="flex-row items-center">
          <View className="w-10 h-10 rounded-full bg-blue-50 justify-center items-center">
            <User size={24} color="#0078D7" />
          </View>
          <View className="ml-3">
            <Text className="font-inter-medium text-base text-gray-900">John Doe</Text>
            <Text className="font-inter-regular text-sm text-gray-500">john@example.com</Text>
          </View>
        </View>
        <TouchableOpacity 
          className="flex-row items-center p-2 rounded-lg bg-red-50"
          onPress={handleLogout}
        >
          <LogOut size={20} color="#DC2626" />
          <Text className="font-inter-medium text-sm text-red-600 ml-1">Logout</Text>
        </TouchableOpacity>
      </View>

      <View className="p-4 pb-2">
        <Text className="font-inter-bold text-2xl text-gray-900 mb-2">
          Understanding Urinalysis
        </Text>
        <Text className="font-inter-regular text-base text-gray-500 leading-6">
          Learn about test strip parameters and how to get accurate results
        </Text>
      </View>
      
      {/* Parameters Section */}
      <View className="mb-6 px-4">
        <View className="flex-row items-center mb-3">
          <Info size={20} color="#0078D7" />
          <Text className="font-inter-bold text-lg text-gray-900 ml-2">Test Parameters</Text>
        </View>
        
        <Text className="font-inter-regular text-sm text-gray-500 mb-4 leading-5">
          Urinalysis test strips measure multiple parameters that can indicate various health conditions. Tap each parameter to learn more.
        </Text>
        
        {parameterInfo.map((param, index) => (
          <View key={index} className="bg-white rounded-lg mb-2 shadow-sm overflow-hidden">
            <TouchableOpacity
              className="flex-row justify-between items-center p-4"
              onPress={() => toggleParam(index)}
              activeOpacity={0.7}
            >
              <Text className="font-inter-medium text-base text-gray-900">{param.name}</Text>
              {expandedParam === index ? (
                <ChevronUp size={20} color="#64748B" />
              ) : (
                <ChevronDown size={20} color="#64748B" />
              )}
            </TouchableOpacity>
            
            {expandedParam === index && (
              <View className="p-4 pt-0 border-t border-gray-200">
                <Text className="font-inter-regular text-sm text-gray-500 leading-5 mb-3">
                  {param.description}
                </Text>
                
                <View className="flex-row items-center mb-3">
                  <Text className="font-inter-medium text-sm text-gray-900">Normal Range:</Text>
                  <Text className="font-inter-regular text-sm text-gray-500 ml-2">{param.normalRange}</Text>
                </View>
                
                <Text className="font-inter-medium text-sm text-gray-900 mb-2">Medical Implications:</Text>
                {param.medicalImplications.map((implication, idx) => (
                  <View key={idx} className="flex-row mb-2 pl-2">
                    <View className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 mr-2" />
                    <Text className="font-inter-regular text-sm text-gray-500 flex-1 leading-5">
                      {implication}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        ))}
      </View>

      {/* FAQ Section */}
      <View className="mb-6 px-4">
        <View className="flex-row items-center mb-3">
          <Info size={20} color="#0078D7" />
          <Text className="font-inter-bold text-lg text-gray-900 ml-2">Frequently Asked Questions</Text>
        </View>
        
        {faqItems.map((item, index) => (
          <View key={index} className="bg-white rounded-lg mb-2 shadow-sm overflow-hidden">
            <TouchableOpacity
              className="flex-row justify-between items-center p-4"
              onPress={() => toggleFAQ(index)}
              activeOpacity={0.7}
            >
              <Text className="font-inter-medium text-base text-gray-900 flex-1">{item.question}</Text>
              {expandedFAQ === index ? (
                <ChevronUp size={20} color="#64748B" />
              ) : (
                <ChevronDown size={20} color="#64748B" />
              )}
            </TouchableOpacity>
            
            {expandedFAQ === index && (
              <View className="p-4 pt-0 border-t border-gray-200">
                <Text className="font-inter-regular text-sm text-gray-500 leading-5">{item.answer}</Text>
              </View>
            )}
          </View>
        ))}
      </View>

      {/* Tips Section */}
      <View className="mb-6 px-4">
        <View className="flex-row items-center mb-3">
          <Info size={20} color="#0078D7" />
          <Text className="font-inter-bold text-lg text-gray-900 ml-2">Test Accuracy Tips</Text>
        </View>
        
        <View className="bg-white rounded-lg p-4 shadow-sm">
          <Text className="font-inter-medium text-base text-gray-900 mb-3">For best results:</Text>
          
          {[
            "Use fresh test strips that haven't expired",
            "Ensure good, even lighting when capturing the image",
            "Position the strip within the guide marks on screen",
            "Wait the exact amount of time specified by your test strip manufacturer",
            "Avoid touching the test pads with your fingers",
            "Use a plain white background for better contrast"
          ].map((tip, index) => (
            <View key={index} className="flex-row mb-2 pl-2">
              <View className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 mr-2" />
              <Text className="font-inter-regular text-sm text-gray-500 flex-1 leading-5">{tip}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Disclaimer */}
      <View className="p-4 mb-8">
        <Text className="font-inter-regular text-xs text-gray-400 text-center leading-[18px]">
          DISCLAIMER: This app is designed for informational purposes only and is not intended to replace professional medical advice, diagnosis, or treatment. Always consult with a qualified healthcare provider for medical concerns.
        </Text>
      </View>
    </ScrollView>
  );
}