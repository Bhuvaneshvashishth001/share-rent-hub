export interface RentalItem {
  id: string;
  title: string;
  description: string;
  price: number;
  priceUnit: string;
  category: string;
  location: string;
  images: string[];
  owner: {
    name: string;
    avatar: string;
    rating: number;
  };
  rating: number;
  reviewCount: number;
  featured: boolean;
  trending: boolean;
  available: boolean;
  createdAt: string;
}

export const locations = [
  "Brooklyn, NY",
  "Manhattan, NY",
  "Queens, NY",
  "Bronx, NY",
  "Staten Island, NY",
];

export const categories = [
  { name: "Tools", icon: "🛠️", count: 245 },
  { name: "Electronics", icon: "📸", count: 189 },
  { name: "Outdoor Gear", icon: "🚴", count: 156 },
  { name: "Party Supplies", icon: "🎉", count: 98 },
  { name: "Music", icon: "🎵", count: 124 },
  { name: "Sports", icon: "⚽", count: 203 },
  { name: "Kitchen", icon: "🍳", count: 87 },
  { name: "Vehicles", icon: "🚗", count: 64 },
];

export const sampleItems: RentalItem[] = [
  {
    id: "1",
    title: "Professional DSLR Camera Kit",
    description: "Canon EOS R5 with 24-70mm lens, perfect for events and portraits. Comes with extra batteries and memory cards.",
    price: 45,
    priceUnit: "day",
    category: "Electronics",
    location: "Brooklyn, NY",
    images: ["https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600", "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=600"],
    owner: { name: "Clara W.", avatar: "https://i.pravatar.cc/150?img=1", rating: 4.9 },
    rating: 4.8,
    reviewCount: 47,
    featured: true,
    trending: true,
    available: true,
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    title: "Heavy-Duty Power Drill Set",
    description: "DeWalt 20V MAX with complete bit set. Perfect for home improvement projects.",
    price: 15,
    priceUnit: "day",
    category: "Tools",
    location: "Manhattan, NY",
    images: ["https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600"],
    owner: { name: "Leo K.", avatar: "https://i.pravatar.cc/150?img=3", rating: 4.7 },
    rating: 4.6,
    reviewCount: 32,
    featured: true,
    trending: false,
    available: true,
    createdAt: "2024-02-01",
  },
  {
    id: "3",
    title: "Mountain Bike - Trek Fuel EX",
    description: "Full suspension mountain bike, size L. Recently serviced with new tires.",
    price: 35,
    priceUnit: "day",
    category: "Outdoor Gear",
    location: "Queens, NY",
    images: ["https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?w=600"],
    owner: { name: "Maya P.", avatar: "https://i.pravatar.cc/150?img=5", rating: 4.8 },
    rating: 4.9,
    reviewCount: 28,
    featured: true,
    trending: true,
    available: false,
    createdAt: "2024-01-20",
  },
  {
    id: "4",
    title: "DJ Equipment Complete Set",
    description: "Pioneer DDJ-1000 controller with speakers and lighting. Perfect for events.",
    price: 120,
    priceUnit: "day",
    category: "Music",
    location: "Bronx, NY",
    images: ["https://images.unsplash.com/photo-1571327073757-71d13c24de30?w=600"],
    owner: { name: "Jake R.", avatar: "https://i.pravatar.cc/150?img=8", rating: 4.5 },
    rating: 4.7,
    reviewCount: 19,
    featured: false,
    trending: true,
    available: true,
    createdAt: "2024-03-01",
  },
  {
    id: "5",
    title: "Camping Tent - 6 Person",
    description: "REI Co-op Base Camp 6 tent. Waterproof, spacious, and easy to set up.",
    price: 25,
    priceUnit: "day",
    category: "Outdoor Gear",
    location: "Staten Island, NY",
    images: ["https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=600"],
    owner: { name: "Sarah M.", avatar: "https://i.pravatar.cc/150?img=9", rating: 4.6 },
    rating: 4.5,
    reviewCount: 22,
    featured: false,
    trending: true,
    available: true,
    createdAt: "2024-02-15",
  },
  {
    id: "6",
    title: "Vintage Film Projector",
    description: "Epson Home Cinema 2250 with 100\" screen included. Movie night ready!",
    price: 30,
    priceUnit: "day",
    category: "Electronics",
    location: "Brooklyn, NY",
    images: ["https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=600"],
    owner: { name: "Tom H.", avatar: "https://i.pravatar.cc/150?img=12", rating: 4.4 },
    rating: 4.3,
    reviewCount: 15,
    featured: true,
    trending: false,
    available: false,
    createdAt: "2024-03-10",
  },
  {
    id: "7",
    title: "Stand-Up Paddleboard",
    description: "Inflatable SUP with paddle, pump, and carry bag. Great for lakes and calm waters.",
    price: 40,
    priceUnit: "day",
    category: "Sports",
    location: "Manhattan, NY",
    images: ["https://images.unsplash.com/photo-1526188717906-ab4a2f949f46?w=600"],
    owner: { name: "Nina L.", avatar: "https://i.pravatar.cc/150?img=15", rating: 4.9 },
    rating: 4.8,
    reviewCount: 36,
    featured: true,
    trending: true,
    available: true,
    createdAt: "2024-01-25",
  },
  {
    id: "8",
    title: "Party Sound System",
    description: "JBL PartyBox 710 with LED lights. Bluetooth enabled, massive bass.",
    price: 55,
    priceUnit: "day",
    category: "Party Supplies",
    location: "Queens, NY",
    images: ["https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600"],
    owner: { name: "Alex D.", avatar: "https://i.pravatar.cc/150?img=18", rating: 4.6 },
    rating: 4.7,
    reviewCount: 41,
    featured: false,
    trending: true,
    available: true,
    createdAt: "2024-02-20",
  },
];
