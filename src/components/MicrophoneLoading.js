import React, {useRef, useEffect} from 'react';
import {View, Animated, Easing, StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const MicrophoneLoading = () => {
  const animateValue1 = useRef(new Animated.Value(4)).current;
  const animateValue2 = useRef(new Animated.Value(10)).current;
  const animateValue3 = useRef(new Animated.Value(4)).current;
  const animateValue4 = useRef(new Animated.Value(10)).current;

  useEffect(() => {
    const createAnimation = animatedValue => {
      return Animated.loop(
        Animated.sequence([
          Animated.timing(animatedValue, {
            toValue: 22,
            duration: 500,
            easing: Easing.linear,
            useNativeDriver: false,
          }),
          Animated.timing(animatedValue, {
            toValue: 10,
            duration: 500,
            easing: Easing.linear,
            useNativeDriver: false,
          }),
        ]),
      );
    };

    const animation1 = createAnimation(animateValue1);
    const animation2 = createAnimation(animateValue2);
    const animation3 = createAnimation(animateValue3);
    const animation4 = createAnimation(animateValue4);

    animation1.start();
    animation2.start();
    animation3.start();
    animation4.start();

    return () => {
      animation1.stop();
      animation2.stop();
      animation3.stop();
      animation4.stop();
    };
  }, [animateValue1, animateValue2, animateValue3, animateValue4]);

  return (
    <View style={[styles.container, {width: wp(12), height: hp(7)}]}>
      <Animated.View style={[styles.bar, {height: animateValue1}]} />
      <Animated.View style={[styles.bar, {height: animateValue2}]} />
      <Animated.View style={[styles.bar, {height: animateValue3}]} />
      <Animated.View style={[styles.bar, {height: animateValue4}]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  bar: {
    width: 5,
    backgroundColor: 'white',
    margin: 2,
    borderRadius: 4,
  },
});

export default MicrophoneLoading;
