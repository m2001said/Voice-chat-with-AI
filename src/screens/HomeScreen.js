import React, {useEffect, useRef, useState} from 'react';
import axios from 'axios';
import {
  View,
  Text,
  SafeAreaView,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import MicrophoneLoading from '../components/MicrophoneLoading.js';
import Voice from '@react-native-community/voice';
import {useRoute} from '@react-navigation/native';
import {GPT_API} from '@env';
import RNFS from 'react-native-fs';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';

export default function HomeScreen() {
  const route = useRoute();
  const {cahllengeNum} = route.params;
  const [userName, setUserName] = useState('صلاح');
  const [userAge, setUserAge] = useState('22');
  const [userCountry, setUserCountry] = useState('مصر');
  const audioRecorderPlayer = new AudioRecorderPlayer();

  const promptsMessages = () => {
    const clientSetting = `اسم المستخدم الذي تتعامل معه هو ${userName}، وعمره ${userAge}، وهو يتحدث بلهجة بلده ${userCountry}،`;
    const systemSetting = `يجب أن تظل هادئًا ومهنيًا طوال المحادثة، وبعد إنهاء المحادثة يجب عليك تقديم التقييم من عشر درجات ليعرف الموظف نتيجته في الاختبار. تناقش واسمع منه في مدة 3 دقائق فقط، ثم اعطه التقييم ونصائح إذا أخطأ في التحدث معك. تأكد من أن تكون الرسائل حقيقية وقصيرة، ولا تجيب عن أي سؤال خارج المحادثة، وإذا سأل سؤال خارج عن المحادثة قل له: "لن أجيب عن أي سؤال خارج عن المحادثة."`;

    if (cahllengeNum === 'first') {
      return [
        {
          role: 'system',
          content: `أنت تلعب دور الموظف الذي يتلقى ملاحظات سلبية من مديره. مهمتك هي الدفاع عن موقفك بطريقة مهنية، والاستماع إلى ملاحظات المدير، ثم مناقشة النقاط التي تعتقد أنها غير عادلة. ${clientSetting} ${systemSetting}.`,
        },
        {
          role: 'assistant',
          content:
            'لقد تلقينا بعض الملاحظات من زملائك حول أدائك في الآونة الأخيرة. أود أن أستمع إلى رأيك حول هذه الملاحظات.',
        },
      ];
    } else if (cahllengeNum === 'second') {
      return [
        {
          role: 'system',
          content: `أنت تلعب دور أحد أعضاء الفريق الذي يواجه مشكلة في التعاون مع زملائه في المشروع. يجب عليك شرح التحديات التي تواجهها وتقديم أفكار لتحسين العمل الجماعي. ${clientSetting} ${systemSetting}.`,
        },
        {
          role: 'assistant',
          content:
            'الفريق يواجه مشكلة كبيرة في العمل الجماعي مؤخراً. ما هي خطواتك المقترحة لحل هذه المشكلة؟',
        },
      ];
    } else if (cahllengeNum === 'third') {
      return [
        {
          role: 'system',
          content: `أنت تلعب دور ممثل لشركة خارجية تتفاوض مع مدير مبيعات لشركة أخرى. يجب عليك محاولة الحصول على أفضل صفقة ممكنة لشركتك مع مراعاة مصالح الشركة التي تتفاوض معها. ${clientSetting} ${systemSetting}.`,
        },
        {
          role: 'assistant',
          content:
            'لدينا فرصة للتفاوض على عقد جديد مع شركتك. ما هي الشروط التي تود مناقشتها؟',
        },
      ];
    } else if (cahllengeNum === 'fourth') {
      return [
        {
          role: 'system',
          content: `أنت تلعب دور مستشار يقدم خيارات متعددة للتوسع في الأسواق الجديدة، ويطلب منك توضيح مزايا وعيوب كل خيار بناءً على الأسئلة التي يطرحها المدير. ${clientSetting} ${systemSetting}.`,
        },
        {
          role: 'assistant',
          content:
            'لدينا ثلاث خيارات للتوسع في الأسواق الجديدة. يمكنني توضيح مزايا وعيوب كل خيار بناءً على متطلباتك.',
        },
      ];
    } else if (cahllengeNum === 'fifth') {
      return [
        {
          role: 'system',
          content: `أنت تلعب دور موظف يتلقى توجيهات حول كيفية ترتيب أولويات المهام. يجب عليك توضيح التحديات التي تواجهك في إدارة الوقت وتقديم اقتراحات لتحسين الإنتاجية. ${clientSetting} ${systemSetting}.`,
        },
        {
          role: 'assistant',
          content:
            'أمامك قائمة مهام تحتوي على عدة أولويات متضاربة. كيف يمكنك ترتيب هذه المهام لضمان إتمامها في الوقت المحدد؟',
        },
      ];
    } else if (cahllengeNum === 'sixth') {
      return [
        {
          role: 'system',
          content: `أنت تلعب دور شاب يعاني من ضغوط اجتماعية بين أصدقائه وزملائه في الجامعة. يجب عليك محاولة التحدث مع والدك (المستخدم) حول التحديات التي تواجهها وطلب نصيحته. ${clientSetting} ${systemSetting}.`,
        },
        {
          role: 'assistant',
          content:
            'أبي، أريد التحدث معك عن شيء يزعجني في الجامعة. أشعر بالكثير من الضغوط من زملائي ولا أعرف كيف أتعامل مع الأمر.',
        },
      ];
    } else if (cahllengeNum === 'seventh') {
      return [
        {
          role: 'system',
          content: `أنت تلعب دور زوجة تشعر بالضيق بعد أن قرر زوجك الخروج مع أصدقائه في الليلة التي كنتم قد خططتم لقضائها معًا. مهمتك هي التعبير عن مشاعرك بطريقة هادئة ومحاولة تحسين التواصل بينكما. ${clientSetting} ${systemSetting}.`,
        },
        {
          role: 'assistant',
          content:
            'عزيزي، أود التحدث معك حول ما حدث أمس عندما قررت الخروج مع أصدقائك بدلاً من قضاء الوقت معي كما كنا قد اتفقنا. أعتقد أن هناك حاجة لمناقشة الأمر حتى نفهم مشاعر بعضنا البعض بشكل أفضل.',
        },
      ];
    } else if (cahllengeNum === 'eighth') {
      return [
        {
          role: 'system',
          content: `أنت تلعب دور شاب يحاول التفاوض مع والديه بشأن اختيار مسار مهني مختلف عما كانوا يتوقعونه. يجب عليك الدفاع عن قرارك وتوضيح أسباب اختيارك. ${clientSetting} ${systemSetting}.`,
        },
        {
          role: 'assistant',
          content:
            'أمي، أبي، أريد أن أتحدث معكما عن قراري بشأن مستقبلي المهني. أعلم أن لديكم توقعات معينة، لكن لدي بعض الأفكار التي أود مناقشتها معكما.',
        },
      ];
    } else if (cahllengeNum === 'ninth') {
      return [
        {
          role: 'system',
          content: `أنت تلعب دور شاب يشعر بالضغط بسبب التوقعات العالية من عائلته وأصدقائه. يجب عليك مناقشة هذا الأمر مع صديق مقرب (المستخدم) والبحث عن نصيحة للتخفيف من الضغط. ${clientSetting} ${systemSetting}.`,
        },
        {
          role: 'assistant',
          content:
            'صديقي، أشعر بالكثير من الضغط مؤخراً بسبب التوقعات العالية من حولي. أحتاج إلى نصيحتك حول كيفية التعامل مع هذا الوضع.',
        },
      ];
    } else if (cahllengeNum === 'tenth') {
      return [
        {
          role: 'system',
          content: `أنت تلعب دور موظف جديد يحاول التكيف مع بيئة العمل الجديدة. يجب عليك التحدث مع مديرك عن التحديات التي تواجهها وطلب دعمه في هذا السياق. ${clientSetting} ${systemSetting}.`,
        },
        {
          role: 'assistant',
          content:
            'سيدي، أريد التحدث معك عن بعض التحديات التي أواجهها في التكيف مع بيئة العمل هنا. هل يمكن أن تعطيني بعض النصائح؟',
        },
      ];
    }
  };

  const [messages, setMessages] = useState(() => promptsMessages() || []);
  const [recording, setRecording] = useState(false);
  const [speacking, setSpeacking] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const scrollViewRef = useRef();

  const [totalTokens, setTotalTokens] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const calculatePrice = (usageData, ttsCharacters = 0) => {
    const inputPricePerThousandTokens = 0.005;
    const outputPricePerThousandTokens = 0.015;
    const ttsPricePerThousandCharacters = 0.03;

    const {prompt_tokens, completion_tokens} = usageData;

    // Calculate the costs
    const inputCost = (prompt_tokens / 1000) * inputPricePerThousandTokens;
    const outputCost =
      (completion_tokens / 1000) * outputPricePerThousandTokens;
    const ttsCost = (ttsCharacters / 1000) * ttsPricePerThousandCharacters;

    const totalCost = inputCost + outputCost + ttsCost;
    const totalTokens = prompt_tokens + completion_tokens;

    return {totalTokens, totalCost};
  };

  const apiCall = async text => {
    if (text && typeof text === 'string') {
      const trimmedResult = text.trim();
      if (trimmedResult.length > 0) {
        try {
          setLoading(true);

          // Generate text from AI
          const res = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
              model: 'gpt-4o',
              messages: [...messages, {role: 'user', content: trimmedResult}],
            },
            {
              headers: {
                Authorization: `Bearer ${GPT_API}`,
                'Content-Type': 'application/json',
              },
            },
          );

          let answer = res.data?.choices[0]?.message?.content;
          //  -------for cost and tokens-------------
          const {usage} = res.data;
          const {totalTokens: newTokens, totalCost: newCost} = calculatePrice(
            usage,
            answer.length,
          );
          setTotalTokens(prevTokens => prevTokens + newTokens);
          setTotalCost(prevCost => prevCost + newCost);

          setLoading(false);
          startTextToSpeech(answer);

          // Update messages state using functional update
          setMessages(prevMessages => [
            ...prevMessages,
            {role: 'user', content: trimmedResult},
            {role: 'assistant', content: answer},
          ]);

          console.log('=======messages=============================');
          console.log(messages);
          console.log('====================================');

          updateScrollView();
        } catch (error) {
          console.log('================apiCall response====================');
          console.log('error', error);
          Alert.alert('Error in apiCall', error.message);
          setLoading(false);
        }
      }
    } else {
      console.log('Invalid result:', text);
    }
  };

  const startTextToSpeech = async message => {
    try {
      setSpeacking(true);

      const res = await axios.post(
        'https://api.openai.com/v1/audio/speech',
        {
          model: 'tts-1-hd',
          input: message,
          voice: 'alloy',
        },
        {
          headers: {
            Authorization: `Bearer ${GPT_API}`,
            'Content-Type': 'application/json',
          },
          responseType: 'blob', // Receive the response as a Blob
        },
      );

      // Get a temporary local file path for the MP3 file
      const path = `${RNFS.DocumentDirectoryPath}/speech.mp3`;

      // Write the Blob response to a file
      const reader = new FileReader();
      reader.readAsDataURL(res.data);
      reader.onloadend = async () => {
        const base64data = reader.result.split(',')[1];
        await RNFS.writeFile(path, base64data, 'base64');

        // Play the audio file automatically
        await audioRecorderPlayer.startPlayer(path);
        audioRecorderPlayer.addPlayBackListener(e => {
          if (e.currentPosition === e.duration) {
            audioRecorderPlayer.stopPlayer();
            audioRecorderPlayer.removePlayBackListener();
            setSpeacking(false);
          }
        });
      };
    } catch (error) {
      console.error('Error in startTextToSpeech', error);
      setSpeacking(false);
    }
  };

  const clearMessages = () => {
    setMessages([]);
  };
  const stopSpeacking = () => {
    setSpeacking(false);
  };
  const startRecording = () => {
    setRecording(true);
    try {
      // Voice.start('en-US');
      Voice.start('ar-SA');
    } catch (error) {
      console.log('error in  startRecording', error);
    }
  };
  const stopRecording = async () => {
    try {
      await Voice.stop();
      setRecording(false);
    } catch (error) {
      console.log('error in  stopRecording', error);
    }
  };

  const updateScrollView = e => {
    setTimeout(() => {
      scrollViewRef?.current?.scrollToEnd({andimated: true});
    }, 200);
  };
  const speechStartHandler = e => {
    console.log('speech Start Handler');
  };
  const speechEndHandler = e => {
    setRecording(false);
    console.log('speech End Handler');
  };
  const speechResultsHandler = e => {
    console.log('Voice Event', e);
    const text = e.value[0];
    setResult(text);

    if (text.trim().length > 0) {
      apiCall(text);
    }
  };

  useEffect(() => {
    console.log('=================new result===================');
    console.log(result);
  }, [result]);
  const speechErrorHandler = e => {
    console.log('speech Error Handler', e);
  };

  useEffect(() => {
    Voice.onSpeechStart = speechStartHandler;
    Voice.onSpeechEnd = speechEndHandler;
    Voice.onSpeechResults = speechResultsHandler;
    Voice.onSpeechError = speechErrorHandler;

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  return (
    <View className="flex-1 bg-white">
      <SafeAreaView className="flex-1 flex mx-5">
        {/* bot icon */}
        <View className="flex-row justify-center">
          <Image
            source={require('../../assets/images/bot.png')}
            style={{width: wp(15), height: hp(20)}}
          />
        </View>

        <View className="space-y-2 flex-1">
          <Text style={{fontSize: wp(5)}}>Assistant</Text>

          {/* Display Tokens and Cost */}
          <Text style={{fontSize: wp(4), marginTop: 10}}>
            Total Tokens: {totalTokens} | Estimated Cost: $
            {totalCost.toFixed(4)}
          </Text>

          <View
            style={{height: hp(58)}}
            className="bg-neutral-100 rounded-3xl p-4">
            <ScrollView
              ref={scrollViewRef}
              bounces={false}
              className="space-y-4"
              showsVerticalScrollIndicator={false}>
              {messages.map((message, index) => {
                if (message.role === 'assistant') {
                  return (
                    <View
                      key={index}
                      style={{width: wp(70)}}
                      className="bg-green-200 rounded-xl p-2 rounded-tl-none">
                      <Text>{message.content}</Text>
                    </View>
                  );
                } else {
                  return (
                    <View key={index} className="flex-row justify-end">
                      <View
                        style={{width: wp(70)}}
                        className="bg-white rounded-xl p-2 rounded-tr-none">
                        <Text>{message.content}</Text>
                      </View>
                    </View>
                  );
                }
              })}
            </ScrollView>
          </View>
        </View>

        {/* recording clead and stop buttons */}
        <View className="flex-row justify-center items-center p-5 mt-16">
          {loading ? (
            <ActivityIndicator size="large" />
          ) : recording ? (
            <TouchableOpacity onPress={stopRecording}>
              <MicrophoneLoading />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={startRecording}>
              <Image
                source={require('../../assets/images/microphone.png')}
                style={{width: wp(12), height: hp(7)}}
              />
            </TouchableOpacity>
          )}

          {messages.length > 0 && (
            <TouchableOpacity
              onPress={clearMessages}
              className="absolute right-8 bg-gray-600 p-2 rounded-lg">
              <Text style={{fontSize: wp(4)}} className="text-white">
                Clear
              </Text>
            </TouchableOpacity>
          )}

          {speacking && (
            <TouchableOpacity
              onPress={stopSpeacking}
              className="absolute left-8 bg-red-500 p-2 rounded-lg">
              <Text style={{fontSize: wp(4)}} className="text-white">
                Stop
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
}
