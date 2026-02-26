import { useState, useCallback } from 'react';

export interface SearchResult {
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

export interface SearchResponse {
  object: string;
  search_query: string;
  data: SearchResult[];
  has_more: boolean;
  next_page: string | null;
  error?: string;
}

interface UseAISearchReturn {
  results: SearchResult[];
  isLoading: boolean;
  error: string | null;
  search: (query: string) => Promise<void>;
  clearResults: () => void;
}

export function useAISearch(): UseAISearchReturn {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (query: string) => {
    if (!query.trim()) {
      setResults([]);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({ q: query, limit: '10' });
      const response = await fetch(`/api/search?${params}`);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Search failed with status ${response.status}`);
      }

      const data: SearchResponse = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      setResults(data.data || []);
    } catch (err) {
      console.error('Search error:', err);
      setError(err instanceof Error ? err.message : 'Search failed');
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearResults = useCallback(() => {
    setResults([]);
    setError(null);
  }, []);

  return { results, isLoading, error, search, clearResults };
}
