// app/(tabs)/(index)/scan/QRScanner.jsx
import "@/global.css";
import { CameraView, useCameraPermissions } from "expo-camera";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Button, DeviceEventEmitter, Text, View } from "react-native";

export default function QRCodeScannerScreen() {
  const [scanned, setScanned] = useState(false);
  const [result, setResult] = useState();
  const [permission, requestPermission] = useCameraPermissions();
  const { mode } = useLocalSearchParams(); // 'start' or 'finish'

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ textAlign: "center" }}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    setResult(data);
    
    // Emit different events based on mode
    if (mode === "finish") {
      DeviceEventEmitter.emit("qr-scanned-finish", data);
    } else {
      DeviceEventEmitter.emit("qr-scanned", data);
    }
    
    router.back();
  };

  const getTitle = () => {
    if (mode === "finish") {
      return "Scan QR to Finish";
    }
    return "Scan QR to Start";
  };

  return (
    <View className="flex-1 p-10">
      <Text className="text-3xl text-center pb-10">{getTitle()}</Text>
      <View className="p-2 border-5 bg-blue-500 rounded-md">
        <CameraView
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ["qr"],
          }}
          style={{ aspectRatio: 1 }}
        />
      </View>
      {scanned && (
        <View className="mt-4">
          <Text className="text-center text-gray-600">Processing...</Text>
        </View>
      )}
    </View>
  );
}