import { Component } from "react";
import { Text, TextInput, View } from "react-native";
import "./../global.css";

export class TextField extends Component {
  render() {
    const { title, placeholderText } = this.props;
    return (
      <View className="px-3">
        <Text className="text-2xl text-center">{title}</Text>
        <Text className="text-gray-600">Description</Text>
        <TextInput
          multiline={true}
          className="bg-white border border-gray-200 mt-2 min-h-32 items-center mb-5 placeholder:text-gray-300 text-gray-900 rounded-md p-5"
          placeholder={placeholderText}
        />
      </View>
    );
  }
}

export default TextField;
