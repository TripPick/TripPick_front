import { MapPin } from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";
import type { SearchDto } from "@/api/search";

interface ContentGridProps {
  items: SearchDto[];
}

export default function ContentGrid({ items }: ContentGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
      {items.map((item) => (
        <Card key={item.contentId} className="overflow-hidden group">
          <div className="relative aspect-video -m-10">
            <img
              src={item.firstimage}
              alt={item.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          <CardHeader>
            <CardTitle className="truncate mt-12">{item.title}</CardTitle>
            <CardDescription className="flex items-center pt-1">
              <MapPin className="h-4 w-4 mr-1.5 flex-shrink-0" />
              <span className="truncate">{item.addr1}</span>
            </CardDescription>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}
