import ActivityInfo from "@/components/ActivityInfo";
import { useServiceRequests } from "@/contexts/ServiceRequestsContext";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  DeviceEventEmitter,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import "../../../../global.css";

export default function Activity() {
  const { id } = useLocalSearchParams();
  const { scheduledRequests, finishedRequests } = useServiceRequests();
  const [qrResult, setQrResult] = useState("");

  // Find the request from either scheduled or finished lists
  const request = [...scheduledRequests, ...finishedRequests].find(
    req => req.id === id
  );

  useEffect(() => {
    const sub = DeviceEventEmitter.addListener("qr-scanned", (data) => {
      console.log("QR result:", data);
      setQrResult(data);
    });

    return () => sub.remove();
  }, []);

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
              <Text className="mt-2 text-gray-600">Code: {qrResult}</Text>
            </View>
          ) : (
            <Pressable
              className="flex-row justify-center w-2/3 items-center p-4 bg-blue-500 active:bg-blue-400 rounded-md"
              onPress={() => router.push("/scan/QRScanner")}
            >
              <Ionicons className="pr-1" name="qr-code-outline" color={'white'} size={24}/>
              <Text className="text-white text-xl ml-2">Scan QR Code</Text>
            </Pressable>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}