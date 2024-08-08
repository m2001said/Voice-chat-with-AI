import React, {useEffect, useRef, useState} from 'react';
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
import model from '../api/openAi.js';
import Tts from 'react-native-tts';
import {useRoute} from '@react-navigation/native';

export default function HomeScreen() {
  const route = useRoute();
  const {title} = route.params;

  const promptsMessages = () => {
    if (title === 'easy') {
      return [
        // {
        //   role: 'system',
        //   parts: [
        //     {
        //       text: 'تلعب دور العميل الغاضب الذي لديه شكوى بشأن منتج اشتراه. يجب أن تكون متوتراً وتطلب من المدير حل المشكلة بشكل مهني.',
        //     },
        //   ],
        // },
        {
          role: 'user',
          parts: [
            {
              text: 'أنت مدير متجر معدات. أتى إليك الآن عميل مع شكوى بشأن منتج اشتراه من متجرك. يبدو العميل مستاء جدًا، ومن مسؤوليتك التعامل مع الوضع بشكل مهني وحل المشكلة.',
            },
          ],
        },
        {
          role: 'model',
          parts: [
            {
              text: 'عذرًا، هل أنت المدير؟ لدي شكوى جدية بشأن هاتف محمول اشتريته من هنا.',
            },
          ],
        },
      ];
    } else if (title === 'moderate') {
      return [
        // {
        //   role: 'system',
        //   parts: [
        //     {
        //       text: 'تلعب دور القائد الذي يحتاج إلى تقديم ملاحظات بناءة لأحد أعضاء الفريق حول تأخره في تسليم المهام. يجب أن تكون هادئاً وبناءً في تعليقاتك.',
        //     },
        //   ],
        // },
        {
          role: 'user',
          parts: [
            {
              text: 'أنت قائد فريق في شركة تقنية. تلقى أحد أعضاء فريقك تعليقات سلبية من زملائه حول تأخره في تسليم المهام. تحتاج إلى التحدث معه وتقديم الملاحظات بطريقة بناءة.',
            },
          ],
        },
        {
          role: 'model',
          parts: [
            {
              text: 'لقد لاحظت بعض التأخير في تسليم مهامك مؤخرًا. هل يمكنك أن تشرح لي ما يحدث؟',
            },
          ],
        },
      ];
    } else if (title === 'difficult') {
      return [
        // {
        //   role: 'system',
        //   parts: [
        //     {
        //       text: 'تلعب دور العميل الصعب في التفاوض على شروط العقد. يجب أن تكون حازمًا وتطالب بشروط أفضل.',
        //     },
        //   ],
        // },
        {
          role: 'user',
          parts: [
            {
              text: 'أنت مدير مبيعات في شركة. لديك اجتماع مع عميل محتمل لتفاوض حول شروط عقد جديد. العميل معروف بصعوبته في التفاوض ومطالبه العالية. تحتاج إلى إتمام الصفقة بشروط تناسب شركتك.',
            },
          ],
        },
        {
          role: 'model',
          parts: [
            {
              text: 'أنا مهتم بالمنتج الذي تقدمونه، لكنني أعتقد أن السعر مرتفع قليلاً. هل يمكننا التفاوض بشأنه؟',
            },
          ],
        },
      ];
    }
  };

  const [messages, setMessages] = useState(promptsMessages);
  const [recording, setRecording] = useState(false);
  const [speacking, setSpeacking] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const scrollViewRef = useRef();

  const apiCall = async text => {
    if (text && typeof text === 'string') {
      const trimmedResult = text.trim();
      if (trimmedResult.length > 0) {
        let newMessages = [...messages];
        newMessages.push({role: 'user', parts: [{text: trimmedResult}]});
        setMessages([...newMessages]);

        try {
          setLoading(true);
          const chat = model.startChat({
            history: messages,
            generationConfig: {
              // maxOutputTokens: 100,
            },
          });
          const chatResult = await chat.sendMessage(trimmedResult);
          const response = await chatResult.response;
          const responseText = await response.text();
          console.log('------------------------------');
          console.log('response', response);
          console.log('------------------------------');
          console.log('text', responseText);
          console.log('------------------------------');
          setLoading(false);
          startTextTpSpeech(responseText);
          newMessages.push({role: 'model', parts: [{text: responseText}]});
          setMessages([...newMessages]);

          updateScrollView();
        } catch (error) {
          console.log('================apiCall response====================');
          console.log('error', error);
          Alert.alert('Error in apiCall', error);
        }
      }
    } else {
      console.log('Invalid result:', text);
    }
  };

  const startTextTpSpeech = message => {
    setSpeacking(true);
    // Android
    Tts.speak(message, {
      androidParams: {
        KEY_PARAM_PAN: -1,
        KEY_PARAM_VOLUME: 0.5,
        KEY_PARAM_STREAM: 'STREAM_MUSIC',
      },
    });
  };

  const clearMessages = () => {
    Tts.stop();
    setMessages([]);
  };
  const stopSpeacking = () => {
    Tts.stop();
    setSpeacking(false);
  };
  const startRecording = () => {
    Tts.stop();
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

    // tts handler
    Tts.addEventListener('tts-start', event => console.log('start', event));
    Tts.addEventListener('tts-progress', event =>
      console.log('progress', event),
    );
    Tts.addEventListener('tts-finish', event => {
      console.log('finish', event);
      setSpeacking(false);
    });
    Tts.addEventListener('tts-cancel', event => console.log('cancel', event));

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

          <View
            style={{height: hp(58)}}
            className="bg-neutral-100 rounded-3xl p-4">
            <ScrollView
              ref={scrollViewRef}
              bounces={false}
              className="space-y-4"
              showsVerticalScrollIndicator={false}>
              {messages.map((message, index) => {
                if (message.role === 'model') {
                  return (
                    <View
                      key={index}
                      style={{width: wp(70)}}
                      className="bg-green-200 rounded-xl p-2 rounded-tl-none">
                      <Text>{message.parts[0].text}</Text>
                    </View>
                  );
                } else {
                  return (
                    <View key={index} className="flex-row justify-end">
                      <View
                        style={{width: wp(70)}}
                        className="bg-white rounded-xl p-2 rounded-tr-none">
                        <Text>{message.parts[0].text}</Text>
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
