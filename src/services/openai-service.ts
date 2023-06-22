// TODO: finish this

import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  
const openai = new OpenAIApi(configuration);

// TODO: handle errors from openAI
export class OpenAiService {
    async getCompletionsFromOpenAi(prompts:string, n: number) {
    try {
    // const completionsFromApi = await openai
    //     .createCompletion({
    //       model: "text-davinci-003",
    //       prompt,
    //       n,
    //       max_tokens: 2048
    //     })
    console.log("PROMPTS-------------");
    console.log(prompts);

      const completionsFromApi = await openai.createChatCompletion({
          "model": "gpt-4",
          "messages": [{"role": "user", "content": prompts}],
          "max_tokens": 5000
      })
      return completionsFromApi.data.choices;
    } catch (err) {
      console.log(err);
    }
  }
}