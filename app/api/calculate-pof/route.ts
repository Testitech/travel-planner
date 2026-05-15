import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getFxRate, formatNaira, formatForeign, formatRate } from "@/lib/fx";
import { calculatePof, interpolateAnalysisText } from "@/lib/pof-engine";
import type { ApiResponse, PofApiResponse } from "@/types";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const countryId = searchParams.get("countryId");
    const purposeId = searchParams.get("purposeId");
    const intakeDateParam = searchParams.get("intakeDate");
    const currentBalanceParam = searchParams.get("currentBalance");

    if (!countryId || !purposeId || !intakeDateParam || !currentBalanceParam) {
      const response: ApiResponse<null> = {
        success: false,
        error:
          "Missing required parameters: countryId, purposeId, intakeDate, currentBalance",
      };

      return NextResponse.json(response, { status: 400 });
    }

    const intakeDate = new Date(intakeDateParam);
    const currentBalance = parseFloat(currentBalanceParam);

    if (isNaN(intakeDate.getTime())) {
      const res: ApiResponse<null> = {
        success: false,
        error: "Invalid intake date format",
      };

      return NextResponse.json(res, {
        status: 400,
      });
    }

    if (isNaN(currentBalance) || currentBalance < 0) {
      const res: ApiResponse<null> = {
        success: false,
        error: "Invalid current balance.",
      };

      return NextResponse.json(res, { status: 400 });
    }

    // ── Fetch POF rule ──

    const rule = await prisma.pofRule.findUnique({
      where: {
        countryId_purposeId: {
          countryId,
          purposeId,
        },
      },
    });

    if (!rule) {
      const res: ApiResponse<null> = {
        success: false,
        error:
          "No POF rule found for this country and visa purpose combination.",
      };

      return NextResponse.json(res, { status: 404 });
    }

    const country = await prisma.country.findUnique({
      where: { id: countryId },
    });

    if (!country) {
      const res: ApiResponse<null> = {
        success: false,
        error: "Country not found",
      };

      return NextResponse.json(res, { status: 404 });
    }



    const fxRate=await getFxRate(country.currencyCode)


    
  } catch (error) {}
}
