import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import {
  Award,
  BookOpen,
  ChevronDown,
  ExternalLink,
  Heart,
  ShieldCheck,
  Trophy,
} from "lucide-react";
import { AnimatedSection } from "@/components/ui/animated-section";
import { SEO } from "@/components/seo/SEO";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { OptimizedImage } from "@/components/ui/optimized-image";
const profileImage = "/assets/profile.jpg";

const INITIAL_CERTS_COUNT = 8;

// Certification type
interface CertificationColors {
  light: string;
  dark: string;
  accent: string;
}

interface Certification {
  name: string;
  year: string;
  categories: string[];
  logo?: string; // Path to badge image (e.g., "/assets/certifications/badge.png")
  proofUrl?: string; // Link to verification/proof
  infoUrl?: string; // Link to more information about the certification
  colors?: CertificationColors; // Optional custom colors for this certification
}

// Vendor color presets - use these for certification-specific branding
const vendorColors: Record<string, CertificationColors> = {
  cloudflare: {
    light: "from-orange-50/90 to-orange-100/60",
    dark: "dark:from-orange-950/40 dark:to-orange-900/25",
    accent: "bg-orange-500/20 text-orange-700 dark:text-orange-400",
  },
  redhat: {
    light: "from-red-50/90 to-red-100/60",
    dark: "dark:from-red-950/40 dark:to-red-900/25",
    accent: "bg-red-500/20 text-red-700 dark:text-red-400",
  },
  microsoft: {
    light: "from-blue-50/90 to-cyan-100/60",
    dark: "dark:from-blue-950/40 dark:to-cyan-900/25",
    accent: "bg-blue-500/20 text-blue-700 dark:text-blue-400",
  },
  google: {
    light: "from-blue-50/90 to-green-100/60",
    dark: "dark:from-blue-950/40 dark:to-green-900/25",
    accent: "bg-blue-500/20 text-blue-700 dark:text-blue-400",
  },
  aws: {
    light: "from-amber-50/90 to-orange-100/60",
    dark: "dark:from-amber-950/40 dark:to-orange-900/25",
    accent: "bg-amber-500/20 text-amber-700 dark:text-amber-400",
  },
  mongodb: {
    light: "from-green-50/90 to-emerald-100/60",
    dark: "dark:from-green-950/40 dark:to-emerald-900/25",
    accent: "bg-green-500/20 text-green-700 dark:text-green-400",
  },
  gitlab: {
    light: "from-orange-50/90 to-orange-100/60",
    dark: "dark:from-orange-950/40 dark:to-orange-900/25",
    accent: "bg-orange-500/20 text-orange-700 dark:text-orange-400",
  },
  splunk: {
    light: "from-pink-50/90 to-green-100/60",
    dark: "dark:from-pink-950/40 dark:to-green-900/25",
    accent: "bg-pink-500/20 text-pink-700 dark:text-pink-400",
  },
  onepassword: {
    light: "from-blue-50/90 to-indigo-100/60",
    dark: "dark:from-blue-950/40 dark:to-indigo-900/25",
    accent: "bg-blue-500/20 text-blue-700 dark:text-blue-400",
  },
  mendix: {
    light: "from-blue-50/90 to-sky-100/60",
    dark: "dark:from-blue-950/40 dark:to-sky-900/25",
    accent: "bg-blue-500/20 text-blue-700 dark:text-blue-400",
  },
  tryhackme: {
    light: "from-slate-50/90 to-red-100/60",
    dark: "dark:from-slate-950/40 dark:to-red-900/25",
    accent: "bg-red-500/20 text-red-700 dark:text-red-400",
  },
  phished: {
    light: "from-blue-50/90 to-teal-100/60",
    dark: "dark:from-blue-950/40 dark:to-teal-900/25",
    accent: "bg-teal-500/20 text-teal-700 dark:text-teal-400",
  },
};

