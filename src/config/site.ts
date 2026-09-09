const siteName = "Thomas van den Nieuwenhoff";
const siteRole = "Lead Cyber Security Consultant";
const siteUrl = "https://tvdn.me";

// Keep full profile URLs explicit because handles can differ across platforms.
const linkedinUrl = "https://linkedin.com/in/tvdn";
const githubUrl = "https://github.com/ThomasIAm";
const gitlabUrl = "https://gitlab.com/ThomasIAm";

export const siteConfig = {
  name: siteName,
  role: siteRole,
  siteUrl,
  repoUrl: "https://github.com/ThomasIAm/portfolio-vite",
  defaultDescription:
    "Lead Cyber Security Consultant specializing in Cloudflare, Zero Trust, and OpenShift. Empowering businesses and teams in the digital realm.",
  company: {
    name: "SALT Cyber Security",
    url: "https://salt-security.com",
  },
  profileImage: {
    src: "/assets/profile.jpg",
    alt: siteName,
  },
  social: {
    linkedin: {
      label: "LinkedIn",
      href: linkedinUrl,
      display: "linkedin.com/in/tvdn",
    },
    github: {
      label: "GitHub",
      href: githubUrl,
    },
    gitlab: {
      label: "GitLab",
      href: gitlabUrl,
    },
    status: {
      label: "Status",
      href: "https://status.tvdn.me",
    },
  },
  sameAs: [linkedinUrl, githubUrl, gitlabUrl],
  contact: {
    email: {
      label: "Work Email",
      address: "thomas.vandennieuwenhoff@salt-security.com",
      description: "Best for professional inquiries",
    },
    location: {
      label: "Based in the Netherlands",
      description:
        "Available for remote collaboration worldwide. Open to discussing security consulting, speaking engagements, and collaboration opportunities.",
    },
  },
  seo: {
    homeDescription:
      "Lead Cyber Security Consultant specializing in Cloudflare, Zero Trust, and OpenShift. Empowering businesses and teams in the digital realm.",
    aboutDescription: `Learn about ${siteName} - ${siteRole} with certifications in Cloudflare, Zero Trust, and OpenShift.`,
    blogDescription: `Insights on cyber security, leadership, and technology from ${siteName}. Expert articles on Cloudflare, Zero Trust, and DevSecOps.`,
    projectsDescription: `Initiatives and projects led by ${siteName} including Cloudflare Professional Services, OpenShift migrations, and IAM solutions.`,
    contactDescription: `Get in touch with ${siteName} for cyber security consulting, speaking engagements, or collaboration opportunities.`,
  },
};

export function buildSiteUrl(path = ""): string {
  if (!path) {
    return siteConfig.siteUrl;
  }

  return new URL(path, `${siteConfig.siteUrl}/`).toString();
}
