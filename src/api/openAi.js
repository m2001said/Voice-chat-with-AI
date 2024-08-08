import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from '@google/generative-ai';
import {GEMINI_API} from '@env';

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
  },
];

// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(GEMINI_API);

const model = genAI.getGenerativeModel(
  {model: 'gemini-1.5-flash'},
  safetySettings,
);

export default model;

// ------open ai
// import axios from 'axios';

// const client = axios.create({
//   headers: {
//     Authorization: 'Bearer ' + apiKey,
//     'Content-Type': 'application/json',
//   },
// });

// export const apiCall = async (prompt, messages) => {
//   try {
//     console.log('API Key:', apiKey);
//     const res = await client.post(
//       'https://api.openai.com/v1/chat/completions',
//       {
//         model: 'gpt-3.5-turbo',
//         messages: [
//           {
//             role: 'user',
//             content: 'create a list of all java keywords',
//           },
//         ],
//       },
//     );
//     console.log('====================================');
//     console.log('data:', res.data);
//     console.log('====================================');

//     let answer = res.data?.choices[0]?.message?.content;
//     messages.push({role: 'system', content: answer.trim()});
//     return Promise.resolve({success: true, data: messages});
//   } catch (error) {
//     console.log('error in apiCall: ', error);
//     return Promise.reject(error);
//   }
// };
