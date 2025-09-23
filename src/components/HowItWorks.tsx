import { MapPin, Shield, QrCode, Eye } from "lucide-react";
import processImage from "@/assets/process-icons.jpg";

const HowItWorks = () => {
  const steps = [
    {
      icon: MapPin,
      title: "Farmer Geo-tags the Harvest",
      description: "Farmers record precise location data and harvest details, creating an immutable origin record on the blockchain.",
      color: "text-primary"
    },
    {
      icon: Shield,
      title: "Data Secured on Blockchain",
      description: "All supply chain data is encrypted and stored on the blockchain, ensuring tamper-proof transparency.",
      color: "text-tech-blue"
    },
    {
      icon: QrCode,
      title: "Scan the QR Code",
      description: "Every product gets a unique QR code that instantly connects to its complete supply chain history.",
      color: "text-accent"
    },
    {
      icon: Eye,
      title: "View Complete Journey",
      description: "Access detailed information about origin, processing, testing, and journey to ensure authentic quality.",
      color: "text-primary"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-background to-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            How <span className="bg-gradient-nature bg-clip-text text-transparent">Ayurchain</span> Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our revolutionary system combines traditional Ayurvedic wisdom with cutting-edge blockchain technology 
            to ensure every herb's journey is transparent and verifiable.
          </p>
        </div>

        {/* Process Visual */}
        <div className="mb-16 max-w-4xl mx-auto">
          <img 
            src={processImage} 
            alt="Ayurchain traceability process visualization" 
            className="w-full rounded-2xl shadow-card"
          />
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className="bg-card rounded-2xl p-8 shadow-card hover:shadow-nature transition-smooth group hover:transform hover:scale-105"
            >
              <div className="text-center">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-muted to-secondary mb-6 group-hover:shadow-tech transition-smooth`}>
                  <step.icon className={`w-8 h-8 ${step.color}`} />
                </div>
                
                <div className="mb-4">
                  <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full mb-3">
                    Step {index + 1}
                  </span>
                  <h3 className="text-xl font-bold text-card-foreground">
                    {step.title}
                  </h3>
                </div>
                
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Connection Lines for Desktop */}
        <div className="hidden lg:block relative -mt-16 mb-8">
          <div className="absolute top-8 left-1/4 w-1/4 h-0.5 bg-gradient-to-r from-primary to-tech-blue"></div>
          <div className="absolute top-8 left-1/2 w-1/4 h-0.5 bg-gradient-to-r from-tech-blue to-accent"></div>
          <div className="absolute top-8 left-3/4 w-1/4 h-0.5 bg-gradient-to-r from-accent to-primary"></div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;