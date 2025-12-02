import { NextRequest, NextResponse } from 'next/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function GET(
    request: NextRequest,
    { params }: { params: { storageId: string } }
) {
    try {
        const storageId = params.storageId as Id<"_storage">;

        // Get the file URL from Convex
        const fileUrl = await convex.query(api.files.getFileUrl, { storageId });

        if (!fileUrl) {
            return NextResponse.json({ error: 'File not found' }, { status: 404 });
        }

        // Redirect to the Convex storage URL
        return NextResponse.redirect(fileUrl);
    } catch (error) {
        console.error('Error fetching file:', error);
        return NextResponse.json({ error: 'Failed to fetch file' }, { status: 500 });
    }
}
