import { Link } from "expo-router";
import { Component } from "react";
import { Linking, Platform, Text, View } from "react-native";

export class ActivityInfo extends Component {
  render() {
    const url = Platform.select({
      ios: "comgooglemaps://?q=Taipei+101",
      android: "geo:0,0?q=Taipei+101",
    });

    const icon_color = "#555";
    const icon_size = 18;

    return (
      <View className="mb-10 ">
        <Text className="text-center text-2xl">Details</Text>
        <View className="pb-5 border-b border-gray-400">
          <Text className="text-lg pb-1">Title</Text>
          <Text className={`text-[#555]`}>Maintenance</Text>
        </View>
        <View className="py-5 border-b border-gray-400">
          <Text className="text-lg pb-1">Due date</Text>
          <Text className={`text-[#555]`}>23/12/2025 9:30AM</Text>
        </View>
        <View className="py-5 border-b border-gray-400">
          <Text className="text-lg pb-1">Requester</Text>
          <Text className={`text-[#555] pb-2`}>CoolAir Ltd.</Text>
          <Text className={`text-[#555]`}>Freddy Vega</Text>
        </View>
        <View className="py-5 border-b border-gray-400">
          <Text className="text-lg pb-1">Location</Text>
          <Link
            className="underline text-[#555]"
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
        <View className="py-5 border-b border-gray-400">
          <Text className="text-lg pb-1">Motive</Text>
          <Text className={`text-[#555]`}>
            Motive: AC has leaks, please come to fix it
          </Text>
        </View>
      </View>
    );
  }
}

export default ActivityInfo;
