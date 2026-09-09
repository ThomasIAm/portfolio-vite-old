import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { AppWindow, Blocks, CloudCog, Code, ExternalLink, Github, Gitlab, LandPlot, Linkedin, LoaderPinwheel, Lock, Server, Shield, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SEO } from "@/components/seo/SEO";
import { siteConfig } from "@/config/site";

const INITIAL_PROJECTS_COUNT = 6;

const projects = [
  {
    title: "Lead Cloudflare Professional Services",
    description: "Leading Cloudflare Professional Services at SALT Cyber Security, responsible for mentoring colleagues, identifying commercial opportunities, and delivering consulting and engineering services.",
    tags: ["Cloudflare", "Leadership", "Professional Services"],
    icon: Shield,
    url: "https://salt-security.com",
  },
  {
    title: "Identity Access Management",
    description: "Security expert for IBM Security Verify Access at Belastingdienst, managing authentication solutions (including DigiD) and creating migration plans for Red Hat OpenShift.",
    tags: ["IAM", "Security", "DigiD"],
    icon: Lock,
    url: "https://www.belastingdienst.nl/wps/wcm/connect/nl/home/content/inloggen-mijn-belastingdienst",
  },
  {
    title: "OpenShift Platform Migration",
    description: "Led OpenShift migrations at Belastingdienst, successfully onboarding developers, implementing automation with Tekton and ArgoCD, and enhancing cluster security with Advanced Cluster Security.",
    tags: ["OpenShift", "DevOps", "Kubernetes"],
    icon: Server,
  },
  {
    title: "Fully Homomorphic Encryption Research",
    description: "Conducted research on Fully Homomorphic Encryption including business applications, built a proof-of-concept weight-tracking app, and published multiple articles on the technology.",
    tags: ["Research", "Cryptography", "Innovation"],
    icon: Shield,
    url: "https://fhe.tvdn.me",
  },
  {
    title: "Wheel of No",
    description: "Built a tiny web app with a wheel of fortune that never seems to land on the expected outcome.",
    tags: ["Development", "Fun", "Prototyping"],
    icon: LoaderPinwheel,
    url: "https://benikincapabel.tvdn.me",
  },
  {
    title: "Self-Made Cloud Portal",
    description: "Automated infrastructure management using Ansible/Vagrant, and built a management interface using PHP/Bootstrap.",
    tags: ["Development", "Cloud", "Automation"],
    icon: CloudCog,
    url: "https://vm2.tvdn.me",
  },
  {
    title: "Capture-the-Flag Competition",
    description: "Put together a CTF using RootTheBox, LogonBox VPN, and VMware vCenter technologies.",
    tags: ["Hacking", "Infrastructure", "Education"],
    icon: LandPlot,
    url: "https://github.com/ThomasIAm/ais-ctf-demo",
  },
  {
    title: "Low-Code Backoffice/CRM Development",
    description: "Built a fully functional backoffice and public portfolio webapp with Mendix low-code platform.",
    tags: ["Development", "Mendix", "Innovation"],
    icon: AppWindow,
    url: "https://github.com/ThomasIAm/Young-Mountaineers",
  },
  {
    title: "Time Saving Chrome Extension",
    description: "Built an easy way to research academic sources using the Einde search engine right from the Chrome omnibox or extension bar.",
    tags: ["Development", "Chrome", "Efficiency"],
    icon: Blocks,
    url: "https://github.com/ThomasIAm/WindeSearch",
  },
  {
    title: "My First Webshop",
    description: "First time working in a team trying to build an MVP powered by PHP/Bootstrap/MySQL.",
    tags: ["Development", "Teamwork", "PHP"],
    icon: AppWindow,
    url: "https://kbsa.tvdn.me",
  },
  {
    title: "AI Sounds Interesting...",
    description: "Put together an informative website about Artificial Intelligence using Material Design.",
    tags: ["Development", "Design System", "Web2"],
    icon: Code,
    url: "https://ai.tvdn.me",
  },
  {
    title: "My First Website",
    description: "This was my first real website with information and tools I wanted handy. I was 15 years old when I made this using PHP/Material Design.",
    tags: ["Development", "Baby Steps", "Portfolio"],
    icon: Code,
    url: "https://old.tvdn.me",
  },
];

export default function Projects() {
  const [showAll, setShowAll] = useState(false);
  const visibleProjects = showAll ? projects : projects.slice(0, INITIAL_PROJECTS_COUNT);

  return (
    <Layout>
      <SEO
        title="Projects & Work"
        description={siteConfig.seo.projectsDescription}
        canonical="/projects"
        keywords={["security projects", "Cloudflare consulting", "OpenShift migration", "IAM solutions", "cyber security portfolio"]}
      />
      {/* Hero Section */}
      <section className="py-20 md:py-28 bg-gradient-hero">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center animate-fade-up">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
              Projects & Work
            </h1>
            <p className="text-xl text-muted-foreground">
              A selection of initiatives and projects I've led or contributed to.
            </p>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-20 md:py-28">
        <div className="container">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {visibleProjects.map((project, index) => (
              <article
                key={project.title}
                className="group p-8 rounded-2xl bg-card shadow-soft hover-lift animate-fade-up h-full flex flex-col"
                style={{ animationDelay: `${0.1 * (index + 1)}s` }}
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                  <project.icon className="h-6 w-6 text-primary" />
                </div>
                <h2 className="font-display text-xl font-semibold text-foreground mb-3">
                  {project.title}
                </h2>
                <p className="text-muted-foreground mb-6 flex-1">
                  {project.description}
                </p>
                <div className="mt-auto">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 rounded-full bg-muted text-muted-foreground text-xs font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  {project.url && (
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                    >
                      Visit website
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>

          {projects.length > INITIAL_PROJECTS_COUNT && (
            <div className="mt-10 text-center">
              <Button
                variant="outline"
                size="lg"
                onClick={() => setShowAll(!showAll)}
                className="gap-2"
              >
                {showAll ? "Show Less" : `Show More (${projects.length - INITIAL_PROJECTS_COUNT} more)`}
                <ChevronDown className={`h-4 w-4 transition-transform ${showAll ? "rotate-180" : ""}`} />
              </Button>
            </div>
          )}

          {/* GitHub/GitLab/LinkedIn CTA */}
          <div className="mt-16 text-center animate-fade-up" style={{ animationDelay: "0.4s" }}>
            <p className="text-muted-foreground mb-6">
              Want to see more of my work?
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button variant="outline" size="lg" asChild>
                <a
                  href="https://github.com/tvdn"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github className="mr-2 h-5 w-5" />
                  View GitHub Profile
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <a
                  href="https://gitlab.com/tvdn"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Gitlab className="mr-2 h-5 w-5" />
                  View GitLab Profile
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <a
                  href="https://www.linkedin.com/in/tvdn"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Linkedin className="mr-2 h-5 w-5" />
                  View LinkedIn Profile
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
