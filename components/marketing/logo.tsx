import Link from "next/link";
import { SparklesIcon } from "@heroicons/react/24/solid";

interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  return (
    <Link
      href="/"
      className={`flex items-center gap-2 text-[22px] tracking-tight ${className ?? ""}`}
    >
      <SparklesIcon className="h-5 w-5 text-black dark:text-white" />
      <span>
        <span className="font-light">nice</span>
        <span className="font-bold">resume</span>
      </span>
    </Link>
  );
}
