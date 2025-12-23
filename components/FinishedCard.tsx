import "@/global.css";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Linking, Platform, Pressable, Text, View } from "react-native";
import { ServiceRequest } from "../services/api";

interface FinishedCardProps {
  request: ServiceRequest;
}

const FinishedCard: React.FC<FinishedCardProps> = ({ request }) => {
  const icon_color = "#555";
  const icon_size = 18;

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return 'Date not available';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
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

  return (
    <Pressable className="bg-white p-5 rounded-md w-full shadow-sm shadow-slate-300 mt-3">
      <Text className="text-2xl pb-2">{request.type}</Text>
      
      <View className="flex-row items-center pb-2">
        <Ionicons
          className="pr-1"
          name="calendar"
          size={icon_size}
          color={icon_color}
        />
        <Text className={`text-[${icon_color}]`}>
          {formatDate(request.scheduled_date || request.created_at)}
        </Text>
      </View>

      <View className="flex-row items-center pb-2">
        <Ionicons
          className="pr-1"
          name="business"
          size={icon_size}
          color={icon_color}
        />
        <Text className={`text-[${icon_color}]`}>{request.asset.company_name}</Text>
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

      {request.description_preview && (
        <Text className="py-4 text-lg">
          Description: {request.description_preview}
        </Text>
      )}

      {request.technician_notes && (
        <Text className="py-4 text-lg">
          Notes: {request.technician_notes}
        </Text>
      )}

      <View className="mt-2">
        <Text className="text-sm text-gray-500">
          Status: <Text className="font-semibold">{request.status}</Text>
        </Text>
      </View>
    </Pressable>
  );
};

export default FinishedCard;