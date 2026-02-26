import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import remarkParse from "remark-parse";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import rehypeStringify from "rehype-stringify";
import { CodeBlock } from "./CodeBlock";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { LinkPreview } from "./LinkPreview";
import React from "react";
import {
  Link,
  Info,
  Lightbulb,
  AlertTriangle,
  AlertCircle,
  Flame,
} from "lucide-react";
import { toast } from "sonner";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

// GitHub-style alert types
const ALERT_TYPES = {
  NOTE: {
    icon: Info,
    className: "border-blue-500/50 bg-blue-500/10 [&>svg]:text-blue-500",
  },
  TIP: {
    icon: Lightbulb,
    className: "border-green-500/50 bg-green-500/10 [&>svg]:text-green-500",
  },
  IMPORTANT: {
    icon: AlertCircle,
    className: "border-purple-500/50 bg-purple-500/10 [&>svg]:text-purple-500",
  },
  WARNING: {
    icon: AlertTriangle,
    className: "border-yellow-500/50 bg-yellow-500/10 [&>svg]:text-yellow-500",
  },
  CAUTION: {
    icon: Flame,
    className: "border-red-500/50 bg-red-500/10 [&>svg]:text-red-500",
  },
} as const;

type AlertType = keyof typeof ALERT_TYPES;

// Parse GitHub-style alert from blockquote children
function parseGitHubAlert(
  children: React.ReactNode
): { type: AlertType; content: React.ReactNode } | null {
  const childArray = React.Children.toArray(children);

  for (const child of childArray) {
    if (!React.isValidElement(child)) continue;

    const element = child as React.ReactElement<{ children?: React.ReactNode }>;
    const grandchildren = React.Children.toArray(element.props?.children);
    for (let i = 0; i < grandchildren.length; i++) {
      const gc = grandchildren[i];
      if (typeof gc === "string") {
        const match = gc.match(/^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*/);
        if (match) {
          const alertType = match[1] as AlertType;
          const remainingText = gc.replace(match[0], "");

          // Rebuild content without the alert marker
          const newGrandchildren = [
            ...grandchildren.slice(0, i),
            remainingText,
            ...grandchildren.slice(i + 1),
          ].filter((c) => c !== "");

          const newChild = React.cloneElement(
            child as React.ReactElement,
            {},
            ...newGrandchildren
          );
          const newChildren = [
            ...childArray.slice(0, childArray.indexOf(child)),
            newChild,
            ...childArray.slice(childArray.indexOf(child) + 1),
          ];

          return { type: alertType, content: newChildren };
        }
      }
    }
  }

  return null;
}

interface BlogContentProps {
  content: string;
}

