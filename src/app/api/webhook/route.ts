import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { stripe_server } from "@/lib/stripe-server";

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

const PRICE_MAP: { [key: string]: string } = {
  [process.env.NEXT_PUBLIC_STRIPE_BASIC_PRICE_ID!]: "basic",
  [process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID!]: "pro",
};

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature")!;

  let event;

  try {
    event = stripe_server.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err) {
    return NextResponse.json(
      { error: "Webhook signature verification failed" },
      { status: 400 }
    );
  }

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      const userId = session.metadata?.userId;
      const subscriptionId = session.subscription as string;

      const subscription = await stripe_server.subscriptions.retrieve(subscriptionId);
      const priceId = subscription.items.data[0].price.id;

      // Save subscription with original price ID
      await adminDb.collection("subscriptions").add({
        userId,
        stripeSubscriptionId: subscriptionId,
        stripePriceId: priceId,
        planType: PRICE_MAP[priceId] || "custom", // Add plan type
        stripeCustomerId: session.customer,
        status: subscription.status,
        currentPeriodStart: new Date(
          subscription.current_period_start * 1000
        ).toISOString(),
        currentPeriodEnd: new Date(
          subscription.current_period_end * 1000
        ).toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      break;
    }
  }

  return NextResponse.json({ received: true });
}
