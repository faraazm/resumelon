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

  // Parse the string value to a Date object
  const parseDate = (dateStr: string | undefined): Date | undefined => {
    if (!dateStr) return undefined;

    // Try parsing common formats
    const formats = ["yyyy-MM-dd", "MM/dd/yyyy", "MMMM yyyy", "MMM yyyy", "yyyy"];
    for (const fmt of formats) {
      const parsed = parse(dateStr, fmt, new Date());
      if (isValid(parsed)) return parsed;
    }

    // Try native Date parsing as fallback
    const nativeParsed = new Date(dateStr);
    if (isValid(nativeParsed)) return nativeParsed;

    return undefined;
  };

  const date = parseDate(value);

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
          captionLayout="dropdown"
          onSelect={(date) => {
            handleSelect(date);
          }}
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

  // Parse the string value to a Date object
  const parseDate = (dateStr: string | undefined): Date | undefined => {
    if (!dateStr) return undefined;

    // Try parsing common formats
    const formats = ["yyyy-MM", "MMMM yyyy", "MMM yyyy", "yyyy"];
    for (const fmt of formats) {
      const parsed = parse(dateStr, fmt, new Date());
      if (isValid(parsed)) return parsed;
    }

    // Try native Date parsing as fallback
    const nativeParsed = new Date(dateStr);
    if (isValid(nativeParsed)) return nativeParsed;

    return undefined;
  };

  const date = parseDate(value);

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
          captionLayout="dropdown"
          onSelect={(date) => {
            handleSelect(date);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
