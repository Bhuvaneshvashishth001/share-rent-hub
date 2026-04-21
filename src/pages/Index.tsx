import { Link } from "react-router-dom";
import { Search, ArrowRight, TrendingUp, Shield, Handshake, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ItemCard from "@/components/ItemCard";
import { categories, locations, sampleItems } from "@/lib/sample-data";
import { motion } from "framer-motion";
import { useState } from "react";

const HeroSection = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("all");

  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
      <div className="container mx-auto px-4 md:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-foreground leading-tight mb-6">
            Share what you have.{" "}
            <span className="text-primary">Borrow what you need.</span>
          </h1>
          <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            Connect with your neighbors to lend and borrow tools, equipment, and everyday items. Build community, save money, and reduce waste.
          </p>
          <div className="bg-card p-4 md:p-6 rounded-xl shadow-lg border border-border max-w-2xl mx-auto">
            <form className="flex flex-col md:flex-row gap-3" onSubmit={(e) => e.preventDefault()}>
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="What are you looking for?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger className="w-full md:w-44">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                    <SelectValue placeholder="Location" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {locations.map((loc) => (
                    <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Link to={`/explore${searchQuery ? `?q=${searchQuery}` : ""}`}>
                <Button className="w-full md:w-auto">
                  Search <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </form>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-success" />
              <span>Verified Users</span>
            </div>
            <div className="flex items-center gap-2">
              <Handshake className="h-4 w-4 text-primary" />
              <span>Secure Transactions</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-accent" />
              <span>10K+ Items Listed</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const CategoriesSection = () => (
  <section className="py-16 bg-secondary/30">
    <div className="container mx-auto px-4 md:px-8">
      <h2 className="text-3xl font-heading font-bold text-center text-foreground mb-10">
        Explore Categories
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {categories.map((cat, i) => (
          <motion.div
            key={cat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <Link
              to={`/explore?category=${cat.name}`}
              className="flex flex-col items-center p-6 bg-card rounded-lg border border-border hover:shadow-md hover:border-primary/50 transition-all group"
            >
              <span className="text-3xl mb-3">{cat.icon}</span>
              <h3 className="font-heading font-bold text-foreground group-hover:text-primary transition-colors">
                {cat.name}
              </h3>
              <p className="text-xs text-muted-foreground mt-1">{cat.count} items</p>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const FeaturedSection = () => {
  const featured = sampleItems.filter((i) => i.featured);
  return (
    <section className="py-16">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl font-heading font-bold text-foreground">Featured Items</h2>
          <Link to="/explore">
            <Button variant="ghost" size="sm">
              View All <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.slice(0, 6).map((item, i) => (
            <ItemCard key={item.id} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

const TrendingSection = () => {
  const trending = sampleItems.filter((i) => i.trending);
  return (
    <section className="py-16 bg-secondary/30">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <TrendingUp className="h-6 w-6 text-accent" />
            <h2 className="text-3xl font-heading font-bold text-foreground">Trending Now</h2>
          </div>
          <Link to="/explore?sort=trending">
            <Button variant="ghost" size="sm">
              See More <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trending.slice(0, 4).map((item, i) => (
            <ItemCard key={item.id} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

const HowItWorks = () => {
  const steps = [
    { icon: "1️⃣", title: "List Your Item", desc: "Easily list items you aren't using, set your own prices, and earn extra cash." },
    { icon: "2️⃣", title: "Browse & Borrow", desc: "Find what you need from your neighbors. Save money and avoid unnecessary purchases." },
    { icon: "3️⃣", title: "Connect & Share", desc: "Coordinate pickup and drop-off. Build trust and strengthen your local community." },
  ];

  return (
    <section id="how-it-works" className="py-16">
      <div className="container mx-auto px-4 md:px-8">
        <h2 className="text-3xl font-heading font-bold text-center text-foreground mb-12">
          How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 }}
              className="text-center"
            >
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5">
                <span className="text-3xl">{step.icon}</span>
              </div>
              <h3 className="text-xl font-heading font-bold text-foreground mb-3">{step.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const CTASection = () => (
  <section className="py-16 bg-primary">
    <div className="container mx-auto px-4 md:px-8 text-center">
      <h2 className="text-3xl font-heading font-bold text-primary-foreground mb-4">
        Ready to Start Renting?
      </h2>
      <p className="text-primary-foreground/80 mb-8 max-w-lg mx-auto">
        Join thousands of users sharing and borrowing items in their community.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link to="/register">
          <Button variant="secondary" size="lg">
            Get Started Free
          </Button>
        </Link>
        <Link to="/explore">
          <Button variant="outline" size="lg" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
            Browse Items
          </Button>
        </Link>
      </div>
    </div>
  </section>
);

export default function Index() {
  return (
    <div>
      <HeroSection />
      <CategoriesSection />
      <FeaturedSection />
      <TrendingSection />
      <HowItWorks />
      <CTASection />
    </div>
  );
}