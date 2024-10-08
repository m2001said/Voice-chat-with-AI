import React, {useState} from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

export default function Features({
  onPress,
  backgroundColor,
  cahllengeNum,
  description,
  title,
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="mb-2 p-4 rounded-xl space-y-2"
      style={{backgroundColor: backgroundColor}}>
      <Text style={{fontSize: wp(4.8)}} className="font-semibold text-gray-700">
        {cahllengeNum} - {title}
      </Text>

      <Text style={{fontSize: wp(3.8)}} className="font-medium text-gray-700">
        {description}
      </Text>
    </TouchableOpacity>
  );
}
