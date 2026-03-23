import Link from "next/link";
import Image from "next/image";

interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  return (
    <Link
      href="/"
      className={`flex items-center gap-1.5 text-[22px] font-semibold tracking-tight ${className ?? ""}`}
    >
      <Image
        src="/images/resumeclone-logo.png"
        alt=""
        width={24}
        height={24}
        className="h-6 w-6"
      />
      <span>resumeclone</span>
    </Link>
  );
}

interface BrandNameProps {
  className?: string;
}

export function BrandName({ className = "" }: BrandNameProps) {
  return (
    <span className={`font-semibold ${className}`}>resumeclone</span>
  );
}
