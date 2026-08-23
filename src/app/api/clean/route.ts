import { NextResponse } from "next/server";

import { parseCSV } from "@/lib/csv/parser";
import { cleanRecords } from "@/lib/csv/cleaner";
import { validateRecords } from "@/lib/csv/validator";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (typeof body.csv !== "string") {
      return NextResponse.json(
        { error: "CSV text is required." },
        { status: 400 }
      );
    }

    const rawRecords = parseCSV(body.csv);

    const cleaned = cleanRecords(rawRecords);

    const result = validateRecords(
      cleaned.records,
      rawRecords.length,
      cleaned.missingResolved,
      cleaned.typosFixed
    );

    return NextResponse.json(result);
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unable to process CSV.";

    return NextResponse.json(
      { error: message },
      { status: 400 }
    );
  }
}