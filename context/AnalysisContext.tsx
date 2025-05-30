import React, { createContext, useContext, useState } from 'react';

// Define the types for analysis results
export type ParameterResult = {
  name: string;
  value: string;
  level: 'normal' | 'abnormal' | 'critical';
  unit: string;
  referenceRange: string;
};

export type AnalysisResult = {
  id: string;
  date: Date;
  imageUri: string;
  parameters: ParameterResult[];
};

// Define the context type
type AnalysisContextType = {
  currentImage: string | null;
  setCurrentImage: (uri: string | null) => void;
  isAnalyzing: boolean;
  setIsAnalyzing: (analyzing: boolean) => void;
  currentResult: AnalysisResult | null;
  setCurrentResult: (result: AnalysisResult | null) => void;
  historyResults: AnalysisResult[];
  addResultToHistory: (result: AnalysisResult) => void;
  clearHistory: () => void;
};

// Create the context
const AnalysisContext = createContext<AnalysisContextType | undefined>(undefined);

// Create the provider component
export const AnalysisProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [currentResult, setCurrentResult] = useState<AnalysisResult | null>(null);
  const [historyResults, setHistoryResults] = useState<AnalysisResult[]>([]);

  const addResultToHistory = (result: AnalysisResult) => {
    setHistoryResults((prev) => [result, ...prev]);
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