// Generate a slug from heading text
function generateSlug(children: React.ReactNode): string {
  const text = React.Children.toArray(children)
    .map((child) => {
      if (typeof child === "string") return child;
      if (React.isValidElement(child)) {
        const element = child as React.ReactElement<{ children?: React.ReactNode }>;
        if (element.props?.children) {
          return generateSlug(element.props.children);
        }
      }
      return "";
    })
    .join("");

  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

// Copy anchor link to clipboard
function copyAnchorLink(slug: string) {
  const url = `${window.location.origin}${window.location.pathname}#${slug}`;
  navigator.clipboard.writeText(url);
  toast.success("Link copied to clipboard");
}

// Heading component with anchor link
function Heading({
  level,
  children,
  className,
}: {
  level: 1 | 2 | 3 | 4;
  children: React.ReactNode;
  className: string;
}) {
  const slug = generateSlug(children);
  const Tag = `h${level}` as const;

  return (
    <Tag id={slug} className={`${className} group relative scroll-mt-20`}>
      {children}
      <button
        onClick={() => copyAnchorLink(slug)}
        className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity inline-flex items-center text-muted-foreground hover:text-primary"
        aria-label="Copy link to heading"
      >
        <Link className="h-4 w-4" />
      </button>
    </Tag>
  );
}

// Check if a paragraph contains only a single link (standalone link)
function isStandaloneLink(children: React.ReactNode): { href: string } | null {
  const childArray = React.Children.toArray(children);

  if (childArray.length !== 1) return null;

  const child = childArray[0];
  if (React.isValidElement(child)) {
    const element = child as React.ReactElement<{ href?: string }>;
    if (element.props?.href) {
      return { href: element.props.href };
    }
  }

  return null;
}

export function BlogContent({ content }: BlogContentProps) {
  return (
    <div className="prose-warm">
      <ReactMarkdown
        remarkPlugins={[
          remarkParse,
          remarkGfm,
          [remarkRehype, { allowDangerousHtml: true }],
          rehypeRaw,
          rehypeSanitize,
          rehypeStringify,
        ]}
        components={{
          h1: ({ children }) => (
            <Heading
              level={1}
              className="font-display text-3xl font-bold text-foreground mt-10 mb-6"
            >
              {children}
            </Heading>
          ),
          h2: ({ children }) => (
            <Heading
              level={2}
              className="font-display text-2xl font-bold text-foreground mt-8 mb-4"
            >
              {children}
            </Heading>
          ),
          h3: ({ children }) => (
            <Heading
              level={3}
              className="font-display text-xl font-semibold text-foreground mt-6 mb-3"
            >
              {children}
            </Heading>
          ),
          h4: ({ children }) => (
            <Heading
              level={4}
              className="font-display text-lg font-semibold text-foreground mt-4 mb-2"
            >
              {children}
            </Heading>
          ),
          p: ({ children }) => {
            const standaloneLink = isStandaloneLink(children);
            if (standaloneLink) {
              return <LinkPreview href={standaloneLink.href} />;
            }

            return (
              <p className="text-muted-foreground leading-relaxed mb-4">
                {children}
              </p>
            );
          },
          a: ({ href, children, ...props }) => {
            const isHashLink = href?.startsWith("#");
            const isExternal = href?.startsWith("http");

            return (
              <a
                {...props}
                href={href}
                className={`text-primary hover:underline ${
                  props.className ?? ""
                }`}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noopener noreferrer" : undefined}
                onClick={(e) => {
                  props.onClick?.(e as React.MouseEvent<HTMLAnchorElement>);
                  if (!isHashLink) return;

                  e.preventDefault();

                  const hash = (href || "").replace(/^#/, "");
                  const candidates = [
                    hash,
                    hash.startsWith("user-content-")
                      ? hash.replace(/^user-content-/, "")
                      : `user-content-${hash}`,
                  ];

                  const targetId = candidates.find((id) =>
                    document.getElementById(id)
                  );
                  if (!targetId) return;

                  document
                    .getElementById(targetId)
                    ?.scrollIntoView({ behavior: "smooth" });
                  window.history.pushState(null, "", `#${targetId}`);
                }}
              >
                {children}
              </a>
            );
          },
          ul: ({ children }) => (
            <ul className="list-disc list-inside text-muted-foreground mb-4 space-y-2">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside text-muted-foreground mb-4 space-y-2">
              {children}
            </ol>
          ),
          li: ({ node, children, ...props }) => {
            // Strip paragraph wrapper that react-markdown adds to list items
            const content = React.Children.map(children, (child) => {
              if (
                React.isValidElement(child) &&
                (child.type as { name?: string }).name === "p"
              ) {
                const element = child as React.ReactElement<{ children?: React.ReactNode }>;
                return element.props?.children;
              }
              return child;
            });

            const rawId =
              (props as Record<string, unknown>).id ??
              (node as { properties?: { id?: string } })?.properties?.id ??
              (node as { data?: { hProperties?: { id?: string } } })?.data?.hProperties?.id;

            const { id: _ignoredId, ...restProps } = props as Record<string, unknown>;

            const userContentId = rawId
              ? (rawId as string).startsWith("user-content-")
                ? rawId
                : `user-content-${rawId}`
              : undefined;

            return (
              <li
                id={rawId as string | undefined}
                className="text-muted-foreground scroll-mt-20"
                {...restProps}
              >
                {userContentId && userContentId !== rawId ? (
                  <span id={userContentId as string} className="sr-only" />
                ) : null}
                {content}
              </li>
            );
          },
          section: ({ children, ...props }) => {
            // Handle footnotes section created by remark-gfm
            const dataFootnotes = (props as Record<string, unknown>)["data-footnotes"];
            if (dataFootnotes !== undefined) {
              return (
                <section
                  data-footnotes
                  className="mt-8 pt-8 border-t border-border"
                  {...props}
                >
                  {children}
                </section>
              );
            }
            return <section {...props}>{children}</section>;
          },
          blockquote: ({ children }) => {
            const alertData = parseGitHubAlert(children);

            if (alertData) {
              const { type, content } = alertData;
              const { icon: Icon, className } = ALERT_TYPES[type];

              return (
                <Alert className={`my-4 ${className}`}>
                  <Icon className="h-4 w-4" />
                  <AlertTitle className="font-semibold capitalize">
                    {type.toLowerCase()}
                  </AlertTitle>
                  <AlertDescription className="[&_p]:mb-0 [&_p]:text-current">
                    {content}
                  </AlertDescription>
                </Alert>
              );
            }

            return (
              <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground my-4">
                {children}
              </blockquote>
            );
          },
          code: ({ className, children }) => {
            const match = /language-(\w+)/.exec(className || "");
            const isInline = !match;

            if (isInline) {
              return (
                <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono text-foreground">
                  {children}
                </code>
              );
            }

            // Parse language and meta: e.g. "language-bash:title=install.sh"
            const fullMatch = /language-([^:]+)(?::title=(.+))?/.exec(className || "");
            const lang = fullMatch?.[1] ?? match[1];
            const filename = fullMatch?.[2];
            const isTerminal = ["terminal", "console", "shell"].includes(lang);

            return (
              <CodeBlock
                code={String(children).replace(/\n$/, "")}
                language={isTerminal ? "bash" : lang}
                filename={filename}
                terminal={isTerminal}
              />
            );
          },
          pre: ({ children }) => <>{children}</>,
          table: ({ children }) => (
            <div className="overflow-x-auto my-4">
              <table className="min-w-full border-collapse border border-border">
                {children}
              </table>
            </div>
          ),
          th: ({ children }) => (
            <th className="border border-border bg-muted px-4 py-2 text-left font-semibold text-foreground">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border border-border px-4 py-2 text-muted-foreground">
              {children}
            </td>
          ),
          hr: () => <hr className="border-border my-8" />,
          img: ({ src, alt, title }) => {
            const image = (
              <OptimizedImage
                src={src || ""}
                alt={alt || ""}
                className="rounded-lg max-w-full"
                responsive
              />
            );

            if (title) {
              return (
                <figure className="my-4 inline-block">
                  {image}
                  <figcaption className="text-sm text-muted-foreground mt-2 italic">
                    {title}
                  </figcaption>
                </figure>
              );
            }

            return <div className="my-4">{image}</div>;
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
