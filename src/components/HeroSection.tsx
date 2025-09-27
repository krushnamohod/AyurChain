import { Button } from "@/components/ui/button";
import { Search, Shield, Leaf } from "lucide-react";
import heroImage from "@/assets/hero-herbs.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img 
          src={heroImage} 
          alt="Ayurvedic herbs in natural setting with technology overlay" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/80 via-primary/60 to-tech-blue/40"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Trust Badge */}
          <div className="inline-flex items-center gap-2 bg-background/90 backdrop-blur-sm rounded-full px-6 py-3 mb-8 border border-primary/20">
            <Shield className="w-5 h-5 text-tech-blue" />
            <span className="text-sm font-medium text-foreground">Blockchain-Verified Authenticity</span>
          </div>
          
          {/* Main Headline */}
          <h1 className="text-5xl md:text-7xl font-wisdom font-bold text-primary-foreground mb-6 animate-slide-in-hero">
            Trust, Verified
            <br />
            <span className="bg-gradient-heritage bg-clip-text text-transparent">
              from Root to You
            </span>
          </h1>
          
          {/* Sub-headline */}
          <p className="text-xl md:text-2xl font-modern text-primary-foreground/90 mb-8 max-w-3xl mx-auto leading-relaxed animate-fade-in-up [animation-delay:200ms] opacity-0 [animation-fill-mode:forwards]">
            End-to-end transparency in Ayurvedic supply chains. From geo-tagged harvesting to your hands, 
            preventing adulteration and ensuring authentic quality.
          </p>
          
          {/* Search Bar */}
          <div className="bg-background/95 backdrop-blur-sm rounded-2xl p-6 shadow-trust mb-8 max-w-2xl mx-auto animate-fade-in-up [animation-delay:400ms] opacity-0 [animation-fill-mode:forwards]">
            <div className="relative glow-focus rounded-xl">
              <div className="flex items-center gap-4 bg-muted rounded-xl p-4 group">
                <Search className="w-6 h-6 text-muted-foreground group-focus-within:text-tech-blue transition-premium" />
                <input 
                  type="text" 
                  placeholder="Search for herbs or products (e.g., 'Ashwagandha Capsules', 'Tulsi')"
                  className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground text-lg font-modern focus:placeholder:text-muted-foreground/60 transition-premium"
                />
                <Button variant="trust" size="lg" className="shrink-0">
                  <Leaf className="w-5 h-5" />
                  Trace Now
                </Button>
              </div>
            </div>
            <p className="text-sm font-modern text-muted-foreground mt-3 text-center">
              Search by product name, herb type, or scan QR codes for instant verification
            </p>
          </div>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up [animation-delay:600ms] opacity-0 [animation-fill-mode:forwards]">
            <Button variant="wisdom" size="lg" className="text-lg px-8 py-4">
              Explore How It Works
            </Button>
            <Button variant="glass" size="lg" className="text-lg px-8 py-4">
              Watch Demo
            </Button>
          </div>
        </div>
      </div>
      
      {/* Floating Elements */}
      <div className="absolute top-1/4 left-10 w-20 h-20 bg-accent/20 rounded-full animate-float"></div>
      <div className="absolute bottom-1/4 right-10 w-32 h-32 bg-tech-blue/20 rounded-full animate-float delay-1000"></div>
    </section>
  );
};

export default HeroSection;