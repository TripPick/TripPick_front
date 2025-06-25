import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accodion";
import type { ReactNode } from "react";

interface InfoToggleSectionProps {
  // InfoToggleSection 컴포넌트가 받을 props의 타입을 정의합니다.
  title: string; // 토글의 제목
  children: ReactNode; // 토글 안에 들어갈 JSX 요소 (컴포넌트의 자식)
  defaultValue?: string; // (선택 사항) 아코디언의 초기 열림 상태를 제어합니다.
}

export function InfoToggleSection({
  title,
  children,
  defaultValue,
}: InfoToggleSectionProps) {
  return (
    <Accordion
      type="single"
      collapsible
      className="w-full mb-4 border-b last:border-b-0" // 스타일 추가 (하단에 간격 및 구분선)
      defaultValue={defaultValue || title.replace(/\s/g, "-") + "-default"} // defaultValue가 없으면 title 기반으로 고유한 값 설정
    >
      <AccordionItem value={title.replace(/\s/g, "-")}>
        {" "}
        {/* 각 아코디언 아이템의 고유한 값 */}
        <AccordionTrigger className="text-lg font-semibold">
          {title}
        </AccordionTrigger>
        <AccordionContent className="flex flex-col gap-4 text-balance pt-2 pb-4">
          {children}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
