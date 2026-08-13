# FlowBar AI — Node.js SDK

<p align="center">
  <a href="https://flowbarai.com"><strong>flowbarai.com</strong></a> ·
  <a href="https://github.com/flowbar-api/flowbar-sdk-python">Python SDK</a>
</p>

<p align="center">
  <a href="https://github.com/flowbar-api/flowbar-sdk-node"><img src="https://img.shields.io/github/stars/flowbar-api/flowbar-sdk-node?style=flat-square&color=yellow" alt="GitHub stars"></a>
  <a href="https://github.com/flowbar-api/flowbar-sdk-node/blob/master/LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square" alt="License: MIT"></a>
  <a href="https://flowbarai.com"><img src="https://img.shields.io/badge/website-flowbarai.com-6c5ce7.svg?style=flat-square" alt="Website"></a>
  <img src="https://img.shields.io/badge/TypeScript-ES2020-3178c6.svg?style=flat-square" alt="TypeScript">
</p>

One API key for **50+ frontier AI models**. GPT · Claude · Gemini · DeepSeek · Qwen · GLM · Kimi. Fully OpenAI-compatible.

> **Pay however you want** — Waffo (430+ local methods, Apple Pay / Google Pay), WeChat, Alipay, USDT/USDC, PayPal. No foreign card required.

## Install

```bash
npm install flowbarai
# or
yarn add flowbarai
# or
pnpm add flowbarai
```

## Quick start

```ts
import FlowBar from 'flowbarai';

const client = new FlowBar({ apiKey: 'sk-...' });

// Simple chat
const reply = await client.chat('deepseek-v4-flash', 'Explain quantum computing.');
console.log(reply);

// Streaming
for await (const chunk of client.streamChat('gpt-5.6', 'Tell me a joke.')) {
  process.stdout.write(chunk);
}

// Generate an image
const images = await client.generateImage({ prompt: 'A cat in a spacesuit' });
console.log(images[0].url);

// List all models
const models = await client.listModels();
models.forEach((m) => console.log(m.id));
```

The API key defaults to the `FLOWBAR_API_KEY` environment variable, so you can omit it when the env var is set.

## Features

- **OpenAI-compatible** — drop-in base URL `https://api.flowbarai.com/v1`, keep the OpenAI SDK shape
- **50+ frontier models** — one key for chat, reasoning, vision, image, and embedding models
- **Streaming** — `streamChat()` yields content chunks as they arrive
- **Multi-turn** — `chatWithHistory()` for full conversation context
- **Images & embeddings** — `generateImage()` and `embed()`
- **TypeScript first** — full type definitions included

## Models

| Model ID | Description |
|----------|-------------|
| `gpt-5.6` | Latest frontier reasoning |
| `gpt-5.5-luna` | Balanced speed / power |
| `claude-opus-4-8` | Strongest Deep Research |
| `claude-sonnet-5` | Fast daily driver |
| `gemini-3.5-flash` | Fastest Google |
| `deepseek-v4-pro` | Best Chinese model |
| `deepseek-v4-flash` | Cheapest ($0.55/1M) |
| `qwen-3.7-max` | Alibaba strongest |
| `kimi-k3` | Moonshot reasoning |
| `glm-5.1` | Zhipu AI |
| `minimax-m2.7` | MiniMax |

Use `FlowBar.MODELS` for typed model IDs (e.g. `FlowBar.MODELS.gpt56`).

## API

### `new FlowBar(options?)`

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `apiKey` | `string` | `FLOWBAR_API_KEY` | Your FlowBar API key |
| `baseURL` | `string` | `https://api.flowbarai.com/v1` | Override the base URL |
| `timeout` | `number` | `120000` | Request timeout (ms) |
| `maxRetries` | `number` | `2` | Max retries on failure |

### Methods

| Method | Returns | Description |
|--------|---------|-------------|
| `chat(model, prompt, params?)` | `Promise<string>` | Single-turn chat |
| `chatWithHistory(model, messages, params?)` | `Promise<ChatCompletion>` | Multi-turn conversation |
| `streamChat(model, prompt, params?)` | `AsyncGenerator<string>` | Streaming chat |
| `generateImage(params)` | `Promise<Image[]>` | Image generation |
| `embed(input, model?)` | `Promise<Embedding[]>` | Embeddings |
| `listModels()` | `Promise<Model[]>` | List available models |
| `getBestDeal(category?)` | `Promise<string>` | Best-value model by category |

## Pricing

FlowBar is **5–10% below OpenRouter** on Chinese frontier models (DeepSeek, Qwen, GLM, Kimi). Top-up bonuses: $10 → +8%, $30 → +18%, $80 → +28%, $200 → +38%.

## License

MIT © [FlowBar AI](https://flowbarai.com)
