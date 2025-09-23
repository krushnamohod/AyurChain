import { Star, Users, Shield, Award } from "lucide-react";

const SocialProof = () => {
  const testimonials = [
    {
      name: "Dr. Priya Sharma",
      role: "Ayurvedic Practitioner",
      content: "Ayurchain has revolutionized how I recommend herbs to my patients. The transparency gives me confidence in prescribing authentic products.",
      rating: 5,
      avatar: "PS"
    },
    {
      name: "Raj Patel",
      role: "Health Enthusiast",
      content: "Finally, I can trace my ashwagandha from the farm to my bottle. This level of transparency was impossible before Ayurchain.",
      rating: 5,
      avatar: "RP"
    },
    {
      name: "Maya Gupta",
      role: "Wellness Coach",
      content: "My clients love being able to verify their herbal supplements. It builds trust and ensures they're getting genuine products.",
      rating: 5,
      avatar: "MG"
    }
  ];

  const stats = [
    { icon: Users, value: "50,000+", label: "Verified Users" },
    { icon: Shield, value: "99.9%", label: "Authentication Rate" },
    { icon: Award, value: "500+", label: "Partner Farms" }
  ];

  const partners = [
    "AyurVeda Labs",
    "Himalaya Wellness",
    "Traditional Roots",
    "Pure Botanicals",
    "Nature's Trust",
    "Organic India"
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-muted/30 to-background">
      <div className="container mx-auto px-4">
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-nature mb-4">
                <stat.icon className="w-8 h-8 text-primary-foreground" />
              </div>
              <div className="text-3xl font-bold text-foreground mb-2">{stat.value}</div>
              <div className="text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12">
            Trusted by <span className="bg-gradient-nature bg-clip-text text-transparent">Thousands</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-card rounded-2xl p-6 shadow-card hover:shadow-nature transition-smooth">
                {/* Rating */}
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                  ))}
                </div>

                {/* Content */}
                <p className="text-card-foreground mb-6 leading-relaxed">
                  "{testimonial.content}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-earth flex items-center justify-center text-accent-foreground font-semibold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-card-foreground">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Partners */}
        <div className="text-center">
          <h3 className="text-xl font-semibold text-foreground mb-8">Trusted Partners</h3>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-6 items-center">
            {partners.map((partner, index) => (
              <div key={index} className="bg-card rounded-xl p-4 shadow-card hover:shadow-nature transition-smooth">
                <div className="text-sm font-medium text-muted-foreground">{partner}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialProof;