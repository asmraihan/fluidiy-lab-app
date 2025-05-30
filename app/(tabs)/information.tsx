import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
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
    <ScrollView style={styles.container}>
      {/* User Info Section */}
      <View style={styles.userSection}>
        <View style={styles.userInfo}>
          <View style={styles.avatarPlaceholder}>
            <User size={24} color="#0078D7" />
          </View>
          <View style={styles.userDetails}>
            <Text style={styles.userName}>John Doe</Text>
            <Text style={styles.userEmail}>john@example.com</Text>
          </View>
        </View>
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <LogOut size={20} color="#DC2626" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.header}>
        <Text style={styles.title}>Understanding Urinalysis</Text>
        <Text style={styles.subtitle}>
          Learn about test strip parameters and how to get accurate results
        </Text>
      </View>
      
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Info size={20} color="#0078D7" />
          <Text style={styles.sectionTitle}>Test Parameters</Text>
        </View>
        
        <Text style={styles.sectionDescription}>
          Urinalysis test strips measure multiple parameters that can indicate various health conditions. Tap each parameter to learn more.
        </Text>
        
        {parameterInfo.map((param, index) => (
          <View key={index} style={styles.infoCard}>
            <TouchableOpacity
              style={styles.infoHeader}
              onPress={() => toggleParam(index)}
              activeOpacity={0.7}
            >
              <Text style={styles.infoTitle}>{param.name}</Text>
              {expandedParam === index ? (
                <ChevronUp size={20} color="#64748B" />
              ) : (
                <ChevronDown size={20} color="#64748B" />
              )}
            </TouchableOpacity>
            
            {expandedParam === index && (
              <View style={styles.infoContent}>
                <Text style={styles.infoText}>{param.description}</Text>
                
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Normal Range:</Text>
                  <Text style={styles.infoValue}>{param.normalRange}</Text>
                </View>
                
                <Text style={styles.infoLabel}>Medical Implications:</Text>
                {param.medicalImplications.map((implication, idx) => (
                  <View key={idx} style={styles.bulletItem}>
                    <View style={styles.bullet} />
                    <Text style={styles.bulletText}>{implication}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        ))}
      </View>
      
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Info size={20} color="#0078D7" />
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
        </View>
        
        {faqItems.map((item, index) => (
          <View key={index} style={styles.faqCard}>
            <TouchableOpacity
              style={styles.faqQuestion}
              onPress={() => toggleFAQ(index)}
              activeOpacity={0.7}
            >
              <Text style={styles.questionText}>{item.question}</Text>
              {expandedFAQ === index ? (
                <ChevronUp size={20} color="#64748B" />
              ) : (
                <ChevronDown size={20} color="#64748B" />
              )}
            </TouchableOpacity>
            
            {expandedFAQ === index && (
              <View style={styles.faqAnswer}>
                <Text style={styles.answerText}>{item.answer}</Text>
              </View>
            )}
          </View>
        ))}
      </View>
      
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Info size={20} color="#0078D7" />
          <Text style={styles.sectionTitle}>Test Accuracy Tips</Text>
        </View>
        
        <View style={styles.tipCard}>
          <Text style={styles.tipTitle}>For best results:</Text>
          
          <View style={styles.bulletItem}>
            <View style={styles.bullet} />
            <Text style={styles.bulletText}>
              Use fresh test strips that haven't expired
            </Text>
          </View>
          
          <View style={styles.bulletItem}>
            <View style={styles.bullet} />
            <Text style={styles.bulletText}>
              Ensure good, even lighting when capturing the image
            </Text>
          </View>
          
          <View style={styles.bulletItem}>
            <View style={styles.bullet} />
            <Text style={styles.bulletText}>
              Position the strip within the guide marks on screen
            </Text>
          </View>
          
          <View style={styles.bulletItem}>
            <View style={styles.bullet} />
            <Text style={styles.bulletText}>
              Wait the exact amount of time specified by your test strip manufacturer
            </Text>
          </View>
          
          <View style={styles.bulletItem}>
            <View style={styles.bullet} />
            <Text style={styles.bulletText}>
              Avoid touching the test pads with your fingers
            </Text>
          </View>
          
          <View style={styles.bulletItem}>
            <View style={styles.bullet} />
            <Text style={styles.bulletText}>
              Use a plain white background for better contrast
            </Text>
          </View>
        </View>
      </View>
      
      <View style={styles.disclaimer}>
        <Text style={styles.disclaimerText}>
          DISCLAIMER: This app is designed for informational purposes only and is not intended to replace professional medical advice, diagnosis, or treatment. Always consult with a qualified healthcare provider for medical concerns.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    padding: 16,
    paddingBottom: 8,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#0F172A',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#64748B',
    lineHeight: 24,
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#0F172A',
    marginLeft: 8,
  },
  sectionDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#64748B',
    marginBottom: 16,
    lineHeight: 20,
  },
  infoCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    overflow: 'hidden',
  },
  infoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  infoTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#0F172A',
  },
  infoContent: {
    padding: 16,
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  infoText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#0F172A',
    marginBottom: 8,
  },
  infoValue: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#64748B',
    marginLeft: 8,
  },
  bulletItem: {
    flexDirection: 'row',
    marginBottom: 8,
    paddingLeft: 8,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#0078D7',
    marginTop: 6,
    marginRight: 8,
  },
  bulletText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#64748B',
    flex: 1,
    lineHeight: 20,
  },
  faqCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    overflow: 'hidden',
  },
  faqQuestion: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  questionText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#0F172A',
    flex: 1,
  },
  faqAnswer: {
    padding: 16,
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  answerText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
  },
  tipCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  tipTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#0F172A',
    marginBottom: 12,
  },
  disclaimer: {
    padding: 16,
    marginBottom: 32,
  },
  disclaimerText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 18,
  },
  userSection: {
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F9FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userDetails: {
    marginLeft: 12,
  },
  userName: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#0F172A',
  },
  userEmail: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#64748B',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#FEE2E2',
  },
  logoutText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#DC2626',
    marginLeft: 4,
  },
});