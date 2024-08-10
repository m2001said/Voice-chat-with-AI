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
          اختبارات
        </Text>
        <Text style={{fontSize: wp(4)}} className="text-center text-green-700">
          اختبر نفسك وقيمها
        </Text>
      </View>

      <View className="flex-col -mb-14">
        <Features
          title="سهل"
          description="أنت مدير متجر معدات. أتى إليك الآن عميل مع شكوى بشأن منتج اشتراه من متجرك. يبدو العميل مستاء جدًا، ومن مسؤوليتك التعامل مع الوضع بشكل مهني وحل المشكلة"
          backgroundColor="#a4e0f8"
          onPress={() => navigateToHome('easy')}
        />
        <Features
          title="متوسط"
          description="أنت قائد فريق في شركة تقنية. تلقى أحد أعضاء فريقك تعليقات سلبية من زملائه حول تأخره في تسليم المهام. تحتاج إلى التحدث معه وتقديم الملاحظات بطريقة بناءة."
          backgroundColor="#f8bca4"
          onPress={() => navigateToHome('moderate')}
        />
        <Features
          title="صعب"
          description="أنت مدير مبيعات في شركة. لديك اجتماع مع عميل محتمل لتفاوض حول شروط عقد جديد. العميل معروف بصعوبته في التفاوض ومطالبه العالية. تحتاج إلى إتمام الصفقة بشروط تناسب شركتك."
          backgroundColor="#b6a4f8"
          onPress={() => navigateToHome('difficult')}
        />
      </View>
    </SafeAreaView>
  );
}
