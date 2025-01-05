// app/api/fcm-token/route.ts
import { NextResponse } from "next/server";
import { adminDb, adminAuth } from "@/lib/firebase-admin";

export async function verifyAuth(request: Request) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return null;
    }

    const token = authHeader.split("Bearer ")[1];
    const decodedToken = await adminAuth.verifyIdToken(token);
    return decodedToken;
  } catch (error) {
    console.error("Auth error:", error);
    return null;
  }
}

export async function POST(request: Request) {
  try {
    // Verify authentication
    const decodedToken = await verifyAuth(request);
    if (!decodedToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { fcmToken } = await request.json();

    if (!fcmToken) {
      return NextResponse.json(
        { error: "FCM Token is required" },
        { status: 400 }
      );
    }

    // Save FCM token to user document
    await adminDb.collection("users").doc(decodedToken.uid).set(
      {
        fcmToken,
        lastTokenUpdate: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );

    return NextResponse.json({
      success: true,
      message: "FCM Token saved successfully",
    });
  } catch (error) {
    console.error("Error saving FCM token:", error);
    return NextResponse.json(
      { error: "Failed to save FCM token" },
      { status: 500 }
    );
  }
}

// Get FCM token for a user
export async function GET(request: Request) {
  try {
    // Verify authentication
    const decodedToken = await verifyAuth(request);
    if (!decodedToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user document
    const userDoc = await adminDb
      .collection("users")
      .doc(decodedToken.uid)
      .get();

    if (!userDoc.exists) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userData = userDoc.data();

    return NextResponse.json({
      fcmToken: userData?.fcmToken || null,
      lastTokenUpdate: userData?.lastTokenUpdate || null,
    });
  } catch (error) {
    console.error("Error fetching FCM token:", error);
    return NextResponse.json(
      { error: "Failed to fetch FCM token" },
      { status: 500 }
    );
  }
}

// Delete FCM token
export async function DELETE(request: Request) {
  try {
    // Verify authentication
    const decodedToken = await verifyAuth(request);
    if (!decodedToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Remove FCM token from user document
    await adminDb.collection("users").doc(decodedToken.uid).update({
      fcmToken: null,
      lastTokenUpdate: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: "FCM Token removed successfully",
    });
  } catch (error) {
    console.error("Error deleting FCM token:", error);
    return NextResponse.json(
      { error: "Failed to delete FCM token" },
      { status: 500 }
    );
  }
}
