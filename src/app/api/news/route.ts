import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { title, detail, userId } = data;

    const docRef = await adminDb.collection("news").add({
      title,
      detail,
      status: "pending",
      createdByUser: userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({
      id: docRef.id,
      success: true,
    });
  } catch (error) {
    console.error("Error creating news:", error);
    return NextResponse.json(
      { error: "Failed to create news" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const status = searchParams.get("status");

    const newsRef = adminDb.collection("news");
    let newsQuery = userId
      ? newsRef.where("createdByUser", "==", userId)
      : newsRef;

    if (status && status !== "all") {
      newsQuery = newsQuery.where("status", "==", status);
    }
    const snapshot = await newsQuery.get();
    const news = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(news);
  } catch (error) {
    console.error("Error fetching news:", error);
    return NextResponse.json(
      { error: "Failed to fetch news" },
      { status: 500 }
    );
  }
}
