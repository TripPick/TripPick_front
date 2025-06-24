// src/features/type-filter/components/TabList.tsx

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building, Landmark, MapIcon, PartyPopper } from "lucide-react";
import { category } from "@/pages/typeFilterPage/categoryType"; // 경로 수정

interface TabListProps {
  selectedCategory: string;
  onSelectCategory: (value: string) => void;
}

export default function TabList({
  selectedCategory,
  onSelectCategory,
}: TabListProps) {
  const getIcon = (value: string) => {
    switch (value) {
      case "spots":
        return <Landmark className="mr-2 h-5 w-5" />;
      case "facilities":
        return <Building className="mr-2 h-5 w-5" />;
      case "festivals":
        return <PartyPopper className="mr-2 h-5 w-5" />;
      case "courses":
        return <MapIcon className="mr-2 h-5 w-5" />;
      default:
        return null;
    }
  };

  return (
    <section id="recommendations" className="pt-16 bg-secondary/50">
      <div className="container max-w-5xl mx-auto px-4 py-8 ">
        <div className="mt-6"></div>
        <Tabs value={selectedCategory} onValueChange={onSelectCategory}>
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-0">
            {category.map((cat) => (
              <TabsTrigger key={cat.value} value={cat.value}>
                {getIcon(cat.value)}
                {cat.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
    </section>
  );
}
