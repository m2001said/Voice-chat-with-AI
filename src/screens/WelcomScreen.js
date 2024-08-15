import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {View, Text, SafeAreaView, ScrollView} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Features from '../components/Features.js';

export default function WelcomScreen() {
  const navigation = useNavigation();

  const navigateToHome = cahllengeNum => {
    navigation.navigate('Home', {cahllengeNum});
  };

  return (
    <SafeAreaView className="bg-white">
      <ScrollView className="px-4">
        <View className="text-center m-6">
          <Text
            style={{fontSize: wp(10)}}
            className="text-center font-bold text-black">
            اختبارات
          </Text>
          <Text style={{fontSize: wp(4)}} className="text-center text-black">
            اختبر نفسك وقيمها
          </Text>
        </View>

        <View>
          <Features
            cahllengeNum="التحدي الأول"
            title="تحدي التعامل مع الملاحظات"
            description="أنت مدير في شركة تعمل في مجال التكنولوجيا. لديك بعض الملاحظات السلبية عن أداء أحد الموظفين، ويجب عليك مناقشتها معه بطريقة بناءة ومهنية."
            backgroundColor="#ffa07a"
            onPress={() => navigateToHome('first')}
          />

          <Features
            cahllengeNum="التحدي الثاني"
            title="تحدي حل المشكلات"
            description="أنت قائد فريق يعمل على مشروع كبير، وتواجه مشكلة في التعاون بين أعضاء الفريق. يجب عليك تحديد أسباب المشكلة ووضع خطة لتحسين العمل الجماعي وضمان تسليم المشروع في الوقت المحدد."
            backgroundColor="#98fb98"
            onPress={() => navigateToHome('second')}
          />

          <Features
            cahllengeNum="التحدي الثالث"
            title="تحدي التفاوض"
            description="أنت مدير مبيعات في شركة تسعى للحصول على عقد مع شركة دولية. يجب عليك التفاوض للوصول إلى أفضل صفقة ممكنة لصالح شركتك مع الحفاظ على علاقة جيدة مع العميل."
            backgroundColor="#87cefa"
            onPress={() => navigateToHome('third')}
          />

          <Features
            cahllengeNum="التحدي الرابع"
            title="تحدي اتخاذ القرار"
            description="أنت مدير في شركة تخطط للتوسع في الأسواق الدولية، ويجب عليك اتخاذ قرار حول الخيار الأفضل من بين ثلاث خيارات مقترحة. يجب عليك تحليل هذه الخيارات وشرح الأسباب وراء اختيارك."
            backgroundColor="#dda0dd"
            onPress={() => navigateToHome('fourth')}
          />

          <Features
            cahllengeNum="التحدي الخامس"
            title="تحدي إدارة الوقت"
            description="أنت مدير مشروع ولديك قائمة مهام متزايدة بمهام متنافسة من عدة فرق. يجب عليك تحديد الأولويات ووضع خطة زمنية واضحة لإكمال المهام بكفاءة."
            backgroundColor="#f0e68c"
            onPress={() => navigateToHome('fifth')}
          />

          <Features
            cahllengeNum="التحدي السادس"
            title="تحدي الضغوط الاجتماعية"
            description="أنت والد لابن عمره 22 سنة. يواجه ابنك تحديات اجتماعية في الجامعة، ويحتاج إلى نصيحتك حول كيفية التعامل مع ضغوط الأصدقاء والمواقف الاجتماعية."
            backgroundColor="#ffd700"
            onPress={() => navigateToHome('sixth')}
          />

          <Features
            cahllengeNum="التحدي السابع"
            title="تحدي التواصل مع الزوجة"
            description="أنت زوج قررت الخروج مع أصدقائك لقضاء الوقت بدلاً من قضاء الوقت مع زوجتك كما اتفقتما سابقًا. تشعر زوجتك بالضيق من هذا القرار، وترغب في التحدث معك لتحسين التواصل بينكما وحل سوء التفاهم."
            backgroundColor="#ffb6c1"
            onPress={() => navigateToHome('seventh')}
          />

          <Features
            cahllengeNum="التحدي الثامن"
            title="تحدي اختيار المسار المهني"
            description="أنت والد أو والدة ترغب في إرشاد ابنك البالغ من العمر 22 عامًا إلى المسار المهني الذي تعتقد أنه الأفضل له، ولكنه يرغب في اتخاذ مسار مختلف. عليك التحدث معه حول ذلك."
            backgroundColor="#ffa07a"
            onPress={() => navigateToHome('eighth')}
          />

          <Features
            cahllengeNum="التحدي التاسع"
            title="تحدي مواجهة التوقعات"
            description="أنت صديق مقرب لشخص يعاني من ضغط نفسي كبير بسبب التوقعات العالية من عائلته وأصدقائه. يجب عليك مساعدته في التخفيف من هذا الضغط وتقديم الدعم المعنوي."
            backgroundColor="#20b2aa"
            onPress={() => navigateToHome('ninth')}
          />

          <Features
            cahllengeNum="التحدي العاشر"
            title="تحدي التكيف مع بيئة العمل"
            description="أنت مدير في شركة وتلاحظ أن أحد الموظفين الجدد يواجه صعوبة في التكيف مع بيئة العمل. يجب عليك التحدث معه وتقديم الدعم اللازم."
            backgroundColor="#7fff00"
            onPress={() => navigateToHome('tenth')}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
