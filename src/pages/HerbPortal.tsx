import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Filter, Search } from "lucide-react";
import { Link } from "react-router-dom";

// Fake data for featured herbs based on our previous design
const featuredHerbs = [
  {
    herbName: "Ashwagandha",
    botanicalIllustrationURL: "/placeholder-images/ashwagandha-illustration.svg",
  },
  {
    herbName: "Tulsi",
    botanicalIllustrationURL: "/placeholder-images/tulsi-illustration.svg",
  },
  {
    herbName: "Brahmi",
    botanicalIllustrationURL: "/placeholder-images/brahmi-illustration.svg",
  },
  {
    herbName: "Turmeric",
    botanicalIllustrationURL: "/placeholder-images/turmeric-illustration.svg",
  },
  {
    herbName: "Gotu Kola",
    botanicalIllustrationURL: "/placeholder-images/gotu-kola-illustration.svg",
  },
  {
    herbName: "Triphala",
    botanicalIllustrationURL: "/placeholder-images/triphala-illustration.svg",
  },
];

const HerbPortal = () => {
  return (
    <div className="bg-background min-h-screen font-modern">
      <div className="container mx-auto px-4 py-16 sm:py-24">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-7xl font-wisdom font-bold text-foreground mb-4">
            The Living Apothecary
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover the ancient wisdom of Ayurvedic herbs, verified for the modern world.
          </p>
        </div>
        <div className="mb-16 max-w-3xl mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input type="text" placeholder="Search for an herb (e.g., Ashwagandha)" className="w-full pl-12 pr-4 py-6 text-lg rounded-xl" />
          </div>
          <div className="mt-4 flex justify-center">
            <Button variant="ghost">
              <Filter className="w-4 h-4 mr-2" />
              Filter by Benefit
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 md:gap-8">
          {featuredHerbs.map((herb, index) => (
            <Link to={`/herb-portal/${herb.herbName.toLowerCase().replace(' ', '-')}`} key={index} className="group block text-center wisdom-card rounded-2xl p-4 hover:shadow-wisdom transition-premium card-lift">
              <div className="aspect-square bg-muted rounded-lg flex items-center justify-center mb-4 overflow-hidden">
                <svg className="w-2/3 h-2/3 text-muted-foreground group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 12.572l-7.5 7.428-7.5-7.428m15 0A23.978 23.978 0 0012 3c-4.114 0-7.882 1.664-10.5 4.572" /></svg>
              </div>
              <h3 className="font-wisdom font-semibold text-foreground group-hover:text-primary transition-colors">{herb.herbName}</h3>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HerbPortal;