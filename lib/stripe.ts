import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-01-28.clover",
  typescript: true,
});

export const PLANS = {
  monthly: {
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_MONTHLY!,
    productId: process.env.NEXT_PUBLIC_STRIPE_PRODUCT_ID_PRO_MONTHLY!,
    price: 19.99,
    interval: "month" as const,
  },
  yearly: {
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_YEARLY!,
    productId: process.env.NEXT_PUBLIC_STRIPE_PRODUCT_ID_PRO_YEARLY!,
    price: 99.99,
    interval: "year" as const,
  },
} as const;

export type PlanInterval = keyof typeof PLANS;
