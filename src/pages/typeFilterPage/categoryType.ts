export interface CategoryType {
  value: string; // 탭에 사용될 값 (예: "spots", "facilities")
  label: string; // 탭에 표시될 이름 (예: "관광지", "문화시설")
  contentTypeId: number; // 해당 카테고리의 관광타입 ID
}

export const category: CategoryType[] = [
  { value: "spots", label: "관광지", contentTypeId: 12 },
  { value: "facilities", label: "문화시설", contentTypeId: 14 },
  { value: "festivals", label: "축제/행사", contentTypeId: 15 },
  { value: "courses", label: "여행코스", contentTypeId: 25 },
];
