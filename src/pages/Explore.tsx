import { useState, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ItemCard from "@/components/ItemCard";
import { categories, sampleItems } from "@/lib/sample-data";
import { motion } from "framer-motion";

export default function Explore() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "all");
  const [sort, setSort] = useState(searchParams.get("sort") || "newest");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200]);

  const filtered = useMemo(() => {
    let items = [...sampleItems];
    if (search) items = items.filter((i) => i.title.toLowerCase().includes(search.toLowerCase()) || i.description.toLowerCase().includes(search.toLowerCase()));
    if (category && category !== "all") items = items.filter((i) => i.category === category);
    items = items.filter((i) => i.price >= priceRange[0] && i.price <= priceRange[1]);
    if (sort === "price-low") items.sort((a, b) => a.price - b.price);
    else if (sort === "price-high") items.sort((a, b) => b.price - a.price);
    else if (sort === "rating") items.sort((a, b) => b.rating - a.rating);
    else items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return items;
  }, [search, category, sort, priceRange]);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-secondary/30 py-8">
        <div className="container mx-auto px-4 md:px-8">
          <h1 className="text-3xl font-heading font-bold text-foreground mb-6">Explore Rentals</h1>
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search items..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
            </div>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((c) => (
                  <SelectItem key={c.name} value={c.name}>{c.icon} {c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger className="w-full md:w-48">
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
        <p className="text-sm text-muted-foreground mb-6">{filtered.length} items found</p>
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((item, i) => (
              <ItemCard key={item.id} item={item} index={i} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-xl text-muted-foreground">No items found matching your criteria.</p>
            <Button variant="outline" className="mt-4" onClick={() => { setSearch(""); setCategory("all"); }}>
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
