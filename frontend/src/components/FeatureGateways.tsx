import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Brain, QrCode } from "lucide-react";
import { Link } from "react-router-dom";

const FeatureGateways = () => {
  const features = [
    {
      icon: QrCode,
      title: "Consumer Portal",
      description: "Scan QR codes to instantly verify product authenticity and trace the complete supply chain journey.",
      cta: "Verify Products",
      variant: "trust" as const,
      gradient: "bg-[#139436]",
      href: "/verify"
    },
    {
      icon: BookOpen,
      title: "Herb Knowledge Portal",
      description: "Comprehensive encyclopedia of Ayurvedic herbs, their benefits, sustainable sources, and traditional uses.",
      cta: "Explore Herbs",
      variant: "trust" as const,
      gradient: "bg-[#139436]",
      href: "/herb-portal"
    },
    {
      icon: Brain,
      title: "AI Assistant",
      description: "Get personalized herb recommendations, traditional recipes, and health guidance powered by AI.",
      cta: "Ask AI",
      variant: "trust" as const,
      gradient: "bg-[#139436]",
      href: "/ai-assistant"
    }
  ];

  return (
    <section id="herbs" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-wisdom font-bold text-foreground mb-6">
            Explore <span className="text-[#139436]">Ayurchain</span>
          </h2>
          <p className="text-xl font-modern text-muted-foreground max-w-3xl mx-auto">
            Three powerful gateways to authentic Ayurvedic wisdom, each designed to serve your unique needs 
            in the journey toward natural wellness.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div 
              key={index}
              className={`group relative overflow-hidden rounded-3xl wisdom-card hover:shadow-wisdom transition-premium card-lift animate-fade-in-up opacity-0 [animation-fill-mode:forwards]`}
              style={{ animationDelay: `${index * 200}ms` }}
            >
              {/* Background Gradient */}
              <div className={`absolute inset-0 ${feature.gradient} opacity-5 group-hover:opacity-10 transition-premium`}></div>

              <div className="relative p-8">
                {/* Icon */}
                <div className="mb-6">
                  <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl ${feature.gradient} group-hover:shadow-trust transition-premium group-hover:animate-glow`}>
                    <feature.icon className="w-10 h-10 text-primary-foreground transition-premium group-hover:scale-110 group-hover:rotate-3" />
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-2xl font-wisdom font-bold text-card-foreground mb-4 group-hover:text-primary transition-premium">
                  {feature.title}
                </h3>
                
                <p className="font-modern text-muted-foreground leading-relaxed mb-8 group-hover:text-foreground transition-premium">
                  {feature.description}
                </p>

                {/* CTA */}
                <Link
                  to={feature.href}
                  className={`inline-flex items-center justify-center w-full group-hover:shadow-lg transition-premium h-10 px-4 py-2 text-sm font-medium rounded-md ${feature.variant === 'trust' ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'border border-input bg-background hover:bg-accent hover:text-accent-foreground'}`}
                >
                  {feature.cta}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-premium" />
                </Link>
              </div>

              {/* Hover Effect Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-smooth pointer-events-none"></div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-4 bg-muted/50 rounded-2xl p-6">
            <div className="text-left">
              <h4 className="font-wisdom font-semibold text-foreground">Ready to get started?</h4>
              <p className="text-sm font-modern text-muted-foreground">Join thousands who trust Ayurchain for authentic herbs</p>
            </div>
            <Button variant="innovation" size="lg">
              Start Exploring
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureGateways;