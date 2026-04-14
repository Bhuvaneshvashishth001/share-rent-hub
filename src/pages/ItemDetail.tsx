import { useParams, Link } from "react-router-dom";
import { Star, MapPin, ArrowLeft, Calendar, Shield, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { sampleItems } from "@/lib/sample-data";
import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function ItemDetail() {
  const { id } = useParams();
  const item = sampleItems.find((i) => i.id === id);
  const [selectedImage, setSelectedImage] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  if (!item) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-heading font-bold text-foreground mb-4">Item Not Found</h1>
        <Link to="/explore"><Button variant="outline">Back to Explore</Button></Link>
      </div>
    );
  }

  const days = startDate && endDate ? Math.max(1, Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / 86400000)) : 0;
  const total = days * item.price;

  const handleBooking = () => {
    if (!startDate || !endDate) {
      toast.error("Please select start and end dates");
      return;
    }
    toast.success(`Booking confirmed for ${days} day(s)! Total: $${total}`);
  };

  const reviews = [
    { user: "John D.", rating: 5, comment: "Excellent condition, owner was very helpful!", date: "2 weeks ago" },
    { user: "Emily R.", rating: 4, comment: "Great item, worked perfectly for my project.", date: "1 month ago" },
    { user: "Mike S.", rating: 5, comment: "Smooth rental experience, would rent again!", date: "2 months ago" },
  ];

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 md:px-8 py-6">
        <Link to="/explore" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6">
          <ArrowLeft className="h-4 w-4" /> Back to Explore
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Images & Details */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-lg overflow-hidden border border-border">
              <img src={item.images[selectedImage]} alt={item.title} className="w-full aspect-video object-cover" />
            </motion.div>
            {item.images.length > 1 && (
              <div className="flex gap-2">
                {item.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`rounded-md overflow-hidden border-2 transition-colors ${i === selectedImage ? "border-primary" : "border-border"}`}
                  >
                    <img src={img} alt="" className="w-20 h-16 object-cover" />
                  </button>
                ))}
              </div>
            )}

            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">{item.category}</span>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5" /> {item.location}
                </div>
              </div>
              <h1 className="text-3xl font-heading font-bold text-foreground mb-4">{item.title}</h1>
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 fill-warning text-warning" />
                  <span className="font-bold">{item.rating}</span>
                  <span className="text-muted-foreground">({item.reviewCount} reviews)</span>
                </div>
              </div>
              <p className="text-muted-foreground leading-relaxed">{item.description}</p>
            </div>

            {/* Owner */}
            <div className="bg-card p-4 rounded-lg border border-border flex items-center gap-4">
              <img src={item.owner.avatar} alt={item.owner.name} className="h-12 w-12 rounded-full" />
              <div className="flex-1">
                <p className="font-bold text-foreground">{item.owner.name}</p>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Star className="h-3.5 w-3.5 fill-warning text-warning" />
                  <span>{item.owner.rating} owner rating</span>
                </div>
              </div>
              <Button variant="outline" size="sm">
                <MessageCircle className="h-4 w-4 mr-1" /> Contact
              </Button>
            </div>

            {/* Reviews */}
            <div>
              <h2 className="text-2xl font-heading font-bold text-foreground mb-6">Reviews</h2>
              <div className="space-y-4">
                {reviews.map((review, i) => (
                  <div key={i} className="bg-card p-4 rounded-lg border border-border">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-foreground text-sm">{review.user}</span>
                        <div className="flex">
                          {Array.from({ length: review.rating }).map((_, j) => (
                            <Star key={j} className="h-3.5 w-3.5 fill-warning text-warning" />
                          ))}
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">{review.date}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 bg-card p-6 rounded-lg border border-border shadow-sm">
              <div className="text-3xl font-bold text-foreground mb-1">
                ${item.price}<span className="text-base font-normal text-muted-foreground">/{item.priceUnit}</span>
              </div>
              <div className="space-y-4 mt-6">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    min={startDate}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  />
                </div>
                {days > 0 && (
                  <div className="bg-secondary/50 p-3 rounded-md space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">${item.price} × {days} day(s)</span>
                      <span className="text-foreground">${total}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Service fee</span>
                      <span className="text-foreground">${Math.round(total * 0.1)}</span>
                    </div>
                    <div className="border-t border-border pt-1 flex justify-between font-bold">
                      <span className="text-foreground">Total</span>
                      <span className="text-foreground">${total + Math.round(total * 0.1)}</span>
                    </div>
                  </div>
                )}
                <Button className="w-full" size="lg" onClick={handleBooking}>
                  <Calendar className="h-4 w-4 mr-2" /> Book Now
                </Button>
                <div className="flex items-center gap-2 text-xs text-muted-foreground justify-center">
                  <Shield className="h-3.5 w-3.5" />
                  <span>Free cancellation within 24 hours</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
