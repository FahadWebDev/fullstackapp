import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { headers } from "next/headers";
import Stripe from "stripe";

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-12-18.acacia",
});

export async function POST(request: Request) {
  const body = await request.text();
  const sig = headers().get("stripe-signature")!;

  let event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
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
      const userId = session?.metadata?.userId;

      // Save subscription info to Firestore
      await adminDb.collection("subscriptions").add({
        userId,
        stripeCustomerId: session.customer,
        stripePriceId: session.subscription,
        status: "active",
        createdAt: new Date().toISOString(),
        periodEnd: null, // You'll need to get this from the subscription object
      });

      break;
    }
  }

  return NextResponse.json({ received: true });
}
