import "@/global.css";
import { CameraView, useCameraPermissions } from "expo-camera";
import { router } from "expo-router";
import { useState } from "react";
import { Button, DeviceEventEmitter, Text, View } from "react-native";

export default function QRCodeScannerScreen() {
  const [scanned, setScanned] = useState();
  const [result, setResult] = useState();
  const [permission, requestPermission] = useCameraPermissions();

  if (!permission) {
    // Camera permissions are still loading
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
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
    DeviceEventEmitter.emit("qr-scanned", data);
    router.back();
  };

  return (
    <View className="flex-1 p-10">
      <Text className="text-3xl text-center pb-10">Scan QR to finish</Text>
      <View className="p-2 border-5 bg-blue-500 rounded-md">
        <CameraView
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ["qr"], // Specify to only scan QR codes
          }}
          style={{ aspectRatio: 1 }}
        />
      </View>
    </View>
  );
}
