import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { stripe_server } from "@/lib/stripe-server";

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

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
