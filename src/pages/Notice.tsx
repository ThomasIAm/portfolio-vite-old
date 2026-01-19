import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/seo/SEO";
import { ExternalLink, Heart, Sparkles } from "lucide-react";

interface Dependency {
  name: string;
  url: string;
  license: string;
  description: string;
}

const dependencies: Dependency[] = [
  { name: "React 19", url: "https://react.dev", license: "MIT", description: "UI library for building user interfaces" },
  { name: "Vite", url: "https://vitejs.dev", license: "MIT", description: "Next generation frontend build tool" },
  { name: "Tailwind CSS 4", url: "https://tailwindcss.com", license: "MIT", description: "Utility-first CSS framework" },
  { name: "TypeScript", url: "https://typescriptlang.org", license: "Apache-2.0", description: "Typed superset of JavaScript" },
  { name: "React Router 7", url: "https://reactrouter.com", license: "MIT", description: "Declarative routing for React" },
  { name: "TanStack Query", url: "https://tanstack.com/query", license: "MIT", description: "Powerful data synchronization for React" },
  { name: "Radix UI", url: "https://radix-ui.com", license: "MIT", description: "Unstyled, accessible UI primitives" },
  { name: "shadcn/ui", url: "https://ui.shadcn.com", license: "MIT", description: "Re-usable components built with Radix UI and Tailwind" },
  { name: "Lucide React", url: "https://lucide.dev", license: "ISC", description: "Beautiful & consistent icon toolkit" },
  { name: "Contentful", url: "https://contentful.com", license: "MIT", description: "Headless CMS for content management" },
  { name: "React Markdown", url: "https://github.com/remarkjs/react-markdown", license: "MIT", description: "Markdown component for React" },
  { name: "Prism React Renderer", url: "https://github.com/FormidableLabs/prism-react-renderer", license: "MIT", description: "Syntax highlighting for code blocks" },
  { name: "Unhead (React)", url: "https://unhead.unjs.io", license: "MIT", description: "Document head manager for React" },
  { name: "Cloudflare AI Search", url: "https://developers.cloudflare.com/ai-search/", license: "Proprietary", description: "AI-powered semantic search for site content" },
  { name: "date-fns 4", url: "https://date-fns.org", license: "MIT", description: "Modern JavaScript date utility library" },
  { name: "Embla Carousel", url: "https://www.embla-carousel.com", license: "MIT", description: "Lightweight carousel library with great performance" },
  { name: "Sonner 2", url: "https://sonner.emilkowal.ski", license: "MIT", description: "Opinionated toast component for React" },
  { name: "Zod 4", url: "https://zod.dev", license: "MIT", description: "TypeScript-first schema validation" },
  { name: "React Hook Form", url: "https://react-hook-form.com", license: "MIT", description: "Performant form validation library" },
  { name: "next-themes", url: "https://github.com/pacocoursey/next-themes", license: "MIT", description: "Perfect dark mode in React" },
  { name: "class-variance-authority", url: "https://cva.style", license: "Apache-2.0", description: "Class variance authority for component variants" },
  { name: "clsx", url: "https://github.com/lukeed/clsx", license: "MIT", description: "Tiny utility for constructing className strings" },
  { name: "tailwind-merge", url: "https://github.com/dcastil/tailwind-merge", license: "MIT", description: "Merge Tailwind CSS classes without style conflicts" },
  { name: "@tailwindcss/postcss", url: "https://tailwindcss.com/docs/installation/using-postcss", license: "MIT", description: "PostCSS plugin for Tailwind CSS v4" },
  { name: "Recharts 3", url: "https://recharts.org", license: "MIT", description: "Composable charting library built on React components" },
  { name: "remark-gfm", url: "https://github.com/remarkjs/remark-gfm", license: "MIT", description: "GitHub Flavored Markdown support for remark" },
  { name: "Vaul 1", url: "https://vaul.emilkowal.ski", license: "MIT", description: "Drawer component for React" },
  { name: "React Day Picker 9", url: "https://daypicker.dev", license: "MIT", description: "Flexible date picker for React" },
  { name: "React Resizable Panels 3", url: "https://github.com/bvaughn/react-resizable-panels", license: "MIT", description: "Resizable panel groups/layouts for React" },
];

export default function Notice() {
  return (
    <Layout>
      <SEO
        title="Notice & Attributions"
        description="Acknowledgments and attributions for the open-source software used in this project."
        canonical="/notice"
      />

      <section className="py-16 sm:py-24">
        <div className="container max-w-3xl">
          <h1 className="font-display text-3xl font-bold text-foreground mb-4">
            Notice & Attributions
          </h1>
          <p className="text-muted-foreground leading-relaxed mb-8">
            This project is built with the help of amazing open-source software. 
            We are grateful to the developers and maintainers of these projects.
          </p>

          {/* Lovable Shoutout */}
          <div className="mb-10 p-6 rounded-xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 relative overflow-hidden">
            <div className="absolute top-2 right-2">
              <Sparkles className="h-5 w-5 text-primary/40" />
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <Heart className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h2 className="font-display text-xl font-semibold text-foreground mb-2">
                  Built with Lovable
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  This website was created using{" "}
                  <a
                    href="https://lovable.dev"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary font-medium hover:underline"
                  >
                    Lovable
                  </a>
                  , an AI-powered development platform that makes building web applications 
                  faster and more intuitive. From design to deployment, Lovable helped bring 
                  this project to life with its intelligent code generation and seamless 
                  developer experience.
                </p>
                <a
                  href="https://lovable.dev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
                >
                  Check out Lovable
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {dependencies.map((dep) => (
              <div
                key={dep.name}
                className="p-4 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <a
                        href={dep.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-foreground hover:text-primary transition-colors inline-flex items-center gap-1.5"
                      >
                        {dep.name}
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                        {dep.license}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {dep.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 p-6 rounded-lg bg-muted/50 border border-border">
            <h2 className="font-display text-xl font-semibold text-foreground mb-3">
              License Information
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Most dependencies listed above are licensed under the MIT License, 
              which permits use, copying, modification, and distribution. Some 
              dependencies use Apache-2.0 or ISC licenses, which have similar 
              permissive terms. Please refer to each project's repository for 
              the complete license text and terms.
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
}
