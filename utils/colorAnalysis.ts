import { AnalysisResult, ParameterResult } from '@/context/AnalysisContext';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-react-native';
import { bundleResourceIO, decodeJpeg } from '@tensorflow/tfjs-react-native';
import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';

// Load the TensorFlow.js model from the assets folder
let model: tf.LayersModel | null = null;
let metadata: any = null;

const loadModel = async () => {
  if (!model) {
    await tf.ready();
    try {
      // Load metadata first to get class names
      metadata = require('../assets/model/metadata.json');
      console.log('Classes:', metadata.labels);

      if (Platform.OS === 'web') {
        model = await tf.loadLayersModel('/assets/model/model.json');
      } else {
        const modelJson = require('../assets/model/model.json');
        const modelWeights = [require('../assets/model/weights.bin')];
        
        model = await tf.loadLayersModel(bundleResourceIO(modelJson, modelWeights));
      }
      
      // Warm up the model
      const dummyInput = tf.zeros([1, 224, 224, 3]);
      const warmupResult = await model.predict(dummyInput);
      console.log(dummyInput, 'Warmup result:')
      tf.dispose([dummyInput, warmupResult]);
      
      console.log('Model loaded successfully');
    } catch (error) {
      console.error('Model loading error:', error);
      model = null;
      throw error;
    }
  }
  return model;
};

// Preprocess the image for React Native
const preprocessImage = async (imageUri: string): Promise<tf.Tensor> => {
  if (Platform.OS === 'web') {
    return new Promise((resolve, reject) => {
      const img = new window.Image();
      img.crossOrigin = 'anonymous';
      img.src = imageUri;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        // Set to your model's expected input size
        canvas.width = 224;
        canvas.height = 224;
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject('No canvas context');
        ctx.drawImage(img, 0, 0, 224, 224);
        const imageData = ctx.getImageData(0, 0, 224, 224);
        const input = tf.browser.fromPixels(imageData)
          .toFloat()
          .div(tf.scalar(255))
          .expandDims(0); // [1, 224, 224, 3]
        resolve(input);
      };
      img.onerror = (err) => reject(err);
    });
  } else {
    try {
      console.log('Processing image:', imageUri);
      
      const imgB64 = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64
      });
      
      return tf.tidy(() => {
        const imgBuffer = tf.util.encodeString(imgB64, 'base64').buffer;
        const uint8array = new Uint8Array(imgBuffer);
        
        // Use decodeJpeg from tfjs-react-native, not tf.node
        const decoded = decodeJpeg(uint8array);
        console.log('Decoded image shape:', decoded.shape);
        
        // Resize to model's expected size
        const resized = tf.image.resizeBilinear(decoded, [224, 224]);
        // Normalize and add batch dimension
        return resized.toFloat().div(255.0).expandDims(0);
      });
      
    } catch (error) {
      console.error('Image preprocessing error:', error);
      throw error;
    }
  }
};

// Interpret model predictions (adapt this to your model's output)
const interpretPredictions = (predictions: tf.Tensor): ParameterResult[] => {
  const values = predictions.dataSync();
  const maxIndex = values.indexOf(Math.max(...values));
  const confidence = values[maxIndex] * 100;
  
  return [{
    name: 'Classification',
    value: metadata?.labels[maxIndex] || `Class ${maxIndex}`,
    level: confidence > 70 ? 'high' : confidence > 30 ? 'medium' : 'low',
    unit: '%',
    referenceRange: `Confidence: ${confidence.toFixed(2)}%`,
  }];
};

// The main function to analyze an image
export const analyzeImage = async (imageUri: string): Promise<AnalysisResult> => {
  try {
    const model = await loadModel();
    const processedImage = await preprocessImage(imageUri);
    const predictions = model.predict(processedImage) as tf.Tensor;
    const parameters = interpretPredictions(predictions);
    console.log('Predictions:', parameters);

    return {
      id: Math.random().toString(36).substring(2, 15),
      date: new Date(),
      imageUri,
      parameters,
    };
  } catch (error) {
    console.error('Error analyzing image:', error);
    throw new Error('Failed to analyze the image. Please try again.');
  }
};

// ...colorSimilarity and findClosestMatch functions remain unchanged...