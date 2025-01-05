import { adminDb } from "@/lib/firebase-admin";
import { stripe_server } from "@/lib/stripe-server";
import { verifyAuth } from "@/utils/helper";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { priceId, userId } = await request.json();

    const session = await stripe_server.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/subscription?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/subscription?canceled=true`,
      metadata: {
        userId,
      },
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error("Error creating subscription:", error);
    return NextResponse.json(
      { error: "Failed to create subscription" },
      { status: 500 }
    );
  }
}
export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const decodedToken = await verifyAuth(request);
    if (!decodedToken) {
      return NextResponse.json(
        { error: "Unauthorized: Invalid or missing token" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "Missing userId parameter" },
        { status: 400 }
      );
    }

    if (userId !== decodedToken.uid) {
      return NextResponse.json(
        { error: "Unauthorized: Cannot access other user's subscription" },
        { status: 403 }
      );
    }

    const subscriptionsRef = adminDb.collection("subscriptions");
    const subscriptionQuery = await subscriptionsRef
      .where("userId", "==", userId)
      .where("status", "==", "active")
      .get();

    if (subscriptionQuery.empty) {
      return NextResponse.json({ subscription: null });
    }

    // Get the most recent subscription manually
    const subscriptions = subscriptionQuery.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Sort by createdAt manually if needed
    const latestSubscription = subscriptions.sort(
      (a: any, b: any) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )[0];

    return NextResponse.json({
      subscription: latestSubscription,
    });
  } catch (error) {
    console.error("Error in subscription API:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
