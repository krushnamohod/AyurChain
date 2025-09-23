import { Button } from "@/components/ui/button";
import { QrCode, BookOpen, Brain, ArrowRight } from "lucide-react";

const FeatureGateways = () => {
  const features = [
    {
      icon: QrCode,
      title: "Consumer Portal",
      description: "Scan QR codes to instantly verify product authenticity and trace the complete supply chain journey.",
      cta: "Verify Products",
      variant: "hero" as const,
      gradient: "bg-gradient-nature"
    },
    {
      icon: BookOpen,
      title: "Herb Knowledge Portal",
      description: "Comprehensive encyclopedia of Ayurvedic herbs, their benefits, sustainable sources, and traditional uses.",
      cta: "Explore Herbs",
      variant: "tech" as const,
      gradient: "bg-gradient-tech"
    },
    {
      icon: Brain,
      title: "AI Assistant",
      description: "Get personalized herb recommendations, traditional recipes, and health guidance powered by AI.",
      cta: "Ask AI",
      variant: "earth" as const,
      gradient: "bg-gradient-earth"
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Explore <span className="bg-gradient-nature bg-clip-text text-transparent">Ayurchain</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Three powerful gateways to authentic Ayurvedic wisdom, each designed to serve your unique needs 
            in the journey toward natural wellness.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group relative overflow-hidden rounded-3xl bg-card shadow-card hover:shadow-nature transition-smooth"
            >
              {/* Background Gradient */}
              <div className={`absolute inset-0 ${feature.gradient} opacity-5 group-hover:opacity-10 transition-smooth`}></div>
              
              <div className="relative p-8">
                {/* Icon */}
                <div className="mb-6">
                  <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl ${feature.gradient} group-hover:shadow-tech transition-smooth`}>
                    <feature.icon className="w-10 h-10 text-primary-foreground" />
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold text-card-foreground mb-4 group-hover:text-primary transition-smooth">
                  {feature.title}
                </h3>
                
                <p className="text-muted-foreground leading-relaxed mb-8">
                  {feature.description}
                </p>

                {/* CTA */}
                <Button 
                  variant={feature.variant} 
                  className="w-full group-hover:shadow-lg transition-smooth"
                >
                  {feature.cta}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-smooth" />
                </Button>
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
              <h4 className="font-semibold text-foreground">Ready to get started?</h4>
              <p className="text-sm text-muted-foreground">Join thousands who trust Ayurchain for authentic herbs</p>
            </div>
            <Button variant="hero" size="lg">
              Start Exploring
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureGateways;