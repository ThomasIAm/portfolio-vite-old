import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, CircleX, FileText, Loader2, Sparkles } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useAISearch, type SearchResult } from '@/hooks/useAISearch';
import { cn } from '@/lib/utils';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

interface SearchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Helper to extract a meaningful title from the result
function getResultTitle(result: SearchResult): string {
  // Try to get a clean title from filename
  const filename = result.filename || '';
  const name = filename.split('/').pop() || filename;
  // Remove extension and format nicely
  return name.replace(/\.[^/.]+$/, '').replace(/-/g, ' ').replace(/_/g, ' ');
}

// Helper to get the text snippet
function getResultSnippet(result: SearchResult): string {
  const text = result.content?.[0]?.text || '';
  return text.length > 150 ? text.slice(0, 150) + '...' : text;
}

// Helper to determine route from filename
function getRouteFromResult(result: SearchResult): string | null {
  const filename = result.filename.toLowerCase();
  
  // Blog posts
  if (filename.includes('blog')) {
    const slug = filename.split('/').pop()?.replace(/\.[^/.]+$/, '');
    return slug ? `/blog/${slug}` : '/blog';
  }
  
  // Pages
  if (filename.includes('about')) return '/about';
  if (filename.includes('project')) return '/projects';
  if (filename.includes('contact')) return '/contact';
  
  // Default to null for external/unroutable content
  return null;
}

export function SearchModal({ open, onOpenChange }: Readonly<SearchModalProps>) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { results, isLoading, error, search, clearResults } = useAISearch();

  const handleResultClick = useCallback((result: SearchResult) => {
    const route = getRouteFromResult(result);
    if (route) {
      navigate(route);
      onOpenChange(false);
    }
  }, [navigate, onOpenChange]);

  const handleDialogOpenChange = useCallback((nextOpen: boolean) => {
    if (nextOpen) {
      setQuery('');
      setSelectedIndex(0);
      clearResults();
      setTimeout(() => inputRef.current?.focus(), 100);
    }
    onOpenChange(nextOpen);
  }, [clearResults, onOpenChange]);

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query.trim().length >= 2) {
        search(query);
      } else {
        clearResults();
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query, search, clearResults]);

  // Keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(i => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(i => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      e.preventDefault();
      handleResultClick(results[selectedIndex]);
    } else if (e.key === 'Escape') {
      onOpenChange(false);
    }
  }, [results, selectedIndex, onOpenChange, handleResultClick]);

  return (
    <Dialog open={open} onOpenChange={handleDialogOpenChange}>
      <DialogContent 
        className="sm:max-w-xl p-0 gap-0 overflow-hidden [&>button:last-child]:hidden"
        onKeyDown={handleKeyDown}
      >
        <VisuallyHidden>
          <DialogTitle>Search</DialogTitle>
        </VisuallyHidden>
        
        {/* Search Input */}
        <div className="flex items-center border-b border-border px-4">
          <Search className="h-5 w-5 text-muted-foreground shrink-0" />
          <Input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search with AI..."
            className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-14 text-base"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1.5 rounded-md hover:bg-muted transition-colors"
              aria-label="Clear search"
            >
              <CircleX className="h-4 w-4 text-muted-foreground" />
            </button>
          )}
        </div>

        {/* Results Area */}
        <div className="max-h-[60vh] overflow-y-auto p-2">
          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-8 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
              <span>Searching...</span>
            </div>
          )}

          {/* Error State */}
          {error && !isLoading && (
            <div className="p-4 text-center text-destructive">
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !error && query.length < 2 && (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Sparkles className="h-8 w-8 mb-3 text-primary/50" />
              <p className="text-sm">Start typing to search with AI</p>
              <p className="text-xs mt-1">Powered by Cloudflare AI Search</p>
            </div>
          )}

          {/* No Results */}
          {!isLoading && !error && query.length >= 2 && results.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Search className="h-8 w-8 mb-3 opacity-50" />
              <p className="text-sm">No results found for "{query}"</p>
            </div>
          )}

          {/* Results List */}
          {!isLoading && results.length > 0 && (
            <ul className="space-y-1">
              {results.map((result, index) => {
                const route = getRouteFromResult(result);
                return (
                  <li key={result.file_id}>
                    <button
                      onClick={() => handleResultClick(result)}
                      disabled={!route}
                      className={cn(
                        "w-full text-left p-3 rounded-lg transition-colors",
                        "hover:bg-muted focus:bg-muted focus:outline-none",
                        index === selectedIndex && "bg-muted",
                        !route && "opacity-60 cursor-not-allowed"
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-md bg-primary/10 text-primary shrink-0">
                          <FileText className="h-4 w-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="font-medium text-foreground truncate capitalize">
                            {getResultTitle(result)}
                          </h4>
                          <p className="text-sm text-muted-foreground line-clamp-2 mt-0.5">
                            {getResultSnippet(result)}
                          </p>
                          <div className="flex items-center gap-2 mt-1.5">
                            <span className="text-xs text-muted-foreground/70">
                              Score: {(result.score * 100).toFixed(0)}%
                            </span>
                            {route && (
                              <span className="text-xs text-primary">
                                {route}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-border px-4 py-2 flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-muted font-mono">↑↓</kbd>
              navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-muted font-mono">↵</kbd>
              select
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-muted font-mono">esc</kbd>
              close
            </span>
          </div>
          <span className="flex items-center gap-1">
            <Sparkles className="h-3 w-3" />
            AI Search
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
