/**
 * Simple Cloudflare Worker that proxies OpenAI API requests
 */

export interface Env {
  OPENAI_API_KEY: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    
    // Health check endpoint
    if (request.method === 'GET' && url.pathname === '/health') {
      return new Response('ok');
    }

    // Proxy endpoint
    if (request.method === 'POST' && url.pathname === '/analyze') {
      const openaiUrl = 'https://api.openai.com/v1/responses';
      
      try {
        // Stream the request body directly to OpenAI
        const response = await fetch(openaiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${env.OPENAI_API_KEY}`,
          },
          body: request.body,
        });

        // Forward the response with the same status and headers
        return new Response(response.body, {
          status: response.status,
          statusText: response.statusText,
          headers: response.headers,
        });
      } catch (error) {
        return new Response(`Error proxying request: ${error}`, {
          status: 500,
        });
      }
    }

    // 404 for all other routes
    return new Response('Not Found', { status: 404 });
  },
};

