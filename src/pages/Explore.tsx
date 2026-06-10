import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Loader2, MapPin, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ItemCard from "@/components/ItemCard";
import { RentalItem } from "@/lib/sample-data";
import { rentalAPI } from "@/lib/api";
import { indiaLocations } from "@/lib/india-locations";
import { toast } from "sonner";
import { categoryGroups, categoryMatches, parseRentalsResponse, rentalCategoryOptions, toRentalItem } from "@/lib/rentals";

export default function Explore() {
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "all");
  const [sort, setSort] = useState(searchParams.get("sort") || "newest");
  const [location, setLocation] = useState("all");
  const [availability, setAvailability] = useState("all");
  const [items, setItems] = useState<RentalItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const fetchRentals = async () => {
    setLoading(true);
    setLoadError("");
    try {
      const response = await rentalAPI.getAll();
      setItems(parseRentalsResponse(response).map(toRentalItem));
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Could not load rentals";
      setLoadError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRentals();
  }, []);

  const filtered = useMemo(() => {
    let results = [...items];
    if (search) results = results.filter((i) => i.title.toLowerCase().includes(search.toLowerCase()) || i.description.toLowerCase().includes(search.toLowerCase()));
    if (category && category !== "all") results = results.filter((i) => categoryMatches(i.category, category));
    if (location && location !== "all") results = results.filter((i) => i.location === location);
    if (availability === "available") results = results.filter((i) => i.available);
    if (availability === "rented") results = results.filter((i) => !i.available);
    if (sort === "price-low") results.sort((a, b) => a.price - b.price);
    else if (sort === "price-high") results.sort((a, b) => b.price - a.price);
    else if (sort === "rating") results.sort((a, b) => b.rating - a.rating);
    else results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return results;
  }, [items, search, category, sort, location, availability]);

  const availableCount = items.filter(i => i.available).length;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-secondary/30 py-8">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-heading font-bold text-foreground">Explore Rentals</h1>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-success/10 text-success border border-success/20">
                <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
                {availableCount} items available now
              </div>
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search items..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
            </div>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-full md:w-44">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categoryGroups.map((category) => (
                  <SelectItem key={category.name} value={category.name.toLowerCase()}>{category.name}</SelectItem>
                ))}
                {rentalCategoryOptions.map((category) => (
                  <SelectItem key={category.value} value={category.value}>{category.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={location} onValueChange={setLocation}>
              <SelectTrigger className="w-full md:w-44">
                <div className="flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                  <SelectValue placeholder="Location" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {indiaLocations.map((loc) => (
                  <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={availability} onValueChange={setAvailability}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="available">✅ Available</SelectItem>
                <SelectItem value="rented">🔴 Rented Out</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="price-low">Price: Low → High</SelectItem>
                <SelectItem value="price-high">Price: High → Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="container mx-auto px-4 md:px-8 py-8">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : loadError ? (
          <div className="text-center py-20">
            <p className="text-xl text-muted-foreground">Rentals could not be loaded.</p>
            <Button className="mt-4" onClick={fetchRentals}>Try Again</Button>
          </div>
        ) : filtered.length > 0 ? (
          <>
          <p className="text-sm text-muted-foreground mb-6">{filtered.length} items found</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((item, i) => (
              <ItemCard key={item.id} item={item} index={i} />
            ))}
          </div>
          </>
        ) : (
          <div className="text-center py-20">
            <p className="text-xl text-muted-foreground">No items found matching your criteria.</p>
            <Button variant="outline" className="mt-4" onClick={() => { setSearch(""); setCategory("all"); setLocation("all"); setAvailability("all"); }}>
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
