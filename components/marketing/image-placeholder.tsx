import { PhotoIcon } from "@heroicons/react/24/outline";

interface ImagePlaceholderProps {
  label?: string;
  aspectRatio?: "square" | "video" | "wide" | "auto";
  className?: string;
  rounded?: "lg" | "xl" | "2xl" | "3xl";
}

const aspectMap = {
  square: "aspect-square",
  video: "aspect-video",
  wide: "aspect-[2/1]",
  auto: "",
};

export function ImagePlaceholder({
  label = "Image coming soon",
  aspectRatio = "video",
  className = "",
  rounded = "2xl",
}: ImagePlaceholderProps) {
  return (
    <div
      className={`flex items-center justify-center bg-muted/50 border border-dashed border-border rounded-${rounded} ${aspectMap[aspectRatio]} ${className}`}
    >
      <div className="flex flex-col items-center gap-2 text-muted-foreground">
        <PhotoIcon className="h-8 w-8" />
        <span className="text-sm">{label}</span>
      </div>
    </div>
  );
}
