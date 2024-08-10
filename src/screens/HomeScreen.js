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
import RNFS from 'react-native-fs'; // For file system access
import AudioRecorderPlayer from 'react-native-audio-recorder-player';

export default function HomeScreen() {
  const route = useRoute();
  const {title} = route.params;
  const audioRecorderPlayer = new AudioRecorderPlayer();
  const promptsMessages = () => {
    if (title === 'easy') {
      return [
        {
          role: 'system',
          content:
            'أنت تلعب دور العميل الغاضب الذي لديه شكوى بشأن منتج اشتراه من المتجر. مهمتك هي أن تكون متوتراً وتصر على حل مشكلتك بشكل مهني. يجب ألا تقوم بدور المدير أو أي شخصية أخرى، مهما كانت الظروف. فقط تلعب دور العميل الغاضب الذي يطرح 8 أسئلة على الأقل قبل إنهاء المحادثة. تحت أي ظرف من الظروف، لا تقم بتولي دور المدير أو أي شخصية أخرى.',
        },
        {
          role: 'assistant',
          content:
            'عذرًا، هل أنت المدير؟ لدي شكوى جدية بشأن هاتف محمول اشتريته من هنا.',
        },
      ];
    } else if (title === 'moderate') {
      return [
        {
          role: 'system',
          content:
            'تلعب دور عضو الفريق الذي يحتاج إلى تقديم ملاحظات بناءة حول تأخره في تسليم المهام. يجب أن تكون متعاوناً وتوضح وجهة نظرك بوضوح. يجب عليك طرح 8 أسئلة على الأقل قبل إنهاء المحادثة.',
        },
        {
          role: 'user',
          content:
            'أنت قائد فريق في شركة تقنية. تلقى أحد أعضاء فريقك تعليقات سلبية من زملائه حول تأخره في تسليم المهام. تحتاج إلى التحدث معه وتقديم الملاحظات بطريقة بناءة.',
        },
        {
          role: 'assistant',
          content:
            'لقد لاحظت بعض التأخير في تسليم مهامك مؤخرًا. هل يمكنك أن تشرح لي ما يحدث؟ أنا عضو الفريق وأنت القائد.',
        },
      ];
    } else if (title === 'difficult') {
      return [
        {
          role: 'system',
          content:
            'تلعب دور العميل الصعب في التفاوض على شروط العقد. يجب أن تكون حازمًا وتطالب بشروط أفضل. يجب عليك طرح 8 أسئلة على الأقل قبل إنهاء المحادثة.',
        },
        {
          role: 'user',
          content:
            'أنت مدير مبيعات في شركة. لديك اجتماع مع عميل محتمل لتفاوض حول شروط عقد جديد. العميل معروف بصعوبته في التفاوض ومطالبه العالية. تحتاج إلى إتمام الصفقة بشروط تناسب شركتك.',
        },
        {
          role: 'assistant',
          content:
            'أنا مهتم بالمنتج الذي تقدمونه، لكنني أعتقد أن السعر مرتفع قليلاً. هل يمكننا التفاوض بشأنه؟ أنا العميل الصعب وأنت مدير المبيعات.',
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
        newMessages.push({role: 'user', content: trimmedResult});
        setMessages([...newMessages]);

        try {
          setLoading(true);

          // generate text from ai--------------------
          const res = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
              model: 'gpt-3.5-turbo',
              messages: messages,
            },
            {
              headers: {
                Authorization: `Bearer ${GPT_API}`,
                'Content-Type': 'application/json',
              },
            },
          );

          let answer = res.data?.choices[0]?.message?.content;
          console.log('----answer of gpt------ : ', answer);

          setLoading(false);
          startTextTpSpeech(answer);
          newMessages.push({role: 'assistant', content: answer});
          setMessages([...newMessages]);

          console.log('=======messages=============================');
          console.log(messages);
          console.log('====================================');

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

  const startTextTpSpeech = async message => {
    try {
      setSpeacking(true);

      const res = await axios.post(
        'https://api.openai.com/v1/audio/speech',
        {
          model: 'tts-1',
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
      console.error('Error in startTextTpSpeech', error);
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
  }, [result, messages]);
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
