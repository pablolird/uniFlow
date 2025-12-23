import ServiceCard from "@/components/ServiceCard";
import "@/global.css";
import { FlatList, StyleSheet, View } from "react-native";

export default function Scheduled() {
  return (
    <View className="justify-center items-center flex-1 border-t border-t-gray-300">
      <View className={"flex-1 w-full px-5"}>
        <FlatList
          data={[1, 2, 3, 4]}
          keyExtractor={(item) => item.toString()}
          renderItem={({}) => <ServiceCard />}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    color: "#000",
    fontSize: 24,
  },
  div: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#eee",
  },
});