// Brand colors for each category (fallback when no vendor color is specified)
const categoryColors: Record<string, CertificationColors> = {
  Cloudflare: vendorColors.cloudflare,
  "Red Hat": vendorColors.redhat,
  Cybersecurity: {
    light: "from-emerald-50/90 to-emerald-100/60",
    dark: "dark:from-emerald-950/40 dark:to-emerald-900/25",
    accent: "bg-emerald-500/20 text-emerald-700 dark:text-emerald-400",
  },
  Cloud: {
    light: "from-sky-50/90 to-sky-100/60",
    dark: "dark:from-sky-950/40 dark:to-sky-900/25",
    accent: "bg-sky-500/20 text-sky-700 dark:text-sky-400",
  },
  Development: {
    light: "from-violet-50/90 to-violet-100/60",
    dark: "dark:from-violet-950/40 dark:to-violet-900/25",
    accent: "bg-violet-500/20 text-violet-700 dark:text-violet-400",
  },
};

// All certifications with their categories
const certifications: Certification[] = [
  // Cloudflare certifications
  {
    name: "Cloudflare Accredited Services Architect",
    year: "2023",
    categories: ["Cloudflare"],
    logo: "/assets/certifications/asa.png",
    proofUrl:
      "https://university.cloudflare.com/credential/verify/260ad5dc-bb33-4fea-be51-266c8e80553e",
    infoUrl:
      "https://university.cloudflare.com/credential/verify/260ad5dc-bb33-4fea-be51-266c8e80553e",
  },
  {
    name: "Cloudflare Zero Trust Engineer",
    year: "2025",
    categories: ["Cloudflare"],
    logo: "/assets/certifications/zte.png",
    proofUrl:
      "https://university.cloudflare.com/credential/verify/b9b183ab-ff65-4c24-bc79-852aa73a08f4",
    infoUrl:
      "https://university.cloudflare.com/credential/verify/b9b183ab-ff65-4c24-bc79-852aa73a08f4",
  },
  {
    name: "Cloudflare Application Security Advanced",
    year: "2026",
    categories: ["Cloudflare"],
    logo: "/assets/certifications/appsecadv.png",
    proofUrl:
      "https://university.cloudflare.com/credential/verify/a52c3432-e2a9-445b-9ee6-e01e63484116",
    infoUrl:
      "https://university.cloudflare.com/credential/verify/a52c3432-e2a9-445b-9ee6-e01e63484116",
  },
  {
    name: "Cloudflare Application Security Fundamentals",
    year: "2025",
    categories: ["Cloudflare"],
    logo: "/assets/certifications/appsecfund.png",
    proofUrl:
      "https://university.cloudflare.com/credential/verify/dc1f34c3-dc59-11f0-815e-42010a400fdb",
    infoUrl:
      "https://university.cloudflare.com/credential/verify/dc1f34c3-dc59-11f0-815e-42010a400fdb",
  },
  {
    name: "Cloudflare Accredited Configuration Engineer",
    year: "2025",
    categories: ["Cloudflare"],
    logo: "/assets/certifications/ace.png",
    proofUrl:
      "https://university.cloudflare.com/credential/verify/446f6fad-4737-477d-8db0-f425a704c134",
    infoUrl:
      "https://university.cloudflare.com/credential/verify/446f6fad-4737-477d-8db0-f425a704c134",
  },
  {
    name: "Cloudflare Developers Platform Fundamentals",
    year: "2025",
    categories: ["Cloudflare"],
    logo: "/assets/certifications/devplatfund.png",
    proofUrl:
      "https://university.cloudflare.com/credential/verify/dc1f3413-dc59-11f0-815e-42010a400fdb",
    infoUrl:
      "https://university.cloudflare.com/credential/verify/dc1f3413-dc59-11f0-815e-42010a400fdb",
  },
  {
    name: "Cloudflare Accredited MSSP - Customer Success",
    year: "2025",
    categories: ["Cloudflare"],
    logo: "/assets/certifications/asa.png",
    proofUrl: "/assets/certifications/amcs.pdf",
  },
  {
    name: "Cloudflare Accredited MSSP - Services Management",
    year: "2025",
    categories: ["Cloudflare"],
    logo: "/assets/certifications/amsp.png",
    proofUrl:
      "https://university.cloudflare.com/credential/verify/f1db1fd9-e0dc-45eb-b111-47e0a884f24f",
    infoUrl:
      "https://university.cloudflare.com/credential/verify/f1db1fd9-e0dc-45eb-b111-47e0a884f24f",
  },
  {
    name: "Cloudflare Accredited MSSP - Zero Trust",
    year: "2025",
    categories: ["Cloudflare"],
    logo: "/assets/certifications/cf.svg",
    proofUrl: "/assets/certifications/amzt.pdf",
  },
  {
    name: "Cloudflare Accredited Sales Engineer",
    year: "2025",
    categories: ["Cloudflare"],
    logo: "/assets/certifications/ase.png",
    proofUrl:
      "https://university.cloudflare.com/credential/verify/18688620-b859-4e55-8563-8eee8ed3e0d4",
    infoUrl:
      "https://university.cloudflare.com/credential/verify/18688620-b859-4e55-8563-8eee8ed3e0d4",
  },
  {
    name: "Cloudflare One - Service Delivery",
    year: "2025",
    categories: ["Cloudflare"],
    logo: "/assets/certifications/cf.svg",
    proofUrl: "/assets/certifications/sdo.pdf",
  },
  {
    name: "Cloudflare Core - Service Delivery",
    year: "2025",
    categories: ["Cloudflare"],
    logo: "/assets/certifications/cf.svg",
    proofUrl: "/assets/certifications/sdc.pdf",
  },
  {
    name: "Cloudflare One Pre-Sales Track",
    year: "2025",
    categories: ["Cloudflare"],
    logo: "/assets/certifications/cf.svg",
    proofUrl: "/assets/certifications/pso.pdf",
  },
  {
    name: "Cloudflare Core Pre-Sales Track",
    year: "2025",
    categories: ["Cloudflare"],
    logo: "/assets/certifications/cf.svg",
    proofUrl: "/assets/certifications/psc.pdf",
  },
  {
    name: "Cloudflare One Sales Track",
    year: "2025",
    categories: ["Cloudflare"],
    logo: "/assets/certifications/cf.svg",
    proofUrl: "/assets/certifications/so.pdf",
  },
  {
    name: "Cloudflare Core Sales Track",
    year: "2025",
    categories: ["Cloudflare"],
    logo: "/assets/certifications/cf.svg",
    proofUrl: "/assets/certifications/sc.pdf",
  },
  {
    name: "Cloudflare Sales Professional Level II",
    year: "2025",
    categories: ["Cloudflare"],
    logo: "/assets/certifications/asp2.png",
    proofUrl:
      "https://university.cloudflare.com/credential/verify/9f8ac9de-4b3c-45b5-b989-8a275a71e6f9",
    infoUrl:
      "https://university.cloudflare.com/credential/verify/9f8ac9de-4b3c-45b5-b989-8a275a71e6f9",
  },
  {
    name: "Cloudflare Implementation Specialist - Zero Trust Services",
    year: "2023",
    categories: ["Cloudflare"],
    logo: "/assets/certifications/cis.png",
    proofUrl: "/assets/certifications/cis.pdf",
  },
  // Red Hat
  {
    name: "Red Hat Certified OpenShift Administrator",
    year: "2024",
    categories: ["Red Hat"],
    logo: "/assets/certifications/ex280.png",
    proofUrl:
      "https://www.credly.com/badges/18f84f10-92f3-4667-9641-2eaa96ad23a4",
    infoUrl: "https://www.redhat.com/en/services/certification/rhcs-paas",
  },
  // Cybersecurity
  {
    name: "1Password Business Admin",
    year: "2025",
    categories: ["Cybersecurity"],
    logo: "/assets/certifications/opba.png",
    proofUrl: "https://verify.skilljar.com/c/dp7nekvp8ety",
    infoUrl:
      "https://www.1password.academy/path/1password-for-business-administrators-certificate",
    colors: vendorColors.onepassword,
  },
  {
    name: "Splunk Efficiency and Optimization",
    year: "2024",
    categories: ["Cybersecurity"],
    logo: "/assets/certifications/splunk.png",
    proofUrl: "/assets/certifications/splunk.pdf",
    colors: vendorColors.splunk,
  },
  {
    name: "Phished Gold Level - Cyber Resilience: Advanced",
    year: "2025",
    categories: ["Cybersecurity"],
    logo: "/assets/certifications/phished-gold.svg",
    proofUrl: "/assets/certifications/phished-gold.pdf",
    infoUrl:
      "https://info.phished.io/_hcms/raw-resource?path=Academy%20Roadmap/Academy-roadmap-Gold-FEEDBACK.html&portalId=6615327&t=1713359362477&hs_preview_key=CtrNuUqBmKrAuk1LwanIuw&template_id=163886759038&hsLang=en",
    colors: vendorColors.phished,
  },
  {
    name: "Microsoft Certified: Security, Compliance, and Identity Fundamentals",
    year: "2022",
    categories: ["Cybersecurity", "Cloud"],
    logo: "/assets/certifications/sc900.png",
    proofUrl:
      "https://www.credly.com/badges/05cde803-0d94-47a5-82f9-a8544f93e681",
    infoUrl:
      "https://docs.microsoft.com/learn/certifications/security-compliance-and-identity-fundamentals/",
    colors: vendorColors.microsoft,
  },
  {
    name: "TryHackMe Advent of Cyber 2021",
    year: "2021",
    categories: ["Cybersecurity"],
    logo: "/assets/certifications/thm.svg",
    proofUrl:
      "https://tryhackme-certificates.s3-eu-west-1.amazonaws.com/THM-HA7S4NNHD6.png",
    colors: vendorColors.tryhackme,
  },
  // Cloud
  {
    name: "Microsoft Certified: Azure Fundamentals",
    year: "2020",
    categories: ["Cloud"],
    logo: "/assets/certifications/az900.png",
    proofUrl:
      "https://www.credly.com/badges/352815b1-a44e-4e0f-8f47-91ffeeda86ae",
    infoUrl:
      "https://docs.microsoft.com/learn/certifications/azure-fundamentals/",
    colors: vendorColors.microsoft,
  },
  // Development
  {
    name: "Mendix Rapid Developer",
    year: "2021",
    categories: ["Development"],
    logo: "/assets/certifications/rapid.png",
    infoUrl: "https://academy.mendix.com/link/certifications/23/rapid",
    colors: vendorColors.mendix,
  },
  {
    name: "GitLab Certified Associate",
    year: "2021",
    categories: ["Development"],
    logo: "/assets/certifications/cga.png",
    proofUrl:
      "https://www.credly.com/badges/67afd7d7-b335-419a-91bc-61661bf7b0ab",
    infoUrl: "https://university.gitlab.com/pages/certifications",
    colors: vendorColors.gitlab,
  },
  {
    name: "Object Oriented PHP",
    year: "2019",
    categories: ["Development"],
    proofUrl: "https://www.udemy.com/certificate/UC-8G20KC5A/",
    infoUrl:
      "https://www.udemy.com/course/learn-object-oriented-php-by-building-a-complete-website/",
  },
  {
    name: "M001: MongoDB Basics",
    year: "2018",
    categories: ["Development"],
    logo: "/assets/certifications/mongo.jpg",
    proofUrl:
      "https://university.mongodb.com/course_completion/27a523a4-712f-432c-9a0a-1f20c1a9",
    colors: vendorColors.mongodb,
  },
];

