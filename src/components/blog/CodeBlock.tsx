import { useEffect, useState, useRef, useMemo } from "react";
import { Copy, Check, Terminal } from "lucide-react";
import { toast } from "sonner";

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  terminal?: boolean;
}

// Singleton highlighter promise
let highlighterPromise: Promise<import("shiki").Highlighter> | null = null;

function getHighlighter() {
  if (highlighterPromise === null) {
    highlighterPromise = import("shiki").then((shiki) =>
      shiki.createHighlighter({
        themes: ["github-dark", "github-light"],
        langs: [
          "typescript",
          "javascript",
          "tsx",
          "jsx",
          "bash",
          "shell",
          "json",
          "yaml",
          "css",
          "html",
          "markdown",
          "python",
          "go",
          "rust",
          "sql",
          "dockerfile",
          "hcl",
          "toml",
          "xml",
        ],
      })
    );
  }
  return highlighterPromise;
}

// Language display names
const LANG_LABELS: Record<string, string> = {
  ts: "TypeScript",
  typescript: "TypeScript",
  js: "JavaScript",
  javascript: "JavaScript",
  tsx: "TSX",
  jsx: "JSX",
  bash: "Bash",
  shell: "Shell",
  sh: "Shell",
  json: "JSON",
  yaml: "YAML",
  yml: "YAML",
  css: "CSS",
  html: "HTML",
  md: "Markdown",
  markdown: "Markdown",
  py: "Python",
  python: "Python",
  go: "Go",
  rust: "Rust",
  rs: "Rust",
  sql: "SQL",
  dockerfile: "Dockerfile",
  hcl: "HCL",
  toml: "TOML",
  xml: "XML",
  terminal: "Terminal",
  console: "Terminal",
};

export function CodeBlock({
  code,
  language = "typescript",
  filename,
  terminal = false,
}: Readonly<CodeBlockProps>) {
  const [html, setHtml] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const trimmedCode = code.trim();
  const displayLang = LANG_LABELS[language] ?? language;
  const terminalHtml = useMemo(() => {
    if (!terminal) {
      return "";
    }

    const lines = trimmedCode.split("\n");
    const escaped = lines
      .map((line) => {
        const escapedLine = line
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;");
        return `<span class="line"><span class="terminal-prompt">$</span> ${escapedLine}</span>`;
      })
      .join("\n");

    return `<pre class="shiki terminal-pre"><code>${escaped}</code></pre>`;
  }, [terminal, trimmedCode]);

  useEffect(() => {
    let cancelled = false;

    if (terminal) {
      return;
    }

    getHighlighter().then((highlighter) => {
      if (cancelled) return;

      try {
        const result = highlighter.codeToHtml(trimmedCode, {
          lang: language,
          themes: {
            light: "github-light",
            dark: "github-dark",
          },
        });
        setHtml(result);
      } catch {
        // Language not loaded, fall back to plaintext
        const result = highlighter.codeToHtml(trimmedCode, {
          lang: "text",
          themes: {
            light: "github-light",
            dark: "github-dark",
          },
        });
        setHtml(result);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [trimmedCode, language, terminal]);

  function handleCopy() {
    navigator.clipboard.writeText(trimmedCode);
    setCopied(true);
    toast.success("Copied to clipboard");

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="code-block-wrapper my-6 rounded-xl overflow-hidden border border-border bg-card">
      {/* Header */}
      <div className="code-block-header flex items-center justify-between px-4 py-2 border-b border-border bg-muted/50">
        <div className="flex items-center gap-2">
          {terminal && (
            <div className="flex items-center gap-1.5 mr-2">
              <span className="w-3 h-3 rounded-full bg-[hsl(0,70%,60%)]" />
              <span className="w-3 h-3 rounded-full bg-[hsl(45,70%,60%)]" />
              <span className="w-3 h-3 rounded-full bg-[hsl(120,50%,50%)]" />
            </div>
          )}
          {terminal && !filename && (
            <Terminal className="h-3.5 w-3.5 text-muted-foreground" />
          )}
          <span className="text-xs font-mono text-muted-foreground">
            {filename ?? displayLang}
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Copy code"
        >
          {copied ? (
            <Check className="h-3.5 w-3.5 text-accent" />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
          <span className="hidden sm:inline">{copied ? "Copied" : "Copy"}</span>
        </button>
      </div>

      {/* Code body */}
      <div
        className="code-block-body overflow-x-auto text-sm [&_pre]:p-4 [&_pre]:m-0 [&_pre]:bg-transparent [&_code]:bg-transparent [&_.line]:leading-relaxed"
        dangerouslySetInnerHTML={{ __html: terminal ? terminalHtml : html }}
      />
    </div>
  );
}
