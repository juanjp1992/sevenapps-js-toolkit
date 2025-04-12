import axios, { AxiosInstance, AxiosResponse } from 'axios';

export class ChatGPTService {
  private apiKey: string;
  private client: AxiosInstance;
  private apiUrl: string = 'https://api.openai.com/v1/completions';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.client = axios.create({
      baseURL: this.apiUrl,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
    });
  }

  // Método para generar texto con ChatGPT
  public async generateText(prompt: string, model: string = 'gpt-3.5-turbo', maxTokens: number = 150): Promise<string> {
    try {
      const response: AxiosResponse = await this.client.post('', {
        model: model,
        prompt: prompt,
        max_tokens: maxTokens,
        temperature: 0.7, // Puedes ajustar la temperatura para creatividad
      });

      const generatedText = response.data.choices[0].text.trim();
      return generatedText;
    } catch (error) {
      console.error('Error generating text:', error);
      throw new Error('Failed to generate text from ChatGPT');
    }
  }

  // Método para obtener información sobre los modelos disponibles
  public async getModels(): Promise<any> {
    try {
      const response: AxiosResponse = await this.client.get('/models');
      return response.data;
    } catch (error) {
      console.error('Error fetching models:', error);
      throw new Error('Failed to fetch models');
    }
  }

  // Método para obtener el estado de la API
  public async getAPIStatus(): Promise<any> {
    try {
      const response: AxiosResponse = await this.client.get('/health');
      return response.data;
    } catch (error) {
      console.error('Error fetching API status:', error);
      throw new Error('Failed to fetch API status');
    }
  }

  // Método para crear una conversación con instrucciones previas
  public async createChat(messages: { role: string, content: string }[]): Promise<string> {
    try {
      const response = await this.client.post('', {
        model: 'gpt-4',  // o 'gpt-3.5-turbo' dependiendo de tu plan
        messages: messages,
        max_tokens: 500,  // número de tokens máximos por respuesta
        temperature: 0.7,  // puedes ajustar la temperatura para controlar la creatividad
      });

      const generatedText = response.data.choices[0].message.content.trim();
      return generatedText;
    } catch (error) {
      console.error('Error generating text:', error);
      throw new Error('Failed to generate text from ChatGPT');
    }
  }
}