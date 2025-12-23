import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import '../global.css';

interface LoadingScreenProps {
  message?: string;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ message = 'Loading...' }) => {
  return (
    <View className="flex-1 justify-center items-center bg-white">
      <ActivityIndicator size="large" color="#3B82F6" />
      <Text className="mt-4 text-lg text-gray-600">{message}</Text>
    </View>
  );
};

export default LoadingScreen;