import { RentalItem } from "@/lib/sample-data";

export interface ApiRental {
  _id: string;
  title: string;
  description: string;
  pricePerDay: number;
  category: string;
  location: string;
  imageUrl: string;
  availability: boolean;
  rating?: number;
  reviewCount?: number;
  createdAt: string;
  owner?: {
    name?: string;
    profileImage?: string;
  };
}

export const rentalCategoryOptions = [
  { label: "Car", value: "car" },
  { label: "Bike", value: "bike" },
  { label: "Cycle", value: "cycle" },
  { label: "Room", value: "room" },
  { label: "Equipment", value: "equipment" },
  { label: "Other", value: "other" },
];

export const categoryGroups = [
  { name: "Vehicles", icon: "Car", values: ["car", "bike", "cycle"] },
  { name: "Rooms", icon: "Home", values: ["room"] },
  { name: "Equipment", icon: "Package", values: ["equipment"] },
  { name: "Other", icon: "MoreHorizontal", values: ["other"] },
];

export const toRentalItem = (rental: ApiRental): RentalItem => ({
  id: rental._id,
  title: rental.title,
  description: rental.description,
  price: rental.pricePerDay,
  priceUnit: "day",
  category: rental.category,
  location: rental.location,
  images: [rental.imageUrl],
  owner: {
    name: rental.owner?.name || "Rental owner",
    avatar: rental.owner?.profileImage || "https://ui-avatars.com/api/?name=Rental+Owner",
    rating: 0,
  },
  rating: rental.rating || 0,
  reviewCount: rental.reviewCount || 0,
  featured: false,
  trending: false,
  available: rental.availability,
  createdAt: rental.createdAt,
});

export const parseRentalsResponse = (response: any): ApiRental[] => {
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.data?.rentals)) return response.data.rentals;
  return [];
};

export const categoryMatches = (itemCategory: string, selectedCategory: string) => {
  if (selectedCategory === "all") return true;
  const group = categoryGroups.find((category) => category.name.toLowerCase() === selectedCategory);
  if (group) return group.values.includes(itemCategory);
  return itemCategory === selectedCategory;
};

export const getCategoryCounts = (items: RentalItem[]) =>
  categoryGroups.map((category) => ({
    ...category,
    count: items.filter((item) => item.available && category.values.includes(item.category)).length,
  }));
