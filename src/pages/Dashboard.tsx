import { useState } from "react";
import { Package, Calendar, Plus, Settings, Star, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { categories, sampleItems } from "@/lib/sample-data";
import { toast } from "sonner";
import { motion } from "framer-motion";

const tabs = [
  { id: "bookings", label: "My Bookings", icon: Calendar },
  { id: "items", label: "My Items", icon: Package },
  { id: "add", label: "Add New Item", icon: Plus },
  { id: "settings", label: "Profile Settings", icon: Settings },
];

const sampleBookings = [
  { id: "b1", itemTitle: "Professional DSLR Camera Kit", dates: "Jan 15 - Jan 18", total: 135, status: "Completed" },
  { id: "b2", itemTitle: "Mountain Bike - Trek Fuel EX", dates: "Feb 5 - Feb 7", total: 70, status: "Active" },
  { id: "b3", itemTitle: "DJ Equipment Complete Set", dates: "Mar 10 - Mar 12", total: 240, status: "Upcoming" },
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("bookings");

  return (
    <div className="min-h-screen">
      <div className="bg-secondary/30 py-8">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex items-center gap-4">
            <img src="https://i.pravatar.cc/150?img=20" alt="User" className="h-16 w-16 rounded-full border-2 border-primary" />
            <div>
              <h1 className="text-2xl font-heading font-bold text-foreground">Welcome, Alex!</h1>
              <p className="text-sm text-muted-foreground">Member since Jan 2024</p>
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
          {activeTab === "bookings" && <BookingsTab />}
          {activeTab === "items" && <MyItemsTab />}
          {activeTab === "add" && <AddItemTab />}
          {activeTab === "settings" && <SettingsTab />}
        </motion.div>
      </div>
    </div>
  );
}

function BookingsTab() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-heading font-bold text-foreground">My Bookings</h2>
      {sampleBookings.map((booking) => (
        <div key={booking.id} className="bg-card p-4 rounded-lg border border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-foreground">{booking.itemTitle}</h3>
            <p className="text-sm text-muted-foreground">{booking.dates}</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-bold text-foreground">${booking.total}</span>
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
              booking.status === "Active" ? "bg-success/10 text-success" :
              booking.status === "Upcoming" ? "bg-warning/10 text-warning" :
              "bg-muted text-muted-foreground"
            }`}>
              {booking.status}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

function MyItemsTab() {
  const myItems = sampleItems.slice(0, 3);
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-heading font-bold text-foreground">My Listed Items</h2>
      {myItems.map((item) => (
        <div key={item.id} className="bg-card p-4 rounded-lg border border-border flex items-center gap-4">
          <img src={item.images[0]} alt={item.title} className="w-20 h-16 object-cover rounded-md" />
          <div className="flex-1">
            <h3 className="font-bold text-foreground">{item.title}</h3>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span>${item.price}/{item.priceUnit}</span>
              <span className="flex items-center gap-1"><Star className="h-3 w-3 fill-warning text-warning" /> {item.rating}</span>
            </div>
          </div>
          <Button variant="outline" size="sm">Edit</Button>
        </div>
      ))}
    </div>
  );
}

function AddItemTab() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Item listed successfully!");
  };

  return (
    <div className="max-w-xl">
      <h2 className="text-xl font-heading font-bold text-foreground mb-6">Add New Item</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-medium text-foreground mb-1 block">Title</label>
          <Input placeholder="Item title" />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground mb-1 block">Description</label>
          <Textarea placeholder="Describe your item..." />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">Price per day ($)</label>
            <Input type="number" placeholder="25" />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">Category</label>
            <Select>
              <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c.name} value={c.name}>{c.icon} {c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-foreground mb-1 block">Location</label>
          <Input placeholder="City, State" />
        </div>
        <Button type="submit" className="w-full">List Item</Button>
      </form>
    </div>
  );
}

function SettingsTab() {
  return (
    <div className="max-w-xl">
      <h2 className="text-xl font-heading font-bold text-foreground mb-6">Profile Settings</h2>
      <form className="space-y-4">
        <div>
          <label className="text-sm font-medium text-foreground mb-1 block">Full Name</label>
          <Input defaultValue="Alex Thompson" />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground mb-1 block">Email</label>
          <Input type="email" defaultValue="alex@example.com" />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground mb-1 block">Phone</label>
          <Input type="tel" defaultValue="+1 555 123 4567" />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground mb-1 block">Bio</label>
          <Textarea defaultValue="I love sharing my gear with the community!" />
        </div>
        <Button onClick={() => toast.success("Profile updated!")}>Save Changes</Button>
      </form>
    </div>
  );
}
