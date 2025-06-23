import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Theme = { title: string; icon: React.ReactNode; color: string };

interface TravelSessionProps {
  travelThemes: Theme[];
}

export default function TravelSession({ travelThemes }: TravelSessionProps) {
  return (
    <section id="themes" className="py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-3xl font-bold text-center">테마별 여행</h2>
        <p className="text-muted-foreground text-center mt-2">당신의 스타일에 맞는 여행을 찾아보세요.</p>
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {travelThemes.map((theme, index) => (
            <Card key={index} className="text-center hover:shadow-xl transition-shadow duration-300">
              <CardContent className="flex flex-col items-center justify-center p-8">
                <div className={cn("w-20 h-20 rounded-full flex items-center justify-center mb-6", theme.color)}>
                  {theme.icon}
                </div>
                <h3 className="text-xl font-semibold">{theme.title}</h3>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
