import { NextRequest, NextResponse } from 'next/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ storageId: string }> }
) {
  try {
    // Await the new params Promise (Next.js 16 requirement)
    const { storageId } = await context.params;

    const storageIdTyped = storageId as Id<"_storage">;

    // Query Convex to get file URL
    const fileUrl = await convex.query(api.files.getFileUrl, {
      storageId: storageIdTyped,
    });

    if (!fileUrl) {
      return NextResponse.json(
        { error: "File not found" },
        { status: 404 }
      );
    }

    // Redirect to Convex storage URL
    return NextResponse.redirect(fileUrl);

  } catch (error) {
    console.error("Error fetching file:", error);
    return NextResponse.json(
      { error: "Failed to fetch file" },
      { status: 500 }
    );
  }
}
