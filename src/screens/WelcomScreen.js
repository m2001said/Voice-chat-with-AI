import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {View, Text, SafeAreaView} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Features from '../components/Features.js';

export default function WelcomScreen() {
  const navigation = useNavigation();

  const navigateToHome = title => {
    navigation.navigate('Home', {title});
  };

  return (
    <SafeAreaView className="flex-1 flex justify-center bg-white px-4">
      <View className="text-center mb-10">
        <Text
          style={{fontSize: wp(10)}}
          className="text-center font-bold text-green-700">
          Thatek
        </Text>
        <Text style={{fontSize: wp(4)}} className="text-center text-green-700">
          Test your self with leadership
        </Text>
      </View>

      <View className="flex-col -mb-14">
        <Features
          title="easy"
          description="ChatGPT can provide you with instant and knowledgable responses, assist
        you with creative ideas on a wide range of topics"
          backgroundColor="#a4e0f8"
          onPress={() => navigateToHome('easy')}
        />
        <Features
          title="moderate"
          description="ChatGPT can provide you with instant and knowledgable responses, assist
        you with creative ideas on a wide range of topics"
          backgroundColor="#f8bca4"
          onPress={() => navigateToHome('moderate')}
        />
        <Features
          title="difficult"
          description="ChatGPT can provide you with instant and knowledgable responses, assist
        you with creative ideas on a wide range of topics"
          backgroundColor="#b6a4f8"
          onPress={() => navigateToHome('difficult')}
        />
      </View>
    </SafeAreaView>
  );
}
