import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";

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
  const customerId = session.customer as string;
  const subscriptionId = session.subscription as string;

  console.log("Checkout completed:", {
    clerkUserId,
    customerId,
    subscriptionId,
  });

  // TODO: Store subscription info in your database (Convex)
  // Example: await convex.mutation(api.subscriptions.create, {
  //   clerkUserId,
  //   stripeCustomerId: customerId,
  //   stripeSubscriptionId: subscriptionId,
  //   status: "active",
  // });
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  const clerkUserId = subscription.metadata?.clerkUserId;

  console.log("Subscription created:", {
    clerkUserId,
    subscriptionId: subscription.id,
    status: subscription.status,
  });

  // TODO: Store subscription in database
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const clerkUserId = subscription.metadata?.clerkUserId;

  console.log("Subscription updated:", {
    clerkUserId,
    subscriptionId: subscription.id,
    status: subscription.status,
    cancelAtPeriodEnd: subscription.cancel_at_period_end,
  });

  // TODO: Update subscription status in database
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const clerkUserId = subscription.metadata?.clerkUserId;

  console.log("Subscription deleted:", {
    clerkUserId,
    subscriptionId: subscription.id,
  });

  // TODO: Mark subscription as canceled in database
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string;

  console.log("Payment failed:", {
    customerId,
    invoiceId: invoice.id,
    amountDue: invoice.amount_due,
  });

  // TODO: Notify user of failed payment, update subscription status
}

async function handleInvoicePaid(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string;

  console.log("Invoice paid:", {
    customerId,
    invoiceId: invoice.id,
    amountPaid: invoice.amount_paid,
  });

  // TODO: Update subscription period, send receipt
}
