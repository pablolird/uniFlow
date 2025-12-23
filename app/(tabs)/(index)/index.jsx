import LoadingScreen from "@/components/LoadingScreen";
import ServiceCard from "@/components/ServiceCard";
import { useServiceRequests } from "@/contexts/ServiceRequestsContext";
import "@/global.css";
import { useState } from "react";
import { FlatList, RefreshControl, Text, View } from "react-native";

export default function Scheduled() {
  const { scheduledRequests, loading, error, refreshRequests } = useServiceRequests();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshRequests();
    setRefreshing(false);
  };

  if (loading && !refreshing) {
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