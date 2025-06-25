import type { DetailDto } from "@/api/Dto";
import { MapPin, Info } from "lucide-react";

interface BasicInfoContentProps {
  item: DetailDto; // 여기에 item prop을 DetailDto 타입으로 명시합니다.
}
export default function BasicInfoContent({ item }: BasicInfoContentProps) {
  return (
    <div className="space-y-3">
      <p className="flex items-start">
        <MapPin className="h-5 w-5 mr-2 flex-shrink-0 text-gray-500 mt-0.5" />
        <span>{item.addr1 || "정보 없음"}</span>
      </p>
      {item.tel && ( // tel 정보가 있을 경우에만 렌더링
        <p className="flex items-start">
          <Info className="h-5 w-5 mr-2 flex-shrink-0 text-gray-500 mt-0.5" />
          <span>연락처: {item.tel}</span>
        </p>
      )}
      {/* <p>
        <strong className="block mb-1">개요:</strong>
        {item.overview || "상세 개요 정보가 없습니다."}
      </p> */}
    </div>
  );
}
