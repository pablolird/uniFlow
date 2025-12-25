import FinishedCard from "@/components/FinishedCard";
import LoadingScreen from "@/components/LoadingScreen";
import { useServiceRequests } from "@/contexts/ServiceRequestsContext";
import { useState } from "react";
import { FlatList, RefreshControl, Text, View } from "react-native";

export default function Finished() {
  const { finishedRequests, loading, error, refreshRequests } = useServiceRequests();
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
      <View className="flex-1 justify-center items-center px-5 bg-[#eee]">
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
    <View className="bg-[#eee] flex-1 justify-center items-center">
      <View className="flex-1 w-full px-5">
        {finishedRequests.length === 0 ? (
          <View className="flex-1 justify-center items-center">
            <Text className="text-gray-500 text-lg">
              No finished activities
            </Text>
          </View>
        ) : (
          <FlatList
            data={finishedRequests}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <FinishedCard request={item} />}
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
