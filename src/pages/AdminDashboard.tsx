import { useState } from "react";
import { Users, Package, Calendar, BarChart3, Shield, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { sampleItems } from "@/lib/sample-data";
import { motion } from "framer-motion";

const adminTabs = [
  { id: "overview", label: "Overview", icon: BarChart3 },
  { id: "users", label: "Users", icon: Users },
  { id: "items", label: "Items", icon: Package },
  { id: "bookings", label: "Bookings", icon: Calendar },
];

const stats = [
  { label: "Total Users", value: "2,847", change: "+12%", icon: Users },
  { label: "Active Listings", value: "1,234", change: "+8%", icon: Package },
  { label: "Bookings This Month", value: "456", change: "+23%", icon: Calendar },
  { label: "Revenue", value: "$12,890", change: "+15%", icon: BarChart3 },
];

const sampleUsers = [
  { id: "u1", name: "Clara W.", email: "clara@email.com", role: "Owner", items: 5, status: "Active" },
  { id: "u2", name: "Leo K.", email: "leo@email.com", role: "User", items: 0, status: "Active" },
  { id: "u3", name: "Maya P.", email: "maya@email.com", role: "Owner", items: 3, status: "Suspended" },
  { id: "u4", name: "Jake R.", email: "jake@email.com", role: "Admin", items: 1, status: "Active" },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen">
      <div className="bg-primary py-6">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex items-center gap-3">
            <Shield className="h-6 w-6 text-primary-foreground" />
            <h1 className="text-2xl font-heading font-bold text-primary-foreground">Admin Dashboard</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 py-6">
        <div className="flex flex-wrap gap-2 mb-8 border-b border-border pb-4">
          {adminTabs.map((tab) => (
            <Button key={tab.id} variant={activeTab === tab.id ? "default" : "ghost"} size="sm" onClick={() => setActiveTab(tab.id)}>
              <tab.icon className="h-4 w-4 mr-2" /> {tab.label}
            </Button>
          ))}
        </div>

        <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          {activeTab === "overview" && <OverviewTab />}
          {activeTab === "users" && <UsersTab />}
          {activeTab === "items" && <ItemsTab />}
          {activeTab === "bookings" && <BookingsAdminTab />}
        </motion.div>
      </div>
    </div>
  );
}

function OverviewTab() {
  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-card p-5 rounded-lg border border-border">
            <div className="flex items-center justify-between mb-2">
              <stat.icon className="h-5 w-5 text-muted-foreground" />
              <span className="text-xs text-success font-medium">{stat.change}</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>
      <div className="bg-card p-6 rounded-lg border border-border">
        <h3 className="font-heading font-bold text-foreground mb-4">Recent Activity</h3>
        <div className="space-y-3 text-sm">
          <p className="text-muted-foreground">• New user Clara W. registered — <span className="text-foreground">2 min ago</span></p>
          <p className="text-muted-foreground">• Booking #456 confirmed — <span className="text-foreground">15 min ago</span></p>
          <p className="text-muted-foreground">• Item "DJ Equipment" reported — <span className="text-foreground">1 hour ago</span></p>
          <p className="text-muted-foreground">• Payment of $120 processed — <span className="text-foreground">2 hours ago</span></p>
        </div>
      </div>
    </div>
  );
}

function UsersTab() {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-heading font-bold text-foreground">Manage Users</h2>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search users..." className="pl-10" />
        </div>
      </div>
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-secondary/50">
            <tr>
              <th className="text-left p-3 text-muted-foreground font-medium">Name</th>
              <th className="text-left p-3 text-muted-foreground font-medium">Email</th>
              <th className="text-left p-3 text-muted-foreground font-medium">Role</th>
              <th className="text-left p-3 text-muted-foreground font-medium">Items</th>
              <th className="text-left p-3 text-muted-foreground font-medium">Status</th>
              <th className="text-left p-3 text-muted-foreground font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sampleUsers.map((user) => (
              <tr key={user.id} className="border-t border-border">
                <td className="p-3 font-medium text-foreground">{user.name}</td>
                <td className="p-3 text-muted-foreground">{user.email}</td>
                <td className="p-3"><span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">{user.role}</span></td>
                <td className="p-3 text-muted-foreground">{user.items}</td>
                <td className="p-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${user.status === "Active" ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}`}>
                    {user.status}
                  </span>
                </td>
                <td className="p-3">
                  <Button variant="ghost" size="sm">Edit</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ItemsTab() {
  return (
    <div>
      <h2 className="text-xl font-heading font-bold text-foreground mb-4">Manage Items</h2>
      <div className="space-y-3">
        {sampleItems.slice(0, 5).map((item) => (
          <div key={item.id} className="bg-card p-4 rounded-lg border border-border flex items-center gap-4">
            <img src={item.images[0]} alt={item.title} className="w-16 h-12 object-cover rounded" />
            <div className="flex-1">
              <h3 className="font-bold text-foreground text-sm">{item.title}</h3>
              <p className="text-xs text-muted-foreground">{item.category} • {item.location} • ${item.price}/{item.priceUnit}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">Approve</Button>
              <Button variant="ghost" size="sm" className="text-destructive">Remove</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function BookingsAdminTab() {
  const bookings = [
    { id: "b1", item: "DSLR Camera Kit", renter: "Leo K.", owner: "Clara W.", dates: "Jan 15-18", total: "$135", status: "Completed" },
    { id: "b2", item: "Mountain Bike", renter: "Jake R.", owner: "Maya P.", dates: "Feb 5-7", total: "$70", status: "Active" },
    { id: "b3", item: "DJ Equipment", renter: "Alex D.", owner: "Jake R.", dates: "Mar 10-12", total: "$240", status: "Disputed" },
  ];

  return (
    <div>
      <h2 className="text-xl font-heading font-bold text-foreground mb-4">All Bookings</h2>
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-secondary/50">
            <tr>
              <th className="text-left p-3 text-muted-foreground font-medium">Item</th>
              <th className="text-left p-3 text-muted-foreground font-medium">Renter</th>
              <th className="text-left p-3 text-muted-foreground font-medium">Owner</th>
              <th className="text-left p-3 text-muted-foreground font-medium">Dates</th>
              <th className="text-left p-3 text-muted-foreground font-medium">Total</th>
              <th className="text-left p-3 text-muted-foreground font-medium">Status</th>
              <th className="text-left p-3 text-muted-foreground font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b.id} className="border-t border-border">
                <td className="p-3 font-medium text-foreground">{b.item}</td>
                <td className="p-3 text-muted-foreground">{b.renter}</td>
                <td className="p-3 text-muted-foreground">{b.owner}</td>
                <td className="p-3 text-muted-foreground">{b.dates}</td>
                <td className="p-3 font-bold text-foreground">{b.total}</td>
                <td className="p-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    b.status === "Active" ? "bg-success/10 text-success" :
                    b.status === "Disputed" ? "bg-destructive/10 text-destructive" :
                    "bg-muted text-muted-foreground"
                  }`}>{b.status}</span>
                </td>
                <td className="p-3"><Button variant="ghost" size="sm">View</Button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
