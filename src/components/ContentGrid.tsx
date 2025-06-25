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

  const handleCardClick = (item: CommonContentDto) => {
    // contentId가 존재할 때만 이동
    if (item.contentId) {
      // DTO에 contentId로 정의되어 있다면 이것을 사용.
      navigate(`/detail-page/${item.contentId}`);
    } else {
      console.warn("Content ID가 없어 상세 페이지로 이동할 수 없습니다.", item);
      // contentId가 없을 경우 사용자에게 알리거나 다른 처리 (예: 경고 메시지 표시)
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8 items-start">
      {items.map((item, index) => {
        const key = item.contentId || `${item.title || "no-title"}-${index}`;
        const imageUrl =
          item.firstimage || item.firstimage2 || "/src/assets/logo.png";
        const title = item.title || "제목 없음";
        const address = item.addr1 || "주소 정보 없음"; // CommonContentDto에 addr1이 있다고 가정

        return (
          <Card
            key={key} // 고유한 key 사용
            className="overflow-hidden group flex flex-col h-full"
            onClick={() => handleCardClick(item)}
          >
            <div className="w-full h-48 relative">
              <img
                src={imageUrl}
                alt={title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <CardHeader>
              <CardTitle className="truncate -ml-4 min-w-0">{title}</CardTitle>
              <CardDescription className="flex items-center -ml-4 text-sm max-w-full">
                <MapPin className="h-4 w-4 mr-1.5 flex-shrink-0" />
                <span className="truncate flex-grow min-w-0">{address}</span>
              </CardDescription>
            </CardHeader>
          </Card>
        );
      })}
    </div>
  );
}
