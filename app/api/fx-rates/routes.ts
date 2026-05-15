import { NextResponse } from "next/server";
import { getAllFxRates, getRateAge, isRateFresh } from "@/lib/fx";
import type { ApiResponse } from "@/types";

export async function GET() {
  try {
    const rates = await getAllFxRates();

    const ratesWithMeta = rates.map((rate) => ({
      ...rate,
      isFresh: isRateFresh(rate.lastUpdated),
      age: getRateAge(rate.lastUpdated),
    }));

    const res: ApiResponse<typeof ratesWithMeta> = {
      success: true,
      data: ratesWithMeta,
    };

    return NextResponse.json(res, {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=60",
      },
    });
  } catch (error) {
    console.error("[api/fx-rates] Failed to fetch rates:", error);

    const res: ApiResponse<null> = {
      success: false,
      error: "Failed to fetch fx-rates. Please try again.",
    };

    return NextResponse.json(res, {
      status: 500,
    });
  }
}
