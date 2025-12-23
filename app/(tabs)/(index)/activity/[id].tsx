import ActivityInfo from "@/components/ActivityInfo";
import TextField from "@/components/TextField";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
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
  const [qrResult, setQrResult] = useState("");

  useEffect(() => {
    const sub = DeviceEventEmitter.addListener("qr-scanned", (data) => {
      console.log("QR result:", data);
      setQrResult(data); // store scanned data
    });

    return () => sub.remove();
  }, []);

  return (
    <KeyboardAvoidingView
      keyboardVerticalOffset={120}
      behavior="padding"
      className="border-t flex-1 border-t-gray-300 px-3 py-5"
    >
      <ScrollView>
        <ActivityInfo />

        <TextField
          title="Diagnosis"
          placeholderText="E.g. Loosely connected valves..."
        />

        <TextField
          title="Solution"
          placeholderText="E.g. Adjusted valves inside the thermostat..."
        />
        <View className="items-center pb-5">
          <Text className="text-2xl text-center">Finish</Text>

          {qrResult !== "" ? (
            <Text style={{ marginTop: 20 }}>Scanned QR: {qrResult}</Text>
          ) : (
            <Pressable
              className="flex-row justify-center w-1/2 items-center m-3 p-3 bg-blue-500 active:bg-blue-400 rounded-md"
              onPress={() => router.push("/scan/QRScanner")}
            >
              <Ionicons className="pr-1" name="qr-code-outline" color={'white'} size={18}/>
              <Text className="text-white text-xl">Scan QR</Text>
            </Pressable>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
