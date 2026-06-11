import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Waitlist from "@/models/Waitlist";
import { checkRateLimit } from "@/lib/rateLimiter";

export async function GET() {
  try {
    await connectToDatabase();
    const count = await Waitlist.countDocuments();
    return NextResponse.json({ count }, {
      headers: { "Cache-Control": "s-maxage=60, stale-while-revalidate=300" },
    });
  } catch {
    return NextResponse.json({ count: 0 }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
    if (!checkRateLimit(ip, 5, 60 * 60 * 1000)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { name, mobileNumber, occupation } = body;

    if (!name || !mobileNumber) {
      return NextResponse.json(
        { error: "Name and WhatsApp number are required" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const existingEntry = await Waitlist.findOne({ mobileNumber });
    if (existingEntry) {
      return NextResponse.json(
        { error: "This number is already on the waitlist." },
        { status: 409 }
      );
    }

    const newEntry = await Waitlist.create({ name, mobileNumber, occupation });

    return NextResponse.json(
      { success: true, message: "Successfully joined waitlist", data: newEntry },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Waitlist POST error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
