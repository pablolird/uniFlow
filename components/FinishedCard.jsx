import "@/global.css";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Link, router } from "expo-router";
import { Linking, Platform, Pressable, Text, View } from "react-native";

const FinishedCard = () => {
  const url = Platform.select({
    ios: "comgooglemaps://?q=Taipei+101",
    android: "geo:0,0?q=Taipei+101",
  });

  const icon_color = "#555";
  const icon_size = 18;

  const handlePress = () => {
    router.navigate({
      pathname: "activity/damn",
      params: { id: "bacon" },
    });
  };

  return (
    <Pressable
      className={
        "bg-white p-5 rounded-md w-full shadow-sm shadow-slate-300 mt-3"
      }
    >
      <Text className="text-2xl pb-2">Maintenance</Text>
      <View className="flex-row items-center pb-2">
        <Ionicons
          className="pr-1"
          name="calendar"
          size={icon_size}
          color={icon_color}
        />
        <Text className={`text-[${icon_color}]`}>23/12/2025 9:30AM</Text>
      </View>
      <View className="flex-row items-center pb-2">
        <Ionicons
          className="pr-1"
          name="business"
          size={icon_size}
          color={icon_color}
        />
        <Text className={`text-[${icon_color}]`}>CoolAir Ltd.</Text>
      </View>
      <View className="flex-row items-center pb-2">
        <Ionicons
          className="pr-1"
          name="person-sharp"
          size={icon_size}
          color={icon_color}
        />
        <Text className={`text-[${icon_color}]`}>Freddy Vega</Text>
      </View>
      <View className="flex-row items-center pb-2">
        <Ionicons
          className="pr-1"
          name="location"
          size={icon_size}
          color={icon_color}
        />
        <Link
          className="underline active:bg-inherit text-[#555]"
          href="" // must be empty or "#"
          onPress={(e) => {
            e.preventDefault(); // prevent Expo Router navigation

            // App URLs for Google Maps
            const appUrl = Platform.select({
              ios: "comgooglemaps://?q=Taipei+101",
              android: "geo:0,0?q=Taipei+101",
            });

            // Fallback to web if app not installed
            const webUrl = "https://www.google.com/maps?q=Taipei+101";

            Linking.openURL(appUrl).catch(() => Linking.openURL(webUrl));
          }}
        >
          Open Google Maps
        </Link>
      </View>

      <Text className="py-4 text-lg">
        Diagnosis: Main valve loose, causing vibrations inside the engine
      </Text>
      <Text className="py-4 text-lg">
        Solution: Fixed the valve by tightening it, changed the engine oil
      </Text>
    </Pressable>
  );
};

export default FinishedCard;
