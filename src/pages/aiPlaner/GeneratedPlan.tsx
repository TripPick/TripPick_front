import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Accordion } from "@radix-ui/react-accordion";
import PlanDetailCard from "./PlanDetailCard";

interface Activity {
  activity: string;
  description: string;
}

interface Meal {
  recommendation: string;
  description: string;
}

export interface DayPlan {
  day: number;
  title: string;
  morning: Activity;
  lunch: Meal;
  afternoon?: Activity;
  dinner: Meal;
}

interface GeneratedPlanProps {
  plan: DayPlan[];
}

export default function GeneratedPlan({ plan }: GeneratedPlanProps) {
    return (
        <div className="space-y-4">
            <h3 className="text-2xl font-bold text-center">생성된 여행 계획</h3>
             <Accordion type="single" collapsible className="w-full" defaultValue="day-1">
                {plan.map((dayPlan?: any) => (
                    <AccordionItem key={dayPlan.day} value={`day-${dayPlan.day}`}>
                        <AccordionTrigger>
                           <div className="flex items-center">
                             <h4 className="text-lg font-semibold">Day {dayPlan.day}: {dayPlan.title}</h4>
                           </div>
                        </AccordionTrigger>
                        <AccordionContent>
                           <div className="space-y-4 p-4 bg-background rounded-md">

                                {dayPlan.morning && (
                                    <PlanDetailCard title="오전" activity={dayPlan.morning.activity} description={dayPlan.morning.description} />
                                )}

                                {dayPlan.lunch && (
                                    <PlanDetailCard title="점심" activity={dayPlan.lunch.recommendation} description={dayPlan.lunch.description} />
                                )}

                                {dayPlan.afternoon && (
                                    <PlanDetailCard title="오후" activity={dayPlan.afternoon.activity} description={dayPlan.afternoon.description} />
                                )}

                                {dayPlan.dinner && (
                                    <PlanDetailCard title="저녁" activity={dayPlan.dinner.recommendation} description={dayPlan.dinner.description} />
                                )}
                           </div>
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    );
}