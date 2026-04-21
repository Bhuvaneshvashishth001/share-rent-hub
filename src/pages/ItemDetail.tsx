import { useParams, Link, useNavigate } from "react-router-dom";
import { Star, MapPin, ArrowLeft, Calendar, Shield, MessageCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { sampleItems } from "@/lib/sample-data";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { rentalAPI, bookingAPI } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

interface Rental {
  _id: string;
  title: string;
  category: string;
  pricePerDay: number;
  location: string;
  description: string;
  imageUrl: string;
  owner: {
    _id: string;
    name: string;
    email: string;
    phone: string;
  };
  rating: number;
  reviewCount: number;
  availability: boolean;
}

export default function ItemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [rental, setRental] = useState<Rental | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Fetch rental data from API
  useEffect(() => {
    const fetchRental = async () => {
      try {
        console.log("📡 [API] Fetching rental details for ID:", id);
        const response = await rentalAPI.getById(id!);
        console.log("✅ [API] Full response:", response);
        console.log("✅ [API] Rental data (response.data):", response.data);
        
        if (response.data) {
          console.log("📊 [API] Rental image:", response.data.imageUrl);
          setRental(response.data);
        } else {
          console.warn("⚠️ [API] No data in response");
          setRental(response);
        }
      } catch (error) {
        console.error("❌ [API] Failed to fetch rental:", error);
        toast.error("Failed to load rental details");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchRental();
    }
  }, [id]);

  // Fallback to sample data if API fails (convert sample data structure to match API structure)
  const item = rental || sampleItems.find((i) => i.id === id) as any;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading rental details...</p>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-heading font-bold text-foreground mb-4">Item Not Found</h1>
        <Link to="/explore"><Button variant="outline">Back to Explore</Button></Link>
      </div>
    );
  }

  const days = startDate && endDate ? Math.max(1, Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / 86400000)) : 0;
  const total = days * item.pricePerDay;

  const handleBooking = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to book this item");
      navigate("/login");
      return;
    }

    if (!startDate || !endDate) {
      toast.error("Please select start and end dates");
      return;
    }

    if (!rental) {
      toast.error("Rental data not available");
      return;
    }

    setBookingLoading(true);

    try {
      console.log("📡 [API] Creating booking...");
      const response = await bookingAPI.create({
        rentalId: rental._id,
        startDate,
        endDate,
      });

      console.log("✅ [API] Booking created:", response.data);
      toast.success(`Booking confirmed for ${days} day(s)! Total: $${total}`);

      // Navigate to dashboard to see the booking
      navigate("/dashboard");
    } catch (error: any) {
      console.error("❌ [API] Booking failed:", error);
      toast.error(error.message || "Failed to create booking");
    } finally {
      setBookingLoading(false);
    }
  };

  const reviews = [
    { user: "John D.", rating: 5, comment: "Excellent condition, owner was very helpful!", date: "2 weeks ago" },
    { user: "Emily R.", rating: 4, comment: "Great item, worked perfectly for my project.", date: "1 month ago" },
    { user: "Mike S.", rating: 5, comment: "Smooth rental experience, would rent again!", date: "2 months ago" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/explore">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Explore
            </Button>
          </Link>
          <div className="flex-1" />
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{item.rating}</span>
            <span className="text-sm text-muted-foreground">({item.reviewCount} reviews)</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <div className="aspect-square rounded-lg overflow-hidden bg-muted">
              <img
                src={item.imageUrl || (item as any).images?.[0] || 'https://via.placeholder.com/500?text=No+Image'}
                alt={item.title}
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6"
          >
            <div>
              <h1 className="text-3xl font-heading font-bold text-foreground mb-2">{item.title}</h1>
              <div className="flex items-center gap-2 text-muted-foreground mb-4">
                <MapPin className="h-4 w-4" />
                <span>{item.location}</span>
              </div>
              <p className="text-lg text-muted-foreground">{item.description}</p>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-primary">${item.pricePerDay}</p>
                <p className="text-sm text-muted-foreground">per day</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">Owner</p>
                <p className="text-sm text-muted-foreground">{item.owner?.name || "N/A"}</p>
              </div>
            </div>

            {/* Booking Form */}
            <div className="bg-muted/50 rounded-lg p-6 space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Book this item
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div>
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    min={startDate || new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>

              {days > 0 && (
                <div className="bg-background rounded-lg p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>${item.pricePerDay} × {days} day{days > 1 ? 's' : ''}</span>
                    <span>${total}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-semibold">
                    <span>Total</span>
                    <span>${total}</span>
                  </div>
                </div>
              )}

              <Button
                onClick={handleBooking}
                className="w-full"
                disabled={bookingLoading || !startDate || !endDate}
              >
                {bookingLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating booking...
                  </>
                ) : (
                  `Book for $${total}`
                )}
              </Button>
            </div>

            {/* Owner Contact */}
            {item.owner && (
              <div className="bg-muted/50 rounded-lg p-6">
                <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                  <MessageCircle className="h-5 w-5" />
                  Contact Owner
                </h3>
                <div className="space-y-2 text-sm">
                  <p><strong>Name:</strong> {item.owner.name}</p>
                  <p><strong>Email:</strong> {item.owner.email}</p>
                  <p><strong>Phone:</strong> {item.owner.phone}</p>
                </div>
              </div>
            )}

            {/* Safety Notice */}
            <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">Safety First</h4>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    Always inspect items before use. Contact the owner if you have any concerns.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
