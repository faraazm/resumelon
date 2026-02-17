import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  return (
    <Link
      href="/"
      className={`flex items-center gap-2 text-xl tracking-tight ${className ?? ""}`}
    >
      <Image
        src="/images/nice-resume-logo.png"
        alt=""
        width={22}
        height={22}
        className="h-[22px] w-[22px]"
        priority
      />
      <span>
        <span className="font-light">nice</span>
        <span className="font-bold">resume</span>
      </span>
    </Link>
  );
}
