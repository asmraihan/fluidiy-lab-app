import React, { createContext, useContext, useState, useEffect } from 'react';
import { Alert } from 'react-native'; // Add this import
import { useUser } from './UserContext';
import { fetchAPI } from '@/lib/fetch';

// Define the types for analysis results
export type ParameterResult = {
  name: string;
  value: string;
  level: 'normal' | 'abnormal' | 'critical';
  unit: string;
  referenceRange: string;
};

export type AnalysisResult = {
  id?: number; // Make id optional for new results
  userId: number;
  date: Date;
  imageUri: string;
  parameters: ParameterResult[];
};

// Update the context type definition
type AnalysisContextType = {
  currentImage: string | null;
  setCurrentImage: (uri: string | null) => void;
  isAnalyzing: boolean;
  setIsAnalyzing: (analyzing: boolean) => void;
  currentResult: AnalysisResult | null;
  setCurrentResult: (result: AnalysisResult | null) => void;
  historyResults: AnalysisResult[];
  addResultToHistory: (result: Omit<AnalysisResult, 'id'>) => Promise<void>;
  clearHistory: () => void;
  deleteResult: (resultId: number) => Promise<void>; // Changed from string to number
};

// Create the context
const AnalysisContext = createContext<AnalysisContextType | undefined>(undefined);

// Create the provider component
export const AnalysisProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useUser();
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [currentResult, setCurrentResult] = useState<AnalysisResult | null>(null);
  const [historyResults, setHistoryResults] = useState<AnalysisResult[]>([]);

  // Fetch results when user changes
  useEffect(() => {
    if (user?.id) {
      loadResults();
    }
  }, [user]);

  const loadResults = async () => {
    try {
      const response = await fetchAPI('/(api)/results', {
        method: 'POST',
        body: JSON.stringify({
          action: 'getResults',
          userId: user?.id
        })
      });

      if (response.results) {
        setHistoryResults(response.results.map((r: any) => ({
          ...r.result_data,
          id: r.id,
          date: new Date(r.created_at)
        })));
      }
    } catch (error) {
      console.error('Error loading results:', error);
    }
  };

  // Update the addResultToHistory function signature
  const addResultToHistory = async (result: Omit<AnalysisResult, 'id'>) => {
    if (!user?.id) return;

    try {
      const response = await fetchAPI('/(api)/results', {
        method: 'POST',
        body: JSON.stringify({
          action: 'saveResult',
          userId: user.id,
          result: {
            ...result,
            userId: Number(user.id) // Ensure userId is a number
          }
        })
      });

      if (response.success) {
        setHistoryResults(prev => [response.result, ...prev]);
      }
    } catch (error) {
      console.error('Error saving result:', error);
      Alert.alert('Error', 'Failed to save result');
    }
  };

  // Fix the deleteResult function in AnalysisContext
  const deleteResult = async (resultId: number) => { // Change parameter type to number
    if (!user?.id) {
      console.error('No user ID available');
      return;
    }

    try {
      console.log('Deleting result:', { resultId, userId: user.id });

      const response = await fetchAPI('/(api)/results', {
        method: 'POST',
        body: JSON.stringify({
          action: 'deleteResult',
          userId: Number(user.id), // Ensure userId is a number
          resultId: Number(resultId) // Ensure resultId is a number
        })
      });

      if (response.success) {
        setHistoryResults(prev => prev.filter(r => r.id !== resultId));
        setCurrentResult(curr => curr?.id === resultId ? null : curr);
      } else {
        throw new Error(response.error || 'Failed to delete result');
      }
    } catch (error) {
      console.error('Error deleting result:', error);
      Alert.alert('Error', 'Failed to delete result. Please try again.');
    }
  };

  const clearHistory = () => {
    setHistoryResults([]);
  };

  return (
    <AnalysisContext.Provider
      value={{
        currentImage,
        setCurrentImage,
        isAnalyzing,
        setIsAnalyzing,
        currentResult,
        setCurrentResult,
        historyResults,
        addResultToHistory,
        clearHistory,
        deleteResult
      }}
    >
      {children}
    </AnalysisContext.Provider>
  );
};

// Create a hook to use the context
export const useAnalysis = () => {
  const context = useContext(AnalysisContext);
  if (context === undefined) {
    throw new Error('useAnalysis must be used within an AnalysisProvider');
  }
  return context;
};