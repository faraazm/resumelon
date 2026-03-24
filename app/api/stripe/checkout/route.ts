import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { stripe, PLANS, PlanInterval } from "@/lib/stripe";
import { getPostHogClient } from "@/lib/posthog-server";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { interval } = (await req.json()) as { interval: PlanInterval };

    if (!interval || !PLANS[interval]) {
      return NextResponse.json(
        { error: "Invalid plan interval" },
        { status: 400 }
      );
    }

    const plan = PLANS[interval];

    // Check if user already has a Stripe customer ID
    const existingCustomers = await stripe.customers.list({
      email: user.emailAddresses[0]?.emailAddress,
      limit: 1,
    });

    let customerId = existingCustomers.data[0]?.id;

    // Create a new customer if one doesn't exist
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.emailAddresses[0]?.emailAddress,
        name: `${user.firstName} ${user.lastName}`.trim() || undefined,
        metadata: {
          clerkUserId: userId,
        },
      });
      customerId = customer.id;
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: plan.priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?canceled=true`,
      metadata: {
        clerkUserId: userId,
        interval,
      },
      subscription_data: {
        metadata: {
          clerkUserId: userId,
        },
      },
    });

    const posthog = getPostHogClient();
    posthog.capture({
      distinctId: userId,
      event: "checkout_initiated",
      properties: { interval, plan_id: plan.priceId },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Checkout session error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