// Get all unique categories and count certs per category
const categories = [
  ...new Set(certifications.flatMap((cert) => cert.categories)),
];

const getCertsByCategory = (category: string) =>
  certifications.filter((cert) => cert.categories.includes(category));

const values = [
  {
    icon: BookOpen,
    title: "Continuous Learning",
    description:
      "Staying up-to-date with the latest tools and techniques to shield businesses from cyber threats.",
  },
  {
    icon: Heart,
    title: "Team Growth",
    description:
      "Creating collaborative environments where teams learn from each other and continuously develop their skills.",
  },
  {
    icon: Award,
    title: "Clear Communication",
    description:
      "Breaking down complex concepts into clear, engaging terms that empower individuals within organizations.",
  },
];

export default function About() {
  const [expandedCategories, setExpandedCategories] = useState<
    Record<string, boolean>
  >({});

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) => ({ ...prev, [category]: !prev[category] }));
  };

  return (
    <Layout>
      <SEO
        title="About"
        description="Learn about Thomas van den Nieuwenhoff - Lead Cyber Security Consultant with certifications in Cloudflare, Zero Trust, and OpenShift."
        canonical="/about"
        type="profile"
        keywords={[
          "cyber security expert",
          "Cloudflare Solutions Architect",
          "Zero Trust Engineer",
          "OpenShift Administrator",
          "SALT Cyber Security",
        ]}
      />
      {/* Hero Section */}
      <section className="py-20 md:py-28 bg-gradient-hero">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="flex-shrink-0 animate-fade-up">
                <span className="absolute -right-5 bottom-5 text-xs font-semibold text-primary-foreground bg-primary px-2 py-1 rounded-full shadow-md z-10">
                  Me
                </span>
                <OptimizedImage
                  src={profileImage}
                  alt="Thomas van den Nieuwenhoff"
                  className="w-48 h-48 md:w-56 md:h-56 rounded-2xl object-cover shadow-card"
                  preset="avatarLarge"
                  showSkeleton={false}
                />
              </div>
              <div
                className="text-center md:text-left animate-fade-up"
                style={{ animationDelay: "0.1s" }}
              >
                <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
                  About Me
                </h1>
                <p className="text-xl text-muted-foreground">
                  Lead Cyber Security Consultant with a passion for empowering
                  businesses in the digital realm.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Journey Timeline */}
      <section className="py-20 md:py-28">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <AnimatedSection className="text-center mb-16">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                My Journey
              </h2>
              <p className="text-muted-foreground">
                A path driven by curiosity and continuous growth
              </p>
            </AnimatedSection>

            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-accent to-primary/30 md:-translate-x-0.5" />

              {/* Milestone 1 */}
              <AnimatedSection
                variant="fade-right"
                delay={100}
                className="relative mb-12"
              >
                <div className="flex items-start gap-6 md:block">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary shadow-lg shadow-primary/30 flex items-center justify-center z-10 md:absolute md:left-1/2 md:-translate-x-1/2">
                    <ShieldCheck className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <div className="flex-1 md:w-1/2 md:ml-auto md:pl-12">
                    <div className="p-6 rounded-2xl bg-card shadow-soft border border-border/50">
                      <span className="text-sm font-medium text-primary mb-2 block">
                        Foundation
                      </span>
                      <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                        Tech Background & Expertise
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        With years of experience and a robust tech background, I
                        focus on guiding my team and clients to success in the
                        dynamic cyber security landscape. As a certified
                        Cloudflare Solutions Architect and OpenShift
                        Administrator, I stay current with the latest tools and
                        techniques.
                      </p>
                    </div>
                  </div>
                </div>
              </AnimatedSection>

              {/* Milestone 2 */}
              <AnimatedSection
                variant="fade-left"
                delay={200}
                className="relative mb-12"
              >
                <div className="flex items-start gap-6 md:block">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent shadow-lg shadow-accent/30 flex items-center justify-center z-10 md:absolute md:left-1/2 md:-translate-x-1/2">
                    <Heart className="w-4 h-4 text-accent-foreground" />
                  </div>
                  <div className="flex-1 md:w-1/2 md:pr-12 md:text-right">
                    <div className="p-6 rounded-2xl bg-card shadow-soft border border-border/50">
                      <span className="text-sm font-medium text-accent mb-2 block">
                        Leadership
                      </span>
                      <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                        Team Growth & Collaboration
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        My role as lead consultant extends beyond finding
                        solutions — I'm committed to creating a collaborative
                        and supportive environment within my team, where we
                        learn from each other and continuously develop our
                        skills.
                      </p>
                    </div>
                  </div>
                </div>
              </AnimatedSection>

              {/* Milestone 3 */}
              <AnimatedSection
                variant="fade-right"
                delay={300}
                className="relative"
              >
                <div className="flex items-start gap-6 md:block">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary shadow-lg shadow-primary/30 flex items-center justify-center z-10 md:absolute md:left-1/2 md:-translate-x-1/2">
                    <BookOpen className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <div className="flex-1 md:w-1/2 md:ml-auto md:pl-12">
                    <div className="p-6 rounded-2xl bg-card shadow-soft border border-border/50">
                      <span className="text-sm font-medium text-primary mb-2 block">
                        Philosophy
                      </span>
                      <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                        Education & Empowerment
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        I believe cybersecurity isn't just about implementing
                        technology — it's about educating and empowering
                        individuals within organizations. I communicate clearly
                        and engagingly with clients, breaking down complex
                        concepts in an understandable way.
                      </p>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 md:py-28 bg-muted/50">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              What I Value
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {values.map((value, index) => (
              <div
                key={value.title}
                className="p-8 rounded-2xl bg-card shadow-soft animate-fade-up"
                style={{ animationDelay: `${0.1 * (index + 1)}s` }}
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                  <value.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                  {value.title}
                </h3>
                <p className="text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications Trophy Section */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-background to-muted/30">
        <div className="container">
          <AnimatedSection className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Certifications & Achievements
            </h2>
            <p className="text-muted-foreground">Proudly earned credentials</p>
          </AnimatedSection>

          <Tabs defaultValue={categories[0]} className="max-w-6xl mx-auto">
            <TabsList className="flex flex-wrap justify-center gap-2 h-auto bg-transparent mb-8">
              {categories.map((category) => (
                <TabsTrigger
                  key={category}
                  value={category}
                  className="px-4 py-2 rounded-full data-[state=active]:bg-accent data-[state=active]:text-accent-foreground"
                >
                  {category} ({getCertsByCategory(category).length})
                </TabsTrigger>
              ))}
            </TabsList>

            {categories.map((category) => {
              const categoryFallback =
                categoryColors[category] || categoryColors.Development;
              const allCerts = getCertsByCategory(category);
              const isExpanded = expandedCategories[category];
              const visibleCerts = isExpanded
                ? allCerts
                : allCerts.slice(0, INITIAL_CERTS_COUNT);

              return (
                <TabsContent key={category} value={category} className="mt-0">
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {visibleCerts.map((cert, index) => {
                      // Use cert-specific colors if defined, otherwise fall back to category colors
                      const colors = cert.colors || categoryFallback;
                      return (
                        <AnimatedSection
                          key={`${category}-${cert.name}`}
                          variant="scale"
                          delay={index * 50}
                        >
                          <div
                            className={`group relative p-6 rounded-2xl bg-gradient-to-b ${colors.light} ${colors.dark} border border-foreground/10 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full flex flex-col`}
                          >
                            {/* Glow effect */}
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-foreground/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                            {/* Logo or Trophy icon */}
                            <div className="relative flex justify-center mb-4">
                              {cert.logo ? (
                                <div className="w-16 h-16 md:w-20 md:h-20 overflow-hidden drop-shadow-lg flex items-center justify-center">
                                  <OptimizedImage
                                    src={cert.logo}
                                    alt={`${cert.name} badge`}
                                    className="w-full h-full object-contain"
                                    preset="thumbnail"
                                    showSkeleton={false}
                                  />
                                </div>
                              ) : (
                                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-foreground/20 to-foreground/40 flex items-center justify-center shadow-lg">
                                  <Trophy className="h-8 w-8 md:h-10 md:w-10 text-foreground drop-shadow-sm" />
                                </div>
                              )}
                            </div>

                            {/* Content */}
                            <div className="relative text-center flex-1 flex flex-col">
                              <h3 className="font-display text-sm font-bold text-foreground mb-2 leading-tight min-h-[2.5rem] flex items-center justify-center">
                                {cert.name}
                              </h3>
                              {/* Year and Links - pinned to bottom */}
                              <div className="mt-auto pt-3 flex flex-col items-center gap-2">
                                <span
                                  className={`px-3 py-1 rounded-full ${colors.accent} text-xs font-semibold`}
                                >
                                  {cert.year}
                                </span>
                                <div className="flex justify-center gap-3 min-h-[24px]">
                                  {cert.proofUrl && (
                                    <a
                                      href={cert.proofUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 transition-colors"
                                      title="Verify certification"
                                    >
                                      <ShieldCheck className="h-3.5 w-3.5" />
                                      Proof
                                    </a>
                                  )}
                                  {cert.infoUrl && (
                                    <a
                                      href={cert.infoUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 transition-colors"
                                      title="More information"
                                    >
                                      <ExternalLink className="h-3.5 w-3.5" />
                                      Info
                                    </a>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Bottom accent */}
                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 rounded-t-full bg-gradient-to-r from-amber-400 to-amber-600" />
                          </div>
                        </AnimatedSection>
                      );
                    })}
                  </div>

                  {allCerts.length > INITIAL_CERTS_COUNT && (
                    <div className="mt-8 text-center">
                      <Button
                        variant="outline"
                        size="lg"
                        onClick={() => toggleCategory(category)}
                        className="gap-2"
                      >
                        {isExpanded
                          ? "Show Less"
                          : `Show More (${
                              allCerts.length - INITIAL_CERTS_COUNT
                            } more)`}
                        <ChevronDown
                          className={`h-4 w-4 transition-transform ${
                            isExpanded ? "rotate-180" : ""
                          }`}
                        />
                      </Button>
                    </div>
                  )}
                </TabsContent>
              );
            })}
          </Tabs>
        </div>
      </section>
    </Layout>
  );
}
