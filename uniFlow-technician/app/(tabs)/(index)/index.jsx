import LoadingScreen from "@/components/LoadingScreen";
import ServiceCard from "@/components/ServiceCard";
import { useServiceRequests } from "@/contexts/ServiceRequestsContext";
import "@/global.css";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import { ActivityIndicator, FlatList, Pressable, RefreshControl, Text, View } from "react-native";

export default function Scheduled() {
  const { scheduledRequests, loading, error, refreshRequests } = useServiceRequests();
  const [refreshing, setRefreshing] = useState(false);
  const [manualRefreshing, setManualRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshRequests();
    setRefreshing(false);
  };

  const onManualRefresh = async () => {
    setManualRefreshing(true);
    await refreshRequests();
    setManualRefreshing(false);
  };

  if (loading && !refreshing && !manualRefreshing) {
    return <LoadingScreen message="Fetching requests..." />;
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center px-5">
        <Text className="text-red-500 text-center text-lg mb-4">
          Error: {error}
        </Text>
        <Text className="text-gray-600 text-center">
          Please check your connection and try again
        </Text>
      </View>
    );
  }

  return (
    <View className="justify-center items-center flex-1 border-t border-t-gray-300">
      {/* Header with refresh button */}
      <View className="w-full px-5 py-3 flex-row justify-between items-center border-b border-gray-200">
        <Text className="text-xl font-semibold text-gray-800">Scheduled Activities</Text>
        <Pressable
          onPress={onManualRefresh}
          disabled={manualRefreshing}
          className="p-2 rounded-full active:bg-gray-100"
        >
          {manualRefreshing ? (
            <ActivityIndicator size="small" color="#3B82F6" />
          ) : (
            <Ionicons name="refresh" size={24} color="#3B82F6" />
          )}
        </Pressable>
      </View>

      <View className="flex-1 w-full px-5">
        {scheduledRequests.length === 0 ? (
          <View className="flex-1 justify-center items-center">
            <Text className="text-gray-500 text-lg">
              No scheduled activities
            </Text>
          </View>
        ) : (
          <FlatList
            data={scheduledRequests}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <ServiceCard request={item} />}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={["#3B82F6"]}
              />
            }
          />
        )}
      </View>
    </View>
  );
}