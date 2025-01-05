import { NextRequest, NextResponse } from "next/server";
import { adminDb, adminMessaging } from "@/lib/firebase-admin";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// Handle GET requests
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const docRef = adminDb.collection("news").doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return NextResponse.json({ error: "News not found" }, { status: 404 });
    }

    const newsData = doc.data();

    return NextResponse.json({
      id: doc.id,
      ...newsData,
    });
  } catch (error) {
    console.error("Error fetching news:", error);
    return NextResponse.json(
      { error: "Failed to fetch news" },
      { status: 500 }
    );
  }
}

// Handle PUT requests
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const data = await request.json();
    const { id } = await params;
    const { title, detail, status } = data;

    const docRef = adminDb.collection("news").doc(id);
    const newsDoc = await docRef.get();

    if (!newsDoc.exists) {
      return NextResponse.json({ error: "News not found" }, { status: 404 });
    }

    const newsData = newsDoc.data();
    const updateData: Partial<typeof newsData> = {
      updatedAt: new Date().toISOString(),
    };

    if (title) updateData.title = title;
    if (detail) updateData.detail = detail;
    if (status) updateData.status = status;

    await docRef.update(updateData);

    if (status && newsData) {
      const userRef = adminDb.collection("users").doc(newsData.createdByUser);
      const userDoc = await userRef.get();
      const userData = userDoc.data();

      if (userData?.fcmToken) {
        await adminMessaging.send({
          notification: {
            title: "News Status Update",
            body: `Your news "${newsData.title}" has been ${status}`,
          },
          token: userData.fcmToken,
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating news:", error);
    return NextResponse.json(
      { error: "Failed to update news" },
      { status: 500 }
    );
  }
}

// Handle DELETE requests
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    await adminDb.collection("news").doc(id).delete();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting news:", error);
    return NextResponse.json(
      { error: "Failed to delete news" },
      { status: 500 }
    );
  }
}
