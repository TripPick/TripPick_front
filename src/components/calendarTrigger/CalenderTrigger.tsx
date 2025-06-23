import { Popover } from "@radix-ui/react-popover";
import { Button } from "../ui/button";
import { CalendarIcon } from "lucide-react";
import { PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import { useState } from "react";

export default function CalendarTrigger() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="bg-transparent w-full justify-center text-left text-black font-normal">
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? (
              <span>{date.toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" })}</span>
            ) : (
              <span>날짜 선택</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            className="rounded-md border shadow-sm"
            mode="single"
            selected={date}
            onSelect={setDate}
            captionLayout="dropdown"
          />
        </PopoverContent>
      </Popover>
    </>
  );
}
