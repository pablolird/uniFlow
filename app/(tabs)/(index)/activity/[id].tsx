// app/(tabs)/(index)/activity/[id].tsx
import ActivityInfo from "@/components/ActivityInfo";
import { useServiceRequests } from "@/contexts/ServiceRequestsContext";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as ImagePicker from "expo-image-picker";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  DeviceEventEmitter,
  Image,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import "../../../../global.css";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || "http://localhost:3000";
const FORM_BASE_URL = process.env.EXPO_PUBLIC_FORM_BASE_URL || "http://localhost:5173";

export default function Activity() {
  const { id } = useLocalSearchParams();
  const { scheduledRequests, finishedRequests, refreshRequests } = useServiceRequests();
  const [qrResult, setQrResult] = useState("");
  const [qrError, setQrError] = useState("");
  const [isStarting, setIsStarting] = useState(false);
  const [activityStarted, setActivityStarted] = useState(false);

  // Find the request from either scheduled or finished lists
  const request = [...scheduledRequests, ...finishedRequests].find(
    req => req.id === id
  );

  // Check if activity is already in progress
  useEffect(() => {
    if (request && request.status === "IN_PROGRESS") {
      setActivityStarted(true);
    }
  }, [request]);

  useEffect(() => {
    const sub = DeviceEventEmitter.addListener("qr-scanned", async (data) => {
      console.log("QR result:", data);
      
      // Validate QR format and token
      const isValid = validateQR(data);
      
      if (isValid) {
        setQrResult(data);
        setQrError("");
        
        // Start the activity
        await startActivity();
      } else {
        setQrError("Invalid QR code or does not match this asset");
      }
    });

    return () => sub.remove();
  }, [request]);

  const validateQR = (scannedData: string): boolean => {
    if (!request) return false;

    try {
      // Expected format: {FORM_BASE_URL}/v1/assets/{QR_TOKEN}
      const expectedUrl = `${FORM_BASE_URL}/v1/assets/${request.asset.qr_token}`;
      
      // Accept either the full URL or just the token
      if (scannedData === request.asset.qr_token || scannedData === expectedUrl) {
        return true;
      }

      console.log("IM RETURNING FALSE XD")

      return false;
    } catch (error) {
      console.error("Error validating QR:", error);
      return false;
    }
  };

  const startActivity = async () => {
    if (!request) return;

    setIsStarting(true);
    
    try {
      const response = await fetch(
        `${API_BASE_URL}/v1/service-requests/${request.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: "IN_PROGRESS",
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update service request");
      }

      // Refresh requests to get updated status
      await refreshRequests();
      
      // Navigate to activity in progress screen
      setActivityStarted(true);
      Alert.alert("Success", "Activity started successfully!");
    } catch (error) {
      console.error("Error starting activity:", error);
      Alert.alert("Error", "Failed to start activity. Please try again.");
      setQrError("API call failed");
    } finally {
      setIsStarting(false);
    }
  };

  if (!request) {
    return (
      <View className="flex-1 justify-center items-center px-5">
        <Text className="text-red-500 text-center text-lg mb-4">
          Activity not found
        </Text>
        <Pressable
          onPress={() => router.back()}
          className="bg-blue-500 px-6 py-3 rounded-md"
        >
          <Text className="text-white font-semibold">Go Back</Text>
        </Pressable>
      </View>
    );
  }

  if (activityStarted || request.status === "IN_PROGRESS") {
    return (
      <ActivityInProgress 
        serviceRequestId={request.id} 
        assetQrToken={request.asset.qr_token}
      />
    );
  }

  return (
    <KeyboardAvoidingView
      keyboardVerticalOffset={120}
      behavior="padding"
      className="border-t flex-1 border-t-gray-300 px-3 py-5"
    >
      <ScrollView>
        <ActivityInfo request={request} />

        <View className="items-center pb-5 mt-6">
          <Text className="text-2xl text-center font-semibold mb-4">Start Activity</Text>
          <Text className="text-center text-gray-600 mb-6 px-4">
            Scan the QR code on the asset to begin this service request
          </Text>

          {qrResult !== "" ? (
            <View className="items-center">
              <Ionicons name="checkmark-circle" size={64} color="#10B981" />
              <Text className="mt-3 text-lg font-semibold text-green-600">
                QR Code Scanned!
              </Text>
              {isStarting && (
                <ActivityIndicator size="large" color="#3B82F6" className="mt-4" />
              )}
            </View>
          ) : (
            <>
              <Pressable
                className="flex-row justify-center w-2/3 items-center p-4 bg-blue-500 active:bg-blue-400 rounded-md"
                onPress={() => {
                  setQrError("");
                  router.push({
                    pathname: "/scan/QRScanner",
                    params: { mode: "start" }
                  });
                }}
              >
                <Ionicons className="pr-1" name="qr-code-outline" color={'white'} size={24}/>
                <Text className="text-white text-xl ml-2">Scan QR Code</Text>
              </Pressable>
              
              {qrError && (
                <View className="mt-4 bg-red-50 border border-red-200 rounded-md p-3">
                  <Text className="text-red-600 text-center">{qrError}</Text>
                </View>
              )}
            </>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// Activity In Progress Component
function ActivityInProgress({ 
  serviceRequestId, 
  assetQrToken 
}: { 
  serviceRequestId: string; 
  assetQrToken: string;
}) {
  const [technicianNotes, setTechnicianNotes] = useState("");
  const [mediaFiles, setMediaFiles] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { refreshRequests } = useServiceRequests();

  useEffect(() => {
    const sub = DeviceEventEmitter.addListener("qr-scanned-finish", async (data) => {
      console.log("QR finish result:", data);
      
      // Validate QR
      const expectedUrl = `${FORM_BASE_URL}/v1/assets/${assetQrToken}`;
      
      if (data === assetQrToken || data === expectedUrl) {
        await finishActivity();
      } else {
        Alert.alert("Invalid QR", "QR code does not match this asset");
      }
    });

    return () => sub.remove();
  }, [technicianNotes, mediaFiles]);

  const finishActivity = async () => {
    if (!technicianNotes.trim()) {
      Alert.alert("Notes Required", "Please add technician notes before finishing");
      return;
    }

    setIsSubmitting(true);

    try {
      // Update service request status to RESOLVED
      const response = await fetch(
        `${API_BASE_URL}/v1/service-requests/${serviceRequestId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: "RESOLVED",
            technician_notes: technicianNotes,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update service request");
      }

      // Upload media if any
      if (mediaFiles.length > 0) {
        await uploadMedia();
      }

      // Refresh requests
      await refreshRequests();

      Alert.alert("Success", "Activity completed successfully!", [
        {
          text: "OK",
          onPress: () => router.push("/(tabs)/(index)"),
        },
      ]);
    } catch (error) {
      console.error("Error finishing activity:", error);
      Alert.alert("Error", "Failed to complete activity. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const uploadMedia = async () => {
    try {
      const formData = new FormData();

      for (const file of mediaFiles) {
        formData.append("files", {
          uri: file.uri,
          name: file.name || "image.jpg",
          type: file.type || "image/jpeg",
        } as any);
      }

      const response = await fetch(
        `${API_BASE_URL}/v1/service-requests/${serviceRequestId}/technician-media`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to upload media");
      }
    } catch (error) {
      console.error("Error uploading media:", error);
      throw error;
    }
  };

  const pickImage = async () => {
    if (mediaFiles.length >= 3) {
      Alert.alert("Limit Reached", "You can only upload up to 3 images");
      return;
    }

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Denied", "We need camera roll permissions");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setMediaFiles([...mediaFiles, {
        uri: result.assets[0].uri,
        name: result.assets[0].fileName || "image.jpg",
        type: result.assets[0].mimeType || "image/jpeg",
      }]);
    }
  };

  const takePhoto = async () => {
    if (mediaFiles.length >= 3) {
      Alert.alert("Limit Reached", "You can only upload up to 3 images");
      return;
    }

    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Denied", "We need camera permissions");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setMediaFiles([...mediaFiles, {
        uri: result.assets[0].uri,
        name: "photo.jpg",
        type: "image/jpeg",
      }]);
    }
  };

  const removeImage = (index: number) => {
    setMediaFiles(mediaFiles.filter((_, i) => i !== index));
  };

  const handleFinishActivity = () => {
    if (!technicianNotes.trim()) {
      Alert.alert("Notes Required", "Please add technician notes before finishing");
      return;
    }

    // Navigate to QR scanner to finish
    router.push({
      pathname: "/scan/QRScanner",
      params: { mode: "finish" }
    });
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
            {mediaFiles.map((file, index) => (
              <View key={index} className="relative">
                <Image
                  source={{ uri: file.uri }}
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
          isSubmitting ? "bg-gray-400" : "bg-green-600 active:bg-green-500"
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