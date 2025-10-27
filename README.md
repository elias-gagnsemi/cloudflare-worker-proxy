# Simple OpenAI Proxy Cloudflare Worker

A production-ready Cloudflare Worker that acts as a proxy for OpenAI API requests.

## Features

- **POST /analyze**: Forwards requests to OpenAI's Responses API
- **GET /health**: Health check endpoint
- Streams request body directly (no buffering)
- Preserves status codes and headers from OpenAI responses

## Setup

1. Install dependencies:
```bash
npm install
```

2. Login to Cloudflare (if not already):
```bash
npx wrangler login
```

3. Set the OpenAI API key as a Worker secret:
```bash
npx wrangler secret put OPENAI_API_KEY
```
This will prompt you to enter your OpenAI API key securely.

## Development

Run the worker locally:
```bash
npm run dev
```

## Deployment

Deploy to Cloudflare Workers:
```bash
npm run deploy
```

**Note:** The Responses API uses `input` instead of `messages` parameter (unlike Chat Completions API).

## Configuration

The worker uses `wrangler.toml` for configuration. The `OPENAI_API_KEY` is stored as a secret and is not included in the configuration file for security.