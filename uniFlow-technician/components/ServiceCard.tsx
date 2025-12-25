import "@/global.css";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { Linking, Platform, Pressable, Text, View } from "react-native";
import { ServiceRequest } from "../services/api";

interface ServiceCardProps {
  request: ServiceRequest;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ request }) => {
  const icon_color = "#555";
  const icon_size = 18;

  const handlePress = () => {
    router.navigate({
      pathname: "/activity/[id]",
      params: { id: request.id },
    });
  };

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

  // Check if activity is in progress
  const isInProgress = request.status === "IN_PROGRESS";

  return (
    <View className="bg-white p-5 rounded-md w-full shadow-sm shadow-slate-300 mt-3">
      <Text className="text-2xl pb-2">{request.type}</Text>

      <View className="flex-row items-center pb-2">
        <Ionicons
          className="pr-1"
          name="calendar"
          size={icon_size}
          color={icon_color}
        />
        <Text className={`text-[${icon_color}]`}>
          {formatDate(request.scheduled_date)}
        </Text>
      </View>

      <View className="flex-row items-center pb-2">
        <Ionicons
          className="pr-1"
          name="business"
          size={icon_size}
          color={icon_color}
        />
        <Text className={`text-[${icon_color}]`}>
          {request.asset.company_name}
        </Text>
      </View>

      <View className="flex-row items-center pb-2">
        <Ionicons
          className="pr-1"
          name="person-sharp"
          size={icon_size}
          color={icon_color}
        />
        <Text className={`text-[${icon_color}]`}>{request.client.name}</Text>
      </View>

      <View className="flex-row items-center pb-2">
        <Ionicons
          className="pr-1"
          name="location"
          size={icon_size}
          color={icon_color}
        />
        <Pressable onPress={openMaps}>
          <Text className="underline text-[#555]">Open Google Maps</Text>
        </Pressable>
      </View>

      <Text className="py-4 text-lg">
        Motive: {request.description_preview}
      </Text>

      <Pressable
        onPress={handlePress}
        className={`${
          isInProgress 
            ? "bg-green-600 active:bg-green-500" 
            : "bg-blue-500 active:bg-blue-400"
        } flex-row rounded-md py-5 justify-center items-center`}
      >
        <Ionicons 
          name={isInProgress ? "construct" : "add"} 
          size={icon_size} 
          color={"#fff"} 
          className="pr-1" 
        />
        <Text className="text-white font-semibold">
          {isInProgress ? "ACTIVITY IN PROGRESS" : "START ACTIVITY"}
        </Text>
      </Pressable>
    </View>
  );
};

export default ServiceCard;