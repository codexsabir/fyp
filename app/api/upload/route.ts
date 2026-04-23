import { NextResponse } from 'next/server';

export async function POST() {
    return NextResponse.json({
        success: true,
        url: `https://dummyimage.com/1200x800/e5e7eb/111827&text=RentP+Upload+${Date.now()}`,
    });
}
