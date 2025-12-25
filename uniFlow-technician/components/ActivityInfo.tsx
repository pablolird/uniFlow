import { useState } from "react";
import {
  Image,
  Linking,
  Modal,
  Platform,
  Pressable,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ServiceRequest } from "../services/api";

interface ActivityInfoProps {
  request: ServiceRequest;
}

const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL || "http://localhost:3000";

export default function ActivityInfo({ request }: ActivityInfoProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return "Not scheduled";
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const openMaps = () => {
    const { location_lat, location_lng, location_address } = request.asset;

    const appUrl = Platform.select({
      ios: `comgooglemaps://?q=${location_address}`,
      android: `geo:${location_lat},${location_lng}?q=${location_address}`,
    });

    const webUrl = `https://www.google.com/maps?q=${encodeURIComponent(location_address)}`;

    if (appUrl) {
      Linking.openURL(appUrl).catch(() => Linking.openURL(webUrl));
    }
  };

  const clientMedia = request.client_media || [];
  const imageMedia = clientMedia
    .filter((media) => media.kind === "image")
    .slice(0, 3);

  return (
    <View className="mb-10">
      <Text className="text-center text-2xl font-semibold mb-4">Details</Text>

      <View className="pb-5 border-b border-gray-400">
        <Text className="text-lg pb-1 font-semibold">Title</Text>
        <Text className="text-[#555]">{request.type}</Text>
      </View>

      <View className="py-5 border-b border-gray-400">
        <Text className="text-lg pb-1 font-semibold">Due date</Text>
        <Text className="text-[#555]">
          {formatDate(request.scheduled_date)}
        </Text>
      </View>

      <View className="py-5 border-b border-gray-400">
        <Text className="text-lg pb-1 font-semibold">Requester</Text>
        <Text className="text-[#555] pb-2">{request.asset.company_name}</Text>
        <Text className="text-[#555]">{request.client.name}</Text>
        <Text className="text-[#555] text-sm">{request.client.email}</Text>
      </View>

      <View className="py-5 border-b border-gray-400">
        <Text className="text-lg pb-1 font-semibold">Asset</Text>
        <Text className="text-[#555] pb-1">{request.asset.name}</Text>
        <Text className="text-[#555] text-sm">
          Model: {request.asset.model}
        </Text>
      </View>

      <View className="py-5 border-b border-gray-400">
        <Text className="text-lg pb-1 font-semibold">Location</Text>
        <Text className="text-[#555] pb-2">
          {request.asset.location_address}
        </Text>
        <Pressable onPress={openMaps}>
          <Text className="underline text-blue-600">Open Google Maps</Text>
        </Pressable>
      </View>

      <View className="py-5 border-b border-gray-400">
        <Text className="text-lg pb-1 font-semibold">Description</Text>
        <Text className="text-[#555]">{request.description_preview}</Text>
      </View>

      <View className="py-5 border-b border-gray-400">
        <Text className="text-lg pb-1 font-semibold">Client Media</Text>
        {imageMedia.length === 0 ? (
          <Text className="text-[#555] italic">No images available</Text>
        ) : (
          <View>
            <View className="flex-row mt-3 space-x-3">
              {imageMedia.map((media, index) => (
                <Pressable
                  key={index}
                  onPress={() => {
                    setSelectedImage(`${API_BASE_URL}${media.url}`);
                    setCurrentImageIndex(index);
                  }}
                  className="flex-1"
                >
                  <Image
                    source={{ uri: `${API_BASE_URL}${media.url}` }}
                    className="w-full h-24 rounded-md"
                    resizeMode="cover"
                  />
                  <Text className="text-xs text-center mt-1 text-gray-600">
                    Image {index + 1}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}
      </View>

      {/* Image Modal for full view */}
      <Modal
        visible={selectedImage !== null}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setSelectedImage(null)}
      >
        <View className="flex-1 bg-black/90 justify-center items-center">
          <Pressable
            className="absolute top-12 right-6 z-10"
            onPress={() => setSelectedImage(null)}
          >
            <View className="bg-white rounded-full p-2">
              <Text className="text-2xl font-bold px-2">✕</Text>
            </View>
          </Pressable>

          {selectedImage && (
            <SafeAreaView className="flex-1 w-full h-full">
              <View className="flex-1 justify-center items-center p-4">
                <Image
                  source={{ uri: selectedImage }}
                  className="w-full h-full"
                  resizeMode="contain"
                />
                <Text className="text-white text-center mt-4">
                  Image {currentImageIndex + 1} of {imageMedia.length}
                </Text>
              </View>
            </SafeAreaView>
          )}
        </View>
      </Modal>
    </View>
  );
}
