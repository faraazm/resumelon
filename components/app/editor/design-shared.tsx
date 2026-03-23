"use client";

import { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckIcon } from "@heroicons/react/24/outline";

// ── Shared data ──

export const sansSerifFonts = [
  { id: "inter", name: "Inter", style: "font-sans" },
  { id: "roboto", name: "Roboto", style: "font-sans" },
  { id: "lato", name: "Lato", style: "font-sans" },
  { id: "opensans", name: "Open Sans", style: "font-sans" },
  { id: "montserrat", name: "Montserrat", style: "font-sans" },
  { id: "raleway", name: "Raleway", style: "font-sans" },
  { id: "sourcesans", name: "Source Sans", style: "font-sans" },
  { id: "poppins", name: "Poppins", style: "font-sans" },
  { id: "nunito", name: "Nunito", style: "font-sans" },
];

export const serifFonts = [
  { id: "merriweather", name: "Merriweather", style: "font-serif" },
  { id: "playfair", name: "Playfair Display", style: "font-serif" },
  { id: "lora", name: "Lora", style: "font-serif" },
  { id: "crimson", name: "Crimson Text", style: "font-serif" },
  { id: "librebaskerville", name: "Libre Baskerville", style: "font-serif" },
  { id: "garamond", name: "EB Garamond", style: "font-serif" },
];

export const spacingOptions = [
  { id: "compact", name: "Compact" },
  { id: "normal", name: "Normal" },
  { id: "spacious", name: "Spacious" },
];

export const accentColors = [
  { id: "#000000", name: "Black" },
  { id: "#1e3a5f", name: "Navy" },
  { id: "#2563eb", name: "Blue" },
  { id: "#0d9488", name: "Teal" },
  { id: "#059669", name: "Green" },
  { id: "#7c3aed", name: "Purple" },
  { id: "#dc2626", name: "Red" },
  { id: "#ea580c", name: "Orange" },
];

export const backgroundColors = [
  { id: "#ffffff", name: "White" },
  { id: "#fafafa", name: "Snow" },
  { id: "#f5f5f4", name: "Warm Gray" },
  { id: "#faf5ff", name: "Lavender" },
  { id: "#f0f9ff", name: "Ice Blue" },
  { id: "#f0fdf4", name: "Mint" },
  { id: "#fffbeb", name: "Cream" },
  { id: "#fff1f2", name: "Blush" },
];

// ── Shared UI components ──

export function DesignSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section>
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      {children}
    </section>
  );
}

export function DesignSeparator() {
  return <Separator />;
}

export function FontSelect({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">Sans Serif</div>
          {sansSerifFonts.map((font) => (
            <SelectItem key={font.id} value={font.id}>
              <span className={font.style}>{font.name}</span>
            </SelectItem>
          ))}
          <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground mt-1">Serif</div>
          {serifFonts.map((font) => (
            <SelectItem key={font.id} value={font.id}>
              <span className={font.style}>{font.name}</span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export function SpacingSelector({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex gap-2">
      {spacingOptions.map((option) => {
        const isSelected = value === option.id;
        return (
          <motion.button
            key={option.id}
            onClick={() => onChange(option.id)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className={`flex-1 rounded-lg px-3 md:px-4 py-2 md:py-3 text-sm font-medium cursor-pointer transition-colors duration-200 ${
              isSelected
                ? "border-2 border-primary bg-primary/5 text-primary"
                : "border border-border bg-background text-muted-foreground hover:border-foreground/20"
            }`}
          >
            {option.name}
          </motion.button>
        );
      })}
    </div>
  );
}

export function ColorPicker({
  colors,
  value,
  onChange,
  useWhiteCheck,
}: {
  colors: { id: string; name: string }[];
  value: string;
  onChange: (value: string) => void;
  useWhiteCheck?: boolean;
}) {
  return (
    <div className="flex flex-wrap gap-3">
      {colors.map((color) => {
        const isSelected = value === color.id;
        const needsPrimaryRing =
          color.id === "#ffffff" || color.id === "#fafafa" || color.id === "#f5f5f4";
        return (
          <motion.button
            key={color.id}
            onClick={() => onChange(color.id)}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.95 }}
            animate={{
              boxShadow: isSelected
                ? `0 0 0 2px hsl(var(--background)), 0 0 0 3.5px ${needsPrimaryRing && useWhiteCheck ? "hsl(var(--primary))" : color.id}`
                : "0 0 0 0px transparent, 0 0 0 0px transparent",
            }}
            transition={{ duration: 0.2 }}
            className={`relative w-10 h-10 rounded-full cursor-pointer ${useWhiteCheck ? "border border-border" : ""}`}
            style={{ backgroundColor: color.id }}
            title={color.name}
          >
            <AnimatePresence>
              {isSelected && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <CheckIcon className={`h-5 w-5 ${useWhiteCheck ? "text-gray-600" : "text-white"}`} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        );
      })}
    </div>
  );
}
