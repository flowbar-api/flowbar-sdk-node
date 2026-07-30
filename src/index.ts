/**
 * FlowBar AI — Official Node.js SDK
 *
 * One API key for 50+ frontier AI models.
 * GPT · Claude · Gemini · DeepSeek · Qwen · GLM · Kimi
 * OpenAI-compatible. Pay with Waffo, WeChat, Alipay, USDT, PayPal.
 *
 * @example
 * ```ts
 * import FlowBar from 'flowbarai';
 *
 * const client = new FlowBar({ apiKey: 'sk-...' });
 * const chat = await client.chat('deepseek-v4-flash', 'Explain quantum computing.');
 * ```
 *
 * @see https://flowbarai.com
 * @license MIT
 */

import OpenAI from 'openai';

// ─── Types ────────────────────────────────────────────────

export interface FlowBarOptions {
  /** Your FlowBar API key. Defaults to FLOWBAR_API_KEY env var. */
  apiKey?: string;
  /** Override the base URL (default: https://api.flowbarai.com/v1). */
  baseURL?: string;
  /** Request timeout in ms. */
  timeout?: number;
  /** Max retries on failure. */
  maxRetries?: number;
}

export interface ChatParams {
  model?: string;
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
  stop?: string | string[];
  stream?: boolean;
}

export interface ImageParams {
  model?: string;
  prompt: string;
  n?: number;
  size?: '256x256' | '512x512' | '1024x1024' | '1792x1024' | '1024x1792';
  quality?: 'standard' | 'hd';
  response_format?: 'url' | 'b64_json';
}

export type ModelCategory = 'chat' | 'image' | 'embedding' | 'audio' | 'vision' | 'code';

// ─── Recommended models (current as of 2026-07) ──────────

export const MODELS = {
  /** GPT-5.6 — latest frontier reasoning */
  gpt56: 'gpt-5.6',
  /** GPT-5.5 Luna — balanced speed/power */
  gpt55Luna: 'gpt-5.5-luna',
  /** Claude Opus 4.8 — strongest Deep Research */
  claudeOpus48: 'claude-opus-4-8',
  /** Claude Sonnet 5 — fast daily driver */
  claudeSonnet5: 'claude-sonnet-5',
  /** Gemini 3.5 Flash — fastest Google model */
  gemini35Flash: 'gemini-3.5-flash',
  /** DeepSeek V4 Pro — best Chinese model */
  deepseekV4Pro: 'deepseek-v4-pro',
  /** DeepSeek V4 Flash — fastest DeepSeek */
  deepseekV4Flash: 'deepseek-v4-flash',
  /** Qwen 3.7 Max — Alibaba's strongest */
  qwen37Max: 'qwen-3.7-max',
  /** Kimi K3 — Moonshot reasoning */
  kimiK3: 'kimi-k3',
  /** GLM 5.1 — Zhipu AI */
  glm51: 'glm-5.1',
  /** MiniMax M2.7 */
  minimaxM27: 'minimax-m2.7',
  /** Qwen Image 2.0 */
  qwenImage20: 'qwen-image-2.0',
  /** DeepSeek V4 Flash — cheapest fast model */
  cheapest: 'deepseek-v4-flash',
  /** GPT-5.6 — most capable */
  mostCapable: 'gpt-5.6',
} as const;

// ─── Client ───────────────────────────────────────────────

export class FlowBar {
  public readonly client: OpenAI;

  constructor(options: FlowBarOptions = {}) {
    const apiKey =
      options.apiKey || process.env.FLOWBAR_API_KEY || 'sk-your-api-key';
    const baseURL = options.baseURL || 'https://api.flowbarai.com/v1';

    this.client = new OpenAI({
      apiKey,
      baseURL,
      timeout: options.timeout ?? 120_000,
      maxRetries: options.maxRetries ?? 2,
    });
  }

  // ─── Chat ────────────────────────────────────────────

  /** Simple chat — one message, one response. */
  async chat(
    model: string,
    prompt: string,
    params: ChatParams = {}
  ): Promise<string> {
    const resp = await this.client.chat.completions.create({
      model,
      messages: [{ role: 'user', content: prompt }],
      temperature: params.temperature ?? 0.7,
      max_tokens: params.max_tokens ?? 2048,
      top_p: params.top_p,
      frequency_penalty: params.frequency_penalty,
      presence_penalty: params.presence_penalty,
      stop: params.stop,
      stream: false,
    });
    return resp.choices[0]?.message?.content ?? '';
  }

  /** Multi-turn conversation. */
  async chatWithHistory(
    model: string,
    messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[],
    params: ChatParams = {}
  ) {
    return this.client.chat.completions.create({
      model,
      messages,
      temperature: params.temperature ?? 0.7,
      max_tokens: params.max_tokens ?? 4096,
      top_p: params.top_p,
      frequency_penalty: params.frequency_penalty,
      presence_penalty: params.presence_penalty,
      stop: params.stop,
      stream: false,
    });
  }

  /** Streaming chat — yields content chunks as they arrive. */
  async *streamChat(
    model: string,
    prompt: string,
    params: ChatParams = {}
  ): AsyncGenerator<string> {
    const stream = await this.client.chat.completions.create({
      model,
      messages: [{ role: 'user', content: prompt }],
      temperature: params.temperature ?? 0.7,
      max_tokens: params.max_tokens ?? 4096,
      stream: true,
    });

    for await (const chunk of stream) {
      const delta = chunk.choices?.[0]?.delta?.content;
      if (delta) yield delta;
    }
  }

  // ─── Images ──────────────────────────────────────────

  /** Generate an image. Returns URL(s). */
  async generateImage(params: ImageParams) {
    const resp = await this.client.images.generate({
      model: params.model ?? 'qwen-image-2.0',
      prompt: params.prompt,
      n: params.n ?? 1,
      size: params.size ?? '1024x1024',
      quality: params.quality ?? 'standard',
      response_format: params.response_format ?? 'url',
    });
    return resp.data;
  }

  // ─── Embeddings ──────────────────────────────────────

  /** Create an embedding vector. */
  async embed(
    input: string | string[],
    model = 'text-embedding-3-small'
  ) {
    const resp = await this.client.embeddings.create({
      model,
      input,
    });
    return resp.data;
  }

  // ─── Models ──────────────────────────────────────────

  /** List all available models on FlowBar. */
  async listModels() {
    const models = await this.client.models.list();
    return models.data;
  }

  /** Get the cheapest model that meets a quality floor. */
  async getBestDeal(category: ModelCategory = 'chat'): Promise<string> {
    switch (category) {
      case 'chat':
        return MODELS.deepseekV4Flash; // $0.55/1M tokens — unbeatable value
      case 'code':
        return MODELS.claudeSonnet5;
      case 'vision':
        return MODELS.gemini35Flash;
      case 'image':
        return MODELS.qwenImage20;
      case 'embedding':
        return 'text-embedding-3-small';
      case 'audio':
        return 'whisper-1';
      default:
        return MODELS.deepseekV4Flash;
    }
  }
}

// ─── Default export ──────────────────────────────────────

export default FlowBar;
