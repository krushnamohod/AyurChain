import heroImage from "@/assets/hero-herbs.jpg";
import { Button } from "@/components/ui/button";
import { Leaf, Loader2, QrCode, Search, Shield } from "lucide-react";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

/**
 * @intent HeroSection with connected search functionality
 * Searches herbs via API and navigates to verification
 */
const HeroSection = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Debounced search
  useEffect(() => {
    if (searchQuery.length < 2) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const response = await fetch(`${API_BASE}/herbs/search?q=${encodeURIComponent(searchQuery)}`);
        const data = await response.json();
        setSearchResults(data);
        setShowResults(true);
      } catch (error) {
        console.error("Search failed:", error);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleTrace = () => {
    if (searchQuery.trim()) {
      // Check if it looks like a batch ID
      if (searchQuery.toUpperCase().startsWith("BATCH") || searchQuery.length > 20) {
        navigate(`/verify/${searchQuery}`);
      } else {
        navigate(`/herb-portal?search=${encodeURIComponent(searchQuery)}`);
      }
    }
  };

  const handleScanClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log("File selected for scanning:", file.name);
      alert(`Image "${file.name}" selected. Ready for QR code processing.`);
    }
  };

  const handleResultClick = (herb: any) => {
    setShowResults(false);
    if (herb.batches && herb.batches.length > 0) {
      navigate(`/verify/${herb.batches[0].id}`);
    } else {
      navigate(`/herb-portal/${herb.commonName.toLowerCase().replace(' ', '-')}`);
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Ayurvedic herbs in natural setting with technology overlay"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#139436]/80 via-[#139436]/60 to-tech-blue/40"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Trust Badge */}
          <div className="inline-flex items-center gap-2 bg-background/50 backdrop-blur-sm rounded-full px-6 py-3 mb-8 border border-primary/20">
            <Shield className="w-5 h-5 text-tech-blue" />
            <span className="text-sm font-medium text-foreground">Blockchain-Verified Authenticity</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl md:text-7xl font-wisdom font-bold text-primary-foreground mb-6 animate-slide-in-hero">
            Trust, Verified
            <br />
            <span className="text-[#9ae6b4]">
              from Root to You
            </span>
          </h1>

          {/* Sub-headline */}
          <p className="text-xl md:text-2xl font-modern text-primary-foreground/90 mb-8 max-w-3xl mx-auto leading-relaxed animate-fade-in-up [animation-delay:200ms] opacity-0 [animation-fill-mode:forwards]">
            End-to-end transparency in Ayurvedic supply chains. From geo-tagged harvesting to your hands,
            preventing adulteration and ensuring authentic quality.
          </p>

          {/* Search Bar */}
          <div className="bg-background/95 backdrop-blur-sm rounded-2xl p-6 shadow-trust mb-8 max-w-2xl mx-auto animate-fade-in-up [animation-delay:400ms] opacity-0 [animation-fill-mode:forwards] relative">
            <div className="relative glow-focus rounded-xl ">
              <div className="flex items-center gap-4 bg-primary/10 rounded-xl p-4 group">
                {isSearching ? (
                  <Loader2 className="w-6 h-6 text-tech-blue animate-spin" />
                ) : (
                  <Search className="w-6 h-6 text-muted-foreground group-focus-within:text-tech-blue transition-premium" />
                )}
                <input
                  type="text"
                  placeholder="Search herbs or enter Batch ID (e.g., 'Ashwagandha' or 'BATCH001')"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleTrace()}
                  onFocus={() => searchResults.length > 0 && setShowResults(true)}
                  className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground text-lg font-modern focus:placeholder:text-muted-foreground/60 transition-premium"
                />
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="lg" className="shrink-0" onClick={handleTrace}>
                    <Leaf className="w-5 h-5 mr-2" />
                    Trace
                  </Button>
                  <Button variant="trust" size="lg" className="shrink-0" onClick={handleScanClick}>
                    <QrCode className="w-5 h-5 mr-2" />
                    Scan
                  </Button>
                </div>
              </div>
            </div>

            {/* Search Results Dropdown */}
            {showResults && searchResults.length > 0 && (
              <div className="absolute left-6 right-6 top-full mt-2 bg-background rounded-xl shadow-lg border border-border max-h-80 overflow-y-auto z-50">
                {searchResults.map((herb: any) => (
                  <button
                    key={herb.id}
                    onClick={() => handleResultClick(herb)}
                    className="w-full px-4 py-3 text-left hover:bg-primary/10 flex items-center gap-3 border-b border-border last:border-0"
                  >
                    <Leaf className="w-5 h-5 text-primary" />
                    <div className="flex-1">
                      <p className="font-semibold">{herb.commonName}</p>
                      <p className="text-sm text-muted-foreground">{herb.scientificName || "Ayurvedic herb"}</p>
                    </div>
                    {herb.batches && herb.batches.length > 0 && (
                      <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
                        {herb.batches.length} batch{herb.batches.length > 1 ? "es" : ""}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/*"
            />
            <p className="text-sm font-modern text-muted-foreground mt-3 text-center">
              Search by product name, herb type, or scan QR codes for instant verification
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up [animation-delay:600ms] opacity-0 [animation-fill-mode:forwards]">
            <Link to="/#how-it-works">
              <Button variant="outline" size="lg" className="text-lg px-8 py-4 w-full">
                Explore How It Works
              </Button>
            </Link>
            <Link to="/verify">
              <Button variant="glass" size="lg" className="text-lg px-8 py-4">
                Verify a Batch
              </Button>
            </Link>
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