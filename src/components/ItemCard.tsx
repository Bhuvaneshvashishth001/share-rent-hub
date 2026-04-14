import { Link } from "react-router-dom";
import { Star, MapPin } from "lucide-react";
import { RentalItem } from "@/lib/sample-data";
import { motion } from "framer-motion";

interface ItemCardProps {
  item: RentalItem;
  index?: number;
}

export default function ItemCard({ item, index = 0 }: ItemCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
    >
      <Link to={`/item/${item.id}`} className="group block">
        <div className="bg-card rounded-lg border border-border overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <div className="aspect-[4/3] overflow-hidden">
            <img
              src={item.images[0]}
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          </div>
          <div className="p-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                {item.category}
              </span>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Star className="h-3.5 w-3.5 fill-warning text-warning" />
                <span>{item.rating}</span>
                <span>({item.reviewCount})</span>
              </div>
            </div>
            <h3 className="font-heading font-bold text-foreground mt-2 line-clamp-1 group-hover:text-primary transition-colors">
              {item.title}
            </h3>
            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
              <MapPin className="h-3 w-3" />
              <span>{item.location}</span>
            </div>
            <div className="flex items-center justify-between mt-3">
              <p className="font-bold text-foreground">
                ${item.price}<span className="text-sm font-normal text-muted-foreground">/{item.priceUnit}</span>
              </p>
              <div className="flex items-center gap-2">
                <img src={item.owner.avatar} alt={item.owner.name} className="h-6 w-6 rounded-full" />
                <span className="text-xs text-muted-foreground">{item.owner.name}</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
