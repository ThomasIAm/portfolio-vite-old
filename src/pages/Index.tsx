import { Link } from "react-router-dom";
import { ArrowRight, Shield, Users, Lightbulb } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { AnimatedSection } from "@/components/ui/animated-section";
import { SEO } from "@/components/seo/SEO";
import { OptimizedImage } from "@/components/ui/optimized-image";
const profileImage = "/assets/profile.jpg";
const personStructuredData = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Thomas van den Nieuwenhoff",
  url: "https://tvdn.me",
  jobTitle: "Lead Cyber Security Consultant",
  worksFor: {
    "@type": "Organization",
    name: "SALT Cyber Security",
  },
  knowsAbout: [
    "Cyber Security",
    "Cloudflare",
    "Zero Trust",
    "OpenShift",
    "DevSecOps",
  ],
  sameAs: ["https://linkedin.com/in/tvdn", "https://github.com/tvdn"],
};
const highlights = [
  {
    icon: Shield,
    title: "Security Expert",
    description: (
      <>
        <a
          href="https://salt-security.com/diensten/professional-services/architecture-best-practices"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          Cloudflare Solutions Architect
        </a>
        ,{" "}
        <a
          href="https://salt-security.com/diensten/professional-services/consultancy-implementatie"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          Zero Trust Engineer
        </a>{" "}
        &{" "}
        <a
          href="https://redtrain.nl/onze-diensten/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          OpenShift Administrator
        </a>
      </>
    ),
  },
  {
    icon: Users,
    title: "Team Leader",
    description: (
      <>
        Leading Cloudflare Professional Services and mentoring colleagues at{" "}
        <a
          href="https://salt-security.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          SALT
        </a>
      </>
    ),
  },
  {
    icon: Lightbulb,
    title: "Problem Solver",
    description:
      "Breaking down complex security challenges into clear, actionable solutions",
  },
];
export default function Index() {
  return (
    <Layout>
      <SEO
        title="Thomas van den Nieuwenhoff | Lead Cyber Security Consultant"
        description="Lead Cyber Security Consultant specializing in Cloudflare, Zero Trust, and OpenShift. Empowering businesses and teams in the digital realm."
        canonical="/"
        keywords={[
          "cyber security consultant",
          "Cloudflare expert",
          "Zero Trust",
          "OpenShift administrator",
          "security architect",
          "Netherlands",
        ]}
        structuredData={personStructuredData}
      />
      {/* Hero Section */}
      <section className="bg-gradient-hero min-h-[90vh] flex items-center">
        <div className="container py-20 md:py-32">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            <AnimatedSection
              variant="fade-right"
              className="flex-1 text-center lg:text-left"
            >
              <p className="text-primary font-medium mb-4">Hi there, I'm</p>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
                Thomas van den Nieuwenhoff
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0">
                Lead Cyber Security Consultant with a passion for empowering
                businesses and teams in the digital realm.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button variant="warm" size="lg" asChild>
                  <Link to="/about">
                    Learn More About Me
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link to="/contact">Get in Touch</Link>
                </Button>
              </div>
            </AnimatedSection>

            <AnimatedSection
              variant="scale"
              delay={200}
              className="flex-shrink-0"
            >
              <div className="relative">
                <OptimizedImage
                  src={profileImage}
                  alt="Thomas van den Nieuwenhoff"
                  className="relative w-64 h-64 md:w-80 md:h-80 rounded-full object-cover shadow-card border-4 border-background"
                  preset="avatarLarge"
                  showSkeleton={false}
                  loading="eager"
                  fetchPriority="high"
                />
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Highlights Section */}
      <section className="py-20 md:py-28">
        <div className="container">
          <AnimatedSection className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              What I Bring to the Table
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              With years of experience and a robust tech background, I focus on
              guiding teams and clients to success.
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-8">
            {highlights.map((item, index) => (
              <AnimatedSection
                key={item.title}
                variant="fade-up"
                delay={index * 100}
              >
                <div className="p-8 rounded-2xl bg-card shadow-soft hover-lift h-full">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                    <item.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-muted/50">
        <div className="container">
          <AnimatedSection
            variant="scale"
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
              Let's Build Something Great Together
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Whether you're looking for security guidance, team leadership, or
              just want to connect — I'd love to hear from you.
            </p>
            <Button variant="warm" size="lg" asChild>
              <Link to="/contact">
                Start a Conversation
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </AnimatedSection>
        </div>
      </section>
    </Layout>
  );
}
