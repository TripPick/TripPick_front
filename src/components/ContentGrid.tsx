import { MapPin } from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";

import { useNavigate } from "react-router-dom";
import type { CommonContentDto } from "@/api/Dto";

interface ContentGridProps {
  items: CommonContentDto[];
}

export default function ContentGrid({ items }: ContentGridProps) {
  console.log("ContentGrid received items (for key check):", items);
  const navigate = useNavigate();
  const handleCardClick = (contentId: string) => {
    navigate(`/detail-page/${contentId}`);
  };
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8 items-start">
      {items.map((item) => (
        <Card
          key={item.contentId}
          className="overflow-hidden group flex flex-col h-full"
          onClick={() => handleCardClick(item.contentId)}
        >
          <div className="w-full h-48 relative">
            <img
              src={item.firstimage || "/src/assets/logo.png"}
              alt={item.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          <CardHeader>
            <CardTitle className="truncate -ml-4 min-w-0">
              {item.title}
            </CardTitle>
            <CardDescription className="flex items-center -ml-4 text-sm max-w-full">
              {" "}
              {/* max-w-full 추가 */}
              <MapPin className="h-4 w-4 mr-1.5 flex-shrink-0" />
              <span className="truncate flex-grow min-w-0">{item.addr1}</span>
            </CardDescription>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}
