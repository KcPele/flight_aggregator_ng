import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar as BaseCalendar } from "@/components/ui/calendar";
import { format, isBefore, startOfDay } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const CustomCalendar = ({ date, onDateChange }) => {
  const [open, setOpen] = useState(false);

  const handleSelect = (selectedDate: Date | undefined) => {
    onDateChange(selectedDate);
    setOpen(false);
  };

  const modifiers = {
    passed: (day: Date) => isBefore(day, startOfDay(new Date())),
  };

  const modifiersClassNames = {
    passed: "line-through text-muted-foreground",
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-start bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700"
        >
          {date ? format(date, "PPP") : "Pick a date"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <BaseCalendar
          mode="single"
          selected={date}
          onSelect={handleSelect}
          initialFocus
          modifiers={modifiers}
          modifiersClassNames={modifiersClassNames}
          fromDate={new Date()}
        />
      </PopoverContent>
    </Popover>
  );
};

export default CustomCalendar;
