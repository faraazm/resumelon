"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Button } from "@/components/ui/button";
import {
  CheckIcon,
  SparklesIcon,
  DocumentTextIcon,
  EnvelopeIcon,
  BoltIcon,
  StarIcon,
} from "@heroicons/react/24/outline";

interface UpgradeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const benefits = [
  { icon: DocumentTextIcon, text: "Unlimited resume creations" },
  { icon: EnvelopeIcon, text: "Unlimited cover letters" },
  { icon: SparklesIcon, text: "Unlimited AI-powered tailoring" },
  { icon: BoltIcon, text: "AI content suggestions & rewrites" },
  { icon: StarIcon, text: "Priority support" },
];

export function UpgradeDialog({ open, onOpenChange }: UpgradeDialogProps) {
  const [interval, setInterval] = useState<"monthly" | "yearly">("yearly");
  const [isLoading, setIsLoading] = useState(false);

  const handleUpgrade = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ interval }),
      });
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Error creating checkout:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[420px] !gap-0 p-0 overflow-hidden">
        <VisuallyHidden>
          <DialogTitle>Upgrade to Pro</DialogTitle>
        </VisuallyHidden>

        {/* Header section */}
        <div className="px-6 pt-6 pb-4">
          {/* Logo */}
          <div className="flex justify-center">
            <div className="flex items-center gap-1.5 text-xl font-semibold tracking-tight">
              <Image
                src="/images/resumelon-logo.png"
                alt=""
                width={24}
                height={24}
                className="h-6 w-6"
              />
              <span>resumelon</span>
            </div>
          </div>

          <div className="text-center mt-4">
            <h2 className="text-lg font-semibold tracking-tight">
              Upgrade to Pro
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              You&apos;ve used all your free generations this month.
              Upgrade for unlimited access.
            </p>
          </div>
        </div>

        {/* Benefits */}
        <div className="px-6 py-4 space-y-2.5">
          {benefits.map((benefit) => (
            <div key={benefit.text} className="flex items-center gap-3">
              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100">
                <CheckIcon className="h-3 w-3 text-emerald-600" />
              </div>
              <span className="text-[14px]">{benefit.text}</span>
            </div>
          ))}
        </div>

        {/* Pricing section */}
        <div className="px-6 pt-2 pb-6 border-t bg-muted/30">
          {/* Toggle */}
          <div className="flex items-center justify-center gap-1 mt-4 rounded-lg bg-gray-100 p-1">
            <button
              onClick={() => setInterval("monthly")}
              className={`flex-1 rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
                interval === "monthly"
                  ? "bg-white text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setInterval("yearly")}
              className={`flex-1 rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
                interval === "yearly"
                  ? "bg-white text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Yearly
              <span className="ml-1.5 text-xs text-emerald-600 font-semibold">
                Save 58%
              </span>
            </button>
          </div>

          {/* Price */}
          <div className="mt-4 text-center">
            <div className="text-3xl font-bold tracking-tight">
              ${interval === "monthly" ? "19.99" : "99.99"}
              <span className="text-base font-normal text-muted-foreground">
                /{interval === "monthly" ? "mo" : "yr"}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {interval === "yearly"
                ? "~$8.33/mo billed annually"
                : "Billed monthly"}
            </p>
          </div>

          <Button
            onClick={handleUpgrade}
            disabled={isLoading}
            className="w-full mt-4"
            size="lg"
          >
            {isLoading ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Redirecting...
              </>
            ) : (
              "Upgrade Now"
            )}
          </Button>

          <p className="text-center text-xs text-muted-foreground mt-3">
            Cancel anytime. No questions asked.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
