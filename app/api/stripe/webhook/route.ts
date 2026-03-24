import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    console.error("Webhook signature verification failed:", error);
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(session);
        break;
      }

      case "customer.subscription.created": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionCreated(subscription);
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdated(subscription);
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(subscription);
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        await handlePaymentFailed(invoice);
        break;
      }

      case "invoice.paid": {
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaid(invoice);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook handler error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const clerkUserId = session.metadata?.clerkUserId;
  const subscriptionId = session.subscription as string;

  if (!clerkUserId) {
    console.error("Checkout completed without clerkUserId in metadata");
    return;
  }

  await convex.mutation(api.users.updateSubscriptionStatus, {
    clerkId: clerkUserId,
    subscriptionStatus: "active",
    stripeSubscriptionId: subscriptionId,
  });
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  const clerkUserId = subscription.metadata?.clerkUserId;

  if (!clerkUserId) {
    console.error("Subscription created without clerkUserId in metadata");
    return;
  }

  await convex.mutation(api.users.updateSubscriptionStatus, {
    clerkId: clerkUserId,
    subscriptionStatus: subscription.status,
    stripeSubscriptionId: subscription.id,
  });
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const clerkUserId = subscription.metadata?.clerkUserId;

  if (!clerkUserId) {
    console.error("Subscription updated without clerkUserId in metadata");
    return;
  }

  await convex.mutation(api.users.updateSubscriptionStatus, {
    clerkId: clerkUserId,
    subscriptionStatus: subscription.status,
    stripeSubscriptionId: subscription.id,
  });
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const clerkUserId = subscription.metadata?.clerkUserId;

  if (!clerkUserId) {
    console.error("Subscription deleted without clerkUserId in metadata");
    return;
  }

  await convex.mutation(api.users.updateSubscriptionStatus, {
    clerkId: clerkUserId,
    subscriptionStatus: "canceled",
    stripeSubscriptionId: subscription.id,
  });
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  // Try to find the clerkUserId via the subscription metadata
  const subscriptionRef = invoice.parent?.subscription_details?.subscription;
  const subscriptionId = typeof subscriptionRef === 'string'
    ? subscriptionRef
    : subscriptionRef?.id;
  if (!subscriptionId) return;

  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const clerkUserId = subscription.metadata?.clerkUserId;

    if (clerkUserId) {
      await convex.mutation(api.users.updateSubscriptionStatus, {
        clerkId: clerkUserId,
        subscriptionStatus: "past_due",
      });
    }
  } catch (error) {
    console.error("Failed to handle payment failure:", error);
  }
}

async function handleInvoicePaid(invoice: Stripe.Invoice) {
  // Ensure subscription stays active after successful payment
  const subscriptionRef = invoice.parent?.subscription_details?.subscription;
  const subscriptionId = typeof subscriptionRef === 'string'
    ? subscriptionRef
    : subscriptionRef?.id;
  if (!subscriptionId) return;

  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const clerkUserId = subscription.metadata?.clerkUserId;

    if (clerkUserId) {
      await convex.mutation(api.users.updateSubscriptionStatus, {
        clerkId: clerkUserId,
        subscriptionStatus: "active",
      });
    }
  } catch (error) {
    console.error("Failed to handle invoice paid:", error);
  }
}
