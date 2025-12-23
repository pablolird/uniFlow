import { Text, View } from "react-native";
import '../global.css';

const Title = () => {
  return (
    <View className='border-b border-b-gray-300'>
      <Text className={'py-5 text-center text-2xl text-gray-950'}>
        <Text className={'text-blue-600'}>uni</Text>Flow
      </Text>
    </View>
  );
};

export default Title;
