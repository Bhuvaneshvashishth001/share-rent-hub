import { useState, useEffect } from "react";
import { Package, Calendar, Plus, Settings, Star, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { sampleItems } from "@/lib/sample-data";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { rentalAPI, bookingAPI } from "@/lib/api";
import { indiaLocations } from "@/lib/india-locations";
import BookingLocationPanel from "@/components/BookingLocationPanel";
import { payForBooking } from "@/lib/razorpay";

const tabs = [
  { id: "bookings", label: "My Bookings", icon: Calendar },
  { id: "items", label: "My Items", icon: Package },
  { id: "add", label: "Add New Item", icon: Plus },
  { id: "tracking", label: "Location Sharing", icon: MapPin },
  { id: "settings", label: "Profile Settings", icon: Settings },
];

// Sample bookings (fallback if API fails)
const sampleBookings = [
  { id: "b1", itemTitle: "Professional DSLR Camera Kit", dates: "Jan 15 - Jan 18", total: 135, status: "Completed" },
  { id: "b2", itemTitle: "Mountain Bike - Trek Fuel EX", dates: "Feb 5 - Feb 7", total: 70, status: "Active" },
  { id: "b3", itemTitle: "DJ Equipment Complete Set", dates: "Mar 10 - Mar 12", total: 240, status: "Upcoming" },
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("bookings");
  const { user, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState(sampleBookings);
  const [items, setItems] = useState(sampleItems.slice(0, 3));
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [ownerBookings, setOwnerBookings] = useState<any[]>([]);

  // ✅ FIX: Redirect to login if not authenticated (but wait for loading to complete)
  useEffect(() => {
    console.log('🔍 [DASHBOARD] Auth check - loading:', loading, 'isAuthenticated:', isAuthenticated);
    if (!loading && !isAuthenticated) {
      console.warn("⚠️ [AUTH] User not authenticated, redirecting to login");
      navigate("/login");
    } else if (!loading && isAuthenticated) {
      console.log("✅ [AUTH] User authenticated, staying on dashboard");
    }
  }, [isAuthenticated, loading, navigate]);

  // ✅ FIX: Fetch user's bookings from backend
  useEffect(() => {
    if (user) {
      fetchUserBookings();
      fetchUserItems();
      fetchOwnerBookings();
    }
  }, [user, refreshTrigger]);

  // ✅ FIX: Refresh bookings when component mounts (useful when returning from booking)
  useEffect(() => {
    if (isAuthenticated && user) {
      console.log("🔄 [DASHBOARD] Component mounted, refreshing bookings");
      setRefreshTrigger(prev => prev + 1);
    }
  }, []); // Empty dependency array - runs only on mount

  /**
   * Refresh bookings manually
   */
  const refreshBookings = () => {
    console.log("🔄 [DASHBOARD] Manual refresh triggered");
    setRefreshTrigger(prev => prev + 1);
  };
  const fetchOwnerBookings = async () => {
    try {
      const response = await bookingAPI.getForMyRentals();
      setOwnerBookings(response.data?.bookings || []);
    } catch {
      setOwnerBookings([]);
    }
  };
  const fetchUserBookings = async () => {
    try {
      setLoadingBookings(true);
      console.log("📡 [API] Fetching user bookings...");
      
      const response = await bookingAPI.getAll();
      
      console.log("✅ [API] Bookings fetched:", response.data);
      
      if (response.success) {
        // Handle different response structures
        if (Array.isArray(response.data)) {
          setBookings(response.data);
        } else if (response.data?.bookings && Array.isArray(response.data.bookings)) {
          setBookings(response.data.bookings);
        } else {
          // Fall back to sample data if API returns unexpected format
          console.warn("⚠️ [API] Using sample bookings as fallback");
          setBookings(sampleBookings);
        }
      } else {
        // Fall back to sample data
        console.warn("⚠️ [API] Using sample bookings as fallback");
        setBookings(sampleBookings);
      }
    } catch (error) {
      console.error("❌ [API ERROR] Failed to fetch bookings:", error);
      // Keep sample data as fallback
      toast.info("Showing sample bookings (API error)");
    } finally {
      setLoadingBookings(false);
    }
  };

  /**
   * Fetch user's rental items from API
   */
  const fetchUserItems = async () => {
    try {
      console.log("📡 [API] Fetching user items...");
      
      const response = await rentalAPI.getMyRentals();
      
      console.log("✅ [API] Items fetched:", response.data);
      
      if (response.success) {
        // Handle different response structures
        if (Array.isArray(response.data)) {
          setItems(response.data);
        } else if (response.data?.rentals && Array.isArray(response.data.rentals)) {
          setItems(response.data.rentals);
        } else {
          console.warn("⚠️ [API] Using sample items as fallback");
          setItems(sampleItems.slice(0, 3));
        }
      } else {
        // Fall back to sample data
        console.warn("⚠️ [API] Using sample items as fallback");
        setItems(sampleItems.slice(0, 3));
      }
    } catch (error) {
      console.error("❌ [API ERROR] Failed to fetch items:", error);
      // Keep sample data as fallback
    }
  };

  return (
    <div className="min-h-screen">
      {/* Show loading spinner while checking authentication */}
      {loading ? (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      ) : (
        <>
          <div className="bg-secondary/30 py-8">
            <div className="container mx-auto px-4 md:px-8">
              <div className="flex items-center gap-4">
                {/* ✅ FIX: Display real user data instead of hardcoded values */}
                <img 
                  src={user?.profileImage || "https://i.pravatar.cc/150?img=20"} 
                  alt="User" 
                  className="h-16 w-16 rounded-full border-2 border-primary" 
                />
                <div>
                  <h1 className="text-2xl font-heading font-bold text-foreground">
                    Welcome, {user?.name || "User"}!
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    {user?.email || "Loading..."}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="container mx-auto px-4 md:px-8 py-6">
            {/* Tabs */}
            <div className="flex flex-wrap gap-2 mb-8 border-b border-border pb-4">
              {tabs.map((tab) => (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveTab(tab.id)}
                >
                  <tab.icon className="h-4 w-4 mr-2" /> {tab.label}
                </Button>
              ))}
            </div>

            {/* Tab Content */}
            <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              {activeTab === "bookings" && <BookingsTab bookings={bookings} loading={loadingBookings} onPaid={refreshBookings} />}
              {activeTab === "items" && <MyItemsTab items={items} onUpdated={fetchUserItems} />}
              {activeTab === "add" && <AddItemTab onCreated={() => { fetchUserItems(); setActiveTab("items"); }} />}
              {activeTab === "tracking" && <BookingLocationPanel renterBookings={bookings.filter((booking: any) => booking._id)} ownerBookings={ownerBookings} />}
              {activeTab === "settings" && <SettingsTab user={user} />}
            </motion.div>
          </div>
        </>
      )}
    </div>
  );
}

/**
 * Bookings Tab Component
 */
function BookingsTab({ bookings, loading, onPaid }: any) {
  const { user } = useAuth();
  const [payingId, setPayingId] = useState<string | null>(null);

  const handlePayment = async (booking: any) => {
    const bookingId = booking._id || booking.id;
    setPayingId(bookingId);
    try {
      await payForBooking(bookingId, user || {}, () => {
        toast.success("Payment successful. Booking confirmed.");
        onPaid();
      });
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Payment failed");
    } finally {
      setPayingId(null);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-heading font-bold text-foreground">My Bookings</h2>
      
      {loading && (
        <p className="text-muted-foreground">Loading bookings...</p>
      )}
      
      {!loading && bookings.length === 0 && (
        <p className="text-muted-foreground">No bookings yet</p>
      )}
      
      {bookings.map((booking: any) => (
        <div key={booking.id} className="bg-card p-4 rounded-lg border border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-foreground">{booking.rental?.title || booking.itemTitle}</h3>
            <p className="text-sm text-muted-foreground">
              {booking.startDate ? `${new Date(booking.startDate).toLocaleDateString()} - ${new Date(booking.endDate).toLocaleDateString()}` : booking.dates}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-bold text-foreground">₹{booking.totalPrice || booking.total}</span>
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
              booking.status === "Active" ? "bg-success/10 text-success" :
              booking.status === "Upcoming" ? "bg-warning/10 text-warning" :
              "bg-muted text-muted-foreground"
            }`}>
              {booking.status}
            </span>
            {booking.paymentStatus === "pending" && booking._id && (
              <Button size="sm" onClick={() => handlePayment(booking)} disabled={payingId === booking._id}>
                {payingId === booking._id ? "Opening..." : "Pay Now"}
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * My Items Tab Component
 */
function MyItemsTab({ items, onUpdated }: { items: any[]; onUpdated: () => Promise<void> }) {
  const [editingItem, setEditingItem] = useState<any | null>(null);
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-heading font-bold text-foreground">My Listed Items</h2>
      
      {items.length === 0 && (
        <p className="text-muted-foreground">No items listed yet</p>
      )}
      
      {items.map((item: any) => (
        <div key={item._id || item.id} className="bg-card p-4 rounded-lg border border-border flex items-center gap-4">
          <img src={item.imageUrl || item.images?.[0]} alt={item.title} className="w-20 h-16 object-cover rounded-md" />
          <div className="flex-1">
            <h3 className="font-bold text-foreground">{item.title}</h3>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span>₹{item.pricePerDay || item.price}/day</span>
              <span className="flex items-center gap-1"><Star className="h-3 w-3 fill-warning text-warning" /> {item.rating}</span>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={() => setEditingItem(item)}>Edit</Button>
        </div>
      ))}
      {editingItem && (
        <EditItemForm
          key={editingItem._id || editingItem.id}
          item={editingItem}
          onCancel={() => setEditingItem(null)}
          onSaved={async () => {
            await onUpdated();
            setEditingItem(null);
          }}
        />
      )}
    </div>
  );
}

function EditItemForm({ item, onCancel, onSaved }: { item: any; onCancel: () => void; onSaved: () => Promise<void> }) {
  const [form, setForm] = useState({
    title: item.title || "",
    description: item.description || "",
    pricePerDay: String(item.pricePerDay ?? item.price ?? ""),
    category: item.category || "",
    location: item.location || "",
    imageUrl: item.imageUrl || item.images?.[0] || "",
    availability: item.availability ?? item.available ?? true,
  });
  const [saving, setSaving] = useState(false);
  const update = (key: string, value: string | boolean) => setForm((current) => ({ ...current, [key]: value }));

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    const itemId = item._id || item.id;
    if (!itemId) return toast.error("Item ID is missing");

    setSaving(true);
    try {
      await rentalAPI.update(itemId, { ...form, pricePerDay: Number(form.pricePerDay) });
      await onSaved();
      toast.success("Item updated successfully");
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Could not update item");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="max-w-xl space-y-4 rounded-lg border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-heading font-bold">Edit Item</h3>
        <Button type="button" variant="ghost" size="sm" onClick={onCancel}>Cancel</Button>
      </div>
      <div>
        <label className="text-sm font-medium mb-1 block">Title</label>
        <Input required value={form.title} onChange={(e) => update("title", e.target.value)} />
      </div>
      <div>
        <label className="text-sm font-medium mb-1 block">Description</label>
        <Textarea required minLength={10} value={form.description} onChange={(e) => update("description", e.target.value)} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium mb-1 block">Price per day (₹)</label>
          <Input required min="0" type="number" value={form.pricePerDay} onChange={(e) => update("pricePerDay", e.target.value)} />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Category</label>
          <Select value={form.category} onValueChange={(value) => update("category", value)}>
            <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="car">Car</SelectItem>
              <SelectItem value="bike">Bike</SelectItem>
              <SelectItem value="room">Room</SelectItem>
              <SelectItem value="equipment">Equipment</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        <label className="text-sm font-medium mb-1 block">Location</label>
        <Select value={form.location} onValueChange={(value) => update("location", value)}>
          <SelectTrigger><SelectValue placeholder="Select an Indian city" /></SelectTrigger>
          <SelectContent>
            {indiaLocations.map((location) => <SelectItem key={location} value={location}>{location}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div>
        <label className="text-sm font-medium mb-1 block">Image URL</label>
        <Input required type="url" value={form.imageUrl} onChange={(e) => update("imageUrl", e.target.value)} />
      </div>
      <div>
        <label className="text-sm font-medium mb-1 block">Availability</label>
        <Select value={form.availability ? "available" : "unavailable"} onValueChange={(value) => update("availability", value === "available")}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="available">Available</SelectItem>
            <SelectItem value="unavailable">Unavailable</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex gap-3">
        <Button type="submit" disabled={saving}>{saving ? "Saving..." : "Save Changes"}</Button>
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  );
}

function AddItemTab({ onCreated }: { onCreated: () => void }) {
  const [form, setForm] = useState({ title: "", description: "", pricePerDay: "", category: "", location: "", imageUrl: "" });
  const [submitting, setSubmitting] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await rentalAPI.create({ ...form, pricePerDay: Number(form.pricePerDay) });
      toast.success("Item listed successfully!");
      onCreated();
    } catch (error: any) {
      toast.error(error.message || "Could not list item");
    } finally {
      setSubmitting(false);
    }
  };
  const update = (key: string, value: string) => setForm((current) => ({ ...current, [key]: value }));

  return (
    <div className="max-w-xl">
      <h2 className="text-xl font-heading font-bold text-foreground mb-6">Add New Item</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-medium text-foreground mb-1 block">Title</label>
          <Input required placeholder="Item title" value={form.title} onChange={(e) => update("title", e.target.value)} />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground mb-1 block">Description</label>
          <Textarea required minLength={10} placeholder="Describe your item..." value={form.description} onChange={(e) => update("description", e.target.value)} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">Price per day (₹)</label>
            <Input required min="0" type="number" placeholder="500" value={form.pricePerDay} onChange={(e) => update("pricePerDay", e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">Category</label>
            <Select value={form.category} onValueChange={(value) => update("category", value)}>
              <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="car">Car</SelectItem>
                <SelectItem value="bike">Bike</SelectItem>
                <SelectItem value="room">Room</SelectItem>
                <SelectItem value="equipment">Equipment</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-foreground mb-1 block">Location</label>
          <Select value={form.location} onValueChange={(value) => update("location", value)}>
            <SelectTrigger><SelectValue placeholder="Select an Indian city" /></SelectTrigger>
            <SelectContent>
              {indiaLocations.map((location) => <SelectItem key={location} value={location}>{location}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-sm font-medium text-foreground mb-1 block">Image URL</label>
          <Input required type="url" placeholder="https://..." value={form.imageUrl} onChange={(e) => update("imageUrl", e.target.value)} />
        </div>
        <Button type="submit" className="w-full" disabled={submitting}>{submitting ? "Listing..." : "List Item"}</Button>
      </form>
    </div>
  );
}

/**
 * Settings Tab Component
 */
function SettingsTab({ user }: any) {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Call API to update profile
    setIsUpdating(true);
    try {
      toast.success("Profile updated!");
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="max-w-xl">
      <h2 className="text-xl font-heading font-bold text-foreground mb-6">Profile Settings</h2>
      <form onSubmit={handleUpdateProfile} className="space-y-4">
        <div>
          <label className="text-sm font-medium text-foreground mb-1 block">Full Name</label>
          <Input defaultValue={user?.name || "User"} disabled />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground mb-1 block">Email</label>
          <Input type="email" defaultValue={user?.email || ""} disabled />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground mb-1 block">Phone</label>
          <Input type="tel" defaultValue={user?.phone || ""} disabled />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground mb-1 block">Member Since</label>
          <Input 
            type="text" 
            defaultValue={user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : ""} 
            disabled 
          />
        </div>
        <Button type="submit" disabled={isUpdating}>
          {isUpdating ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </div>
  );
}
