"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format, parse, isValid } from "date-fns";
import { cn } from "@/lib/utils";

const DROPDOWN_START = new Date(1960, 0);
const DROPDOWN_END = new Date(2040, 11);

function parseDate(
  dateStr: string | undefined,
  formats: string[]
): Date | undefined {
  if (!dateStr) return undefined;

  for (const fmt of formats) {
    const parsed = parse(dateStr, fmt, new Date());
    if (isValid(parsed)) return parsed;
  }

  // Try native Date parsing as fallback
  const nativeParsed = new Date(dateStr);
  if (isValid(nativeParsed)) return nativeParsed;

  return undefined;
}

interface DatePickerProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Select date",
  className,
  disabled = false,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);

  const date = parseDate(value, [
    "yyyy-MM-dd",
    "MM/dd/yyyy",
    "MMMM yyyy",
    "MMM yyyy",
    "yyyy",
  ]);

  const handleSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      onChange(format(selectedDate, "yyyy-MM-dd"));
    } else {
      onChange("");
    }
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className={cn(
            "w-full justify-start font-normal",
            !date && "text-muted-foreground",
            className
          )}
        >
          {date ? date.toLocaleDateString() : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto overflow-hidden p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          defaultMonth={date}
          startMonth={DROPDOWN_START}
          endMonth={DROPDOWN_END}
          captionLayout="dropdown"
          onSelect={handleSelect}
        />
      </PopoverContent>
    </Popover>
  );
}

// Month/Year picker for resume dates (typically only need month and year)
interface MonthYearPickerProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function MonthYearPicker({
  value,
  onChange,
  placeholder = "Select date",
  className,
  disabled = false,
}: MonthYearPickerProps) {
  const [open, setOpen] = React.useState(false);

  const date = parseDate(value, ["yyyy-MM", "MMMM yyyy", "MMM yyyy", "yyyy"]);

  const handleSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      onChange(format(selectedDate, "MMMM yyyy"));
    } else {
      onChange("");
    }
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className={cn(
            "w-full justify-start font-normal",
            !date && "text-muted-foreground",
            className
          )}
        >
          {date ? format(date, "MMMM yyyy") : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto overflow-hidden p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          defaultMonth={date}
          startMonth={DROPDOWN_START}
          endMonth={DROPDOWN_END}
          captionLayout="dropdown"
          onSelect={handleSelect}
        />
      </PopoverContent>
    </Popover>
  );
}
