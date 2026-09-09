import { Gitlab, Github, Linkedin, Mail, Pencil, Bug, Activity } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { siteConfig } from "@/config/site";

const GITHUB_REPO = siteConfig.repoUrl;

const socialLinks = [
  { href: siteConfig.social.linkedin.href, icon: Linkedin, label: siteConfig.social.linkedin.label },
  { href: siteConfig.social.github.href, icon: Github, label: siteConfig.social.github.label },
  { href: siteConfig.social.gitlab.href, icon: Gitlab, label: siteConfig.social.gitlab.label },
  { href: `mailto:${siteConfig.contact.email.address}`, icon: Mail, label: "Email" },
];

// Map routes to source files
const routeToFile: Record<string, string> = {
  "/": "src/pages/Index.tsx",
  "/about": "src/pages/About.tsx",
  "/projects": "src/pages/Projects.tsx",
  "/blog": "src/pages/Blog.tsx",
  "/contact": "src/pages/Contact.tsx",
  "/cookies": "src/pages/Cookies.tsx",
  "/privacy": "src/pages/Privacy.tsx",
  "/notice": "src/pages/Notice.tsx",
};

function getEditUrl(pathname: string): string {
  // Check for blog post routes (e.g., /blog/some-slug)
  if (pathname.startsWith("/blog/") && pathname !== "/blog/") {
    return `${GITHUB_REPO}/edit/main/src/pages/BlogPost.tsx`;
  }
  
  // Check if route exists in map
  const currentFile = routeToFile[pathname];
  if (currentFile) {
    return `${GITHUB_REPO}/edit/main/${currentFile}`;
  }
  
  // Unknown route - just link to repo
  return GITHUB_REPO;
}

export function Footer() {
  const currentYear = new Date().getFullYear();
  const location = useLocation();
  
  const editUrl = getEditUrl(location.pathname);
  const issueUrl = `${GITHUB_REPO}/issues/new/choose`;

  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <Link 
              to="/" 
              className="font-display text-lg font-semibold text-foreground hover:text-primary transition-colors"
            >
              {siteConfig.name}
            </Link>
            <p className="text-sm text-muted-foreground mt-1">
              {siteConfig.role}
            </p>
          </div>

          <div className="flex items-center gap-4">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-200"
                aria-label={link.label}
              >
                <link.icon className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>

        <div className="mt-8 pt-8 pb-16 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            <p>© {currentYear} {siteConfig.name}</p>
            <span className="hidden sm:inline text-border">|</span>
            <div className="flex items-center gap-3">
              <Link to="/privacy" className="hover:text-foreground transition-colors">
                Privacy
              </Link>
              <Link to="/cookies" className="hover:text-foreground transition-colors">
                Cookies
              </Link>
              <Link to="/notice" className="hover:text-foreground transition-colors">
                Notice
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a
              href={editUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-muted hover:text-foreground transition-colors"
            >
              <Pencil className="h-3.5 w-3.5" />
              Edit on GitHub
            </a>
            <a
              href={issueUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-muted hover:text-foreground transition-colors"
            >
              <Bug className="h-3.5 w-3.5" />
              Open Issue
            </a>
            <a
              href={siteConfig.social.status.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-muted hover:text-foreground transition-colors"
            >
              <Activity className="h-3.5 w-3.5" />
              Status
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
