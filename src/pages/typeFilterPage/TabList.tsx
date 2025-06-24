import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building, Landmark, MapIcon, PartyPopper } from "lucide-react";

interface TabListProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export default function TabList({
  selectedCategory,
  onSelectCategory,
}: TabListProps) {
  return (
    <>
      <section id="recommendations" className="pt-16 bg-secondary/50">
        <div className="container max-w-5xl mx-auto px-4 py-8 ">
          <div className="mt-6">
            <Tabs
              value={selectedCategory}
              onValueChange={(value) => onSelectCategory(value)}
            >
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-0">
                <TabsTrigger value="spots">
                  <Landmark className="mr-2 h-5 w-5" />
                  관광지
                </TabsTrigger>
                <TabsTrigger value="facilities">
                  <Building className="mr-2 h-5 w-5" />
                  문화시설
                </TabsTrigger>
                <TabsTrigger value="festivals">
                  <PartyPopper className="mr-2 h-5 w-5" />
                  축제/행사
                </TabsTrigger>
                <TabsTrigger value="courses">
                  <MapIcon className="mr-2 h-5 w-5" />
                  여행코스
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </section>
    </>
  );
}
