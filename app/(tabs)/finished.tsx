import FinishedCard from "@/components/FinishedCard";
import { FlatList, View } from "react-native";

export default function Finished() {
  return (
    <View className="bg-[#eee] flex-1 justify-center items-center">
      <View className={"flex-1 w-full px-5"}>
        <FlatList
          data={[1, 2, 3, 4]}
          keyExtractor={(item) => item.toString()}
          renderItem={({}) => <FinishedCard />}
        />
      </View>
    </View>
  );
}
