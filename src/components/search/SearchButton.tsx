import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SearchModal } from './SearchModal';
import { cn } from '@/lib/utils';

export function SearchButton() {
  const [open, setOpen] = useState(false);

  // Global keyboard shortcut (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        onClick={() => setOpen(true)}
        className={cn(
          "fixed z-[60] shadow-lg hover-lift",
          // Keep search floating bottom-left across breakpoints
          "bottom-20 left-6 h-12 w-12 rounded-full",
          // Desktop: slightly smaller but same left-side placement
          "md:h-11 md:w-11",
          // Styling
          "bg-background/95 backdrop-blur-sm border-border/50",
          "hover:bg-primary hover:text-primary-foreground hover:border-primary",
          "transition-all duration-300"
        )}
        aria-label="Open search (Ctrl+K)"
      >
        <Search className="h-5 w-5" />
      </Button>

      <SearchModal open={open} onOpenChange={setOpen} />
    </>
  );
}
