import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Filter, Leaf, Loader2, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

/**
 * @intent HerbPortal - Displays herbs from API with search functionality
 */
const HerbPortal = () => {
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get("search") || "";

  const [herbs, setHerbs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [isSearching, setIsSearching] = useState(false);

  // Load all herbs on mount
  useEffect(() => {
    const fetchHerbs = async () => {
      try {
        const response = await fetch(`${API_BASE}/herbs`);
        const data = await response.json();
        setHerbs(data);
      } catch (error) {
        console.error("Failed to fetch herbs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHerbs();
  }, []);

  // Search with debounce
  useEffect(() => {
    if (!searchQuery || searchQuery.length < 2) {
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const response = await fetch(`${API_BASE}/herbs/search?q=${encodeURIComponent(searchQuery)}`);
        const data = await response.json();
        setHerbs(data);
      } catch (error) {
        console.error("Search failed:", error);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Reset search
  const handleClearSearch = async () => {
    setSearchQuery("");
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/herbs`);
      const data = await response.json();
      setHerbs(data);
    } catch (error) {
      console.error("Failed to fetch herbs:", error);
    } finally {
      setLoading(false);
    }
  };

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

        {/* Search Bar */}
        <div className="mb-16 max-w-3xl mx-auto">
          <div className="relative">
            {isSearching ? (
              <Loader2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-tech-blue animate-spin" />
            ) : (
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            )}
            <Input
              type="text"
              placeholder="Search for an herb (e.g., Ashwagandha)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-6 text-lg rounded-xl"
            />
          </div>
          <div className="mt-4 flex justify-center gap-4">
            <Button variant="ghost">
              <Filter className="w-4 h-4 mr-2" />
              Filter by Benefit
            </Button>
            {searchQuery && (
              <Button variant="outline" onClick={handleClearSearch}>
                Clear Search
              </Button>
            )}
          </div>
        </div>

        {/* Herbs Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
          </div>
        ) : herbs.length === 0 ? (
          <div className="text-center py-20">
            <Leaf className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-xl text-muted-foreground">No herbs found</p>
            <p className="text-sm text-muted-foreground mt-2">
              {searchQuery ? "Try a different search term" : "Add some herbs via the API"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 md:gap-8">
            {herbs.map((herb) => (
              <Link
                to={herb.batches && herb.batches.length > 0
                  ? `/verify/${herb.batches[0].id}`
                  : `/herb-portal/${herb.commonName.toLowerCase().replace(' ', '-')}`
                }
                key={herb.id}
                className="group block text-center wisdom-card rounded-2xl p-4 hover:shadow-wisdom transition-premium card-lift"
              >
                <div className="aspect-square bg-muted rounded-lg flex items-center justify-center mb-4 overflow-hidden relative">
                  {herb.imageUrl ? (
                    <img src={herb.imageUrl} alt={herb.commonName} className="w-full h-full object-cover" />
                  ) : (
                    <Leaf className="w-1/3 h-1/3 text-muted-foreground group-hover:text-primary transition-colors" />
                  )}
                  {herb.batches && herb.batches.length > 0 && (
                    <Badge className="absolute top-2 right-2 text-xs">
                      {herb.batches[0].status}
                    </Badge>
                  )}
                </div>
                <h3 className="font-wisdom font-semibold text-foreground group-hover:text-primary transition-colors">
                  {herb.commonName}
                </h3>
                {herb.scientificName && (
                  <p className="text-xs text-muted-foreground italic mt-1">{herb.scientificName}</p>
                )}
                {herb.region && (
                  <p className="text-xs text-muted-foreground mt-1">{herb.region}</p>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HerbPortal;