import React, {useRef, useEffect} from 'react';
import {View, Animated, Easing, StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const CircleLoading = () => {
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const spinAnimation = Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );

    spinAnimation.start();

    return () => {
      spinAnimation.stop();
    };
  }, [spinValue]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.circle, {transform: [{rotate: spin}]}]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    width: wp(12),
    height: hp(7),
  },
  circle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 5,
    borderColor: 'green',
    borderTopColor: 'black',
  },
});

export default CircleLoading;
