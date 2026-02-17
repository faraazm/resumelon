import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function GET() {
  try {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find the customer by email
    const customers = await stripe.customers.list({
      email: user.emailAddresses[0]?.emailAddress,
      limit: 1,
    });

    if (customers.data.length === 0) {
      return NextResponse.json({
        subscribed: false,
        subscription: null,
      });
    }

    const customerId = customers.data[0].id;

    // Get active subscriptions
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: "active",
      limit: 1,
    });

    if (subscriptions.data.length === 0) {
      // Check for past_due or trialing subscriptions
      const otherSubscriptions = await stripe.subscriptions.list({
        customer: customerId,
        limit: 1,
      });

      if (otherSubscriptions.data.length === 0) {
        return NextResponse.json({
          subscribed: false,
          subscription: null,
        });
      }

      const sub = otherSubscriptions.data[0];
      return NextResponse.json({
        subscribed: sub.status === "trialing",
        subscription: {
          id: sub.id,
          status: sub.status,
          priceId: sub.items.data[0]?.price.id,
          currentPeriodEnd: (sub as unknown as { current_period_end: number }).current_period_end,
          cancelAtPeriodEnd: (sub as unknown as { cancel_at_period_end: boolean }).cancel_at_period_end,
        },
      });
    }

    const subscription = subscriptions.data[0];

    return NextResponse.json({
      subscribed: true,
      subscription: {
        id: subscription.id,
        status: subscription.status,
        priceId: subscription.items.data[0]?.price.id,
        currentPeriodEnd: (subscription as unknown as { current_period_end: number }).current_period_end,
        cancelAtPeriodEnd: (subscription as unknown as { cancel_at_period_end: boolean }).cancel_at_period_end,
      },
    });
  } catch (error) {
    console.error("Subscription status error:", error);
    return NextResponse.json(
      { error: "Failed to fetch subscription status" },
      { status: 500 }
    );
  }
}
