import Ionicons from '@expo/vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View,
} from 'react-native';

interface ActivityInProgressProps {
  serviceRequestId: string;
  assetQrToken: string;
}

export default function ActivityInProgress({
  serviceRequestId,
  assetQrToken,
}: ActivityInProgressProps) {
  const [technicianNotes, setTechnicianNotes] = useState('');
  const [mediaFiles, setMediaFiles] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:3000';

  const pickImage = async () => {
    if (mediaFiles.length >= 3) {
      Alert.alert('Limit Reached', 'You can only upload up to 3 images');
      return;
    }

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'We need camera roll permissions');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setMediaFiles([...mediaFiles, result.assets[0].uri]);
    }
  };

  const takePhoto = async () => {
    if (mediaFiles.length >= 3) {
      Alert.alert('Limit Reached', 'You can only upload up to 3 images');
      return;
    }

    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'We need camera permissions');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setMediaFiles([...mediaFiles, result.assets[0].uri]);
    }
  };

  const removeImage = (index: number) => {
    setMediaFiles(mediaFiles.filter((_, i) => i !== index));
  };

  const handleFinishActivity = async () => {
    if (!technicianNotes.trim()) {
      Alert.alert('Notes Required', 'Please add technician notes before finishing');
      return;
    }

    // Navigate to QR scanner to finish activity
    router.push({
      pathname: '/scan/QRScanner',
      params: {
        mode: 'finish',
        serviceRequestId,
        assetQrToken,
        technicianNotes,
        hasMedia: mediaFiles.length > 0 ? 'true' : 'false',
      },
    });
  };

  const uploadMedia = async () => {
    if (mediaFiles.length === 0) return true;

    try {
      const formData = new FormData();

      for (const uri of mediaFiles) {
        const filename = uri.split('/').pop() || 'image.jpg';
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : 'image/jpeg';

        formData.append('files', {
          uri,
          name: filename,
          type,
        } as any);
      }

      const response = await fetch(
        `${API_BASE_URL}/v1/service-requests/${serviceRequestId}/technician-media`,
        {
          method: 'POST',
          body: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to upload media');
      }

      return true;
    } catch (error) {
      console.error('Error uploading media:', error);
      throw error;
    }
  };

  return (
    <ScrollView className="flex-1 bg-white px-5 py-6">
      <View className="items-center mb-6">
        <Ionicons name="construct" size={48} color="#3B82F6" />
        <Text className="text-3xl font-bold mt-3">Activity in Progress</Text>
        <Text className="text-gray-600 text-center mt-2">
          Complete the work and add your notes below
        </Text>
      </View>

      <View className="mb-6">
        <Text className="text-lg font-semibold mb-2">Technician Notes *</Text>
        <TextInput
          className="bg-white border border-gray-300 rounded-md p-4 min-h-32 text-base"
          placeholder="Describe what the problem was and how it was solved"
          placeholderTextColor="#9CA3AF"
          multiline
          numberOfLines={6}
          value={technicianNotes}
          onChangeText={setTechnicianNotes}
          textAlignVertical="top"
        />
      </View>

      <View className="mb-6">
        <Text className="text-lg font-semibold mb-2">
          Photos (Optional - Max 3)
        </Text>

        <View className="flex-row gap-3 mb-4">
          <Pressable
            onPress={takePhoto}
            className="flex-1 bg-blue-500 active:bg-blue-400 rounded-md p-4 items-center"
          >
            <Ionicons name="camera" size={24} color="white" />
            <Text className="text-white font-semibold mt-1">Take Photo</Text>
          </Pressable>

          <Pressable
            onPress={pickImage}
            className="flex-1 bg-blue-500 active:bg-blue-400 rounded-md p-4 items-center"
          >
            <Ionicons name="images" size={24} color="white" />
            <Text className="text-white font-semibold mt-1">From Gallery</Text>
          </Pressable>
        </View>

        {mediaFiles.length > 0 && (
          <View className="flex-row flex-wrap gap-3">
            {mediaFiles.map((uri, index) => (
              <View key={index} className="relative">
                <Image
                  source={{ uri }}
                  className="w-24 h-24 rounded-md"
                  resizeMode="cover"
                />
                <Pressable
                  onPress={() => removeImage(index)}
                  className="absolute top-1 right-1 bg-red-500 rounded-full p-1"
                >
                  <Ionicons name="close" size={16} color="white" />
                </Pressable>
              </View>
            ))}
          </View>
        )}
      </View>

      <Pressable
        onPress={handleFinishActivity}
        disabled={isSubmitting}
        className={`${
          isSubmitting ? 'bg-gray-400' : 'bg-green-600 active:bg-green-500'
        } rounded-md p-5 items-center flex-row justify-center mb-8`}
      >
        {isSubmitting ? (
          <ActivityIndicator color="white" />
        ) : (
          <>
            <Ionicons name="checkmark-circle" size={24} color="white" />
            <Text className="text-white text-lg font-bold ml-2">
              Finish Activity
            </Text>
          </>
        )}
      </Pressable>
    </ScrollView>
  );
}