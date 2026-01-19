/**
 * Cloudflare Pages Function for AI Search
 * Uses the AI_SEARCH Worker binding to query the Cloudflare AI Search index
 */

interface Env {
  AI_SEARCH: {
    search: (query: string, options?: { limit?: number }) => Promise<SearchResponse>;
  };
}

interface SearchResult {
  file_id: string;
  filename: string;
  score: number;
  attributes?: Record<string, unknown>;
  content: Array<{
    id: string;
    type: string;
    text: string;
  }>;
}

interface SearchResponse {
  object: string;
  search_query: string;
  data: SearchResult[];
  has_more: boolean;
  next_page: string | null;
}

// CORS headers for cross-origin requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export const onRequestOptions: PagesFunction = async () => {
  return new Response(null, { headers: corsHeaders });
};

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  const url = new URL(request.url);
  const query = url.searchParams.get('q');

  if (!query || query.trim().length === 0) {
    return new Response(
      JSON.stringify({ error: 'Missing query parameter "q"' }),
      {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  }

  if (!env.AI_SEARCH) {
    return new Response(
      JSON.stringify({ error: 'AI_SEARCH binding not configured' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  }

  try {
    const limit = parseInt(url.searchParams.get('limit') || '10', 10);
    const results = await env.AI_SEARCH.search(query, { limit });

    return new Response(JSON.stringify(results), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=60',
        ...corsHeaders,
      },
    });
  } catch (error) {
    console.error('AI Search error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Search failed', 
        message: error instanceof Error ? error.message : 'Unknown error' 
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  }
};
