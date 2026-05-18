import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getFxRate, formatNaira } from "@/lib/fx";
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

    const fxRate = await getFxRate(country.currencyCode);

    const purpose = await prisma.visaPurpose.findUnique({
      where: { id: purposeId },
    });

    let studyIntakes: number[] = [];
    let studyIntakesFull = null;

    if (purpose?.slug === "study") {
      const intakes = await prisma.studyIntake.findMany({
        where: { countryId },
      });
      studyIntakes = intakes.map((i) => i.intakeMonth);
      studyIntakesFull = intakes;
    }

    const calculation = calculatePof({
      rule,
      fxRate,
      intakeDate,
      intakeMonths: studyIntakes,
      currentBalanceNaira: currentBalance,
    });

    const interpolateAnalysis = interpolateAnalysisText(rule.analysisText, {
      parallelRate: fxRate.parallelRate,
      cbnRate: fxRate.cbnRate,
      safeDate: calculation.safeStartDate.toLocaleDateString("en-NG", {
        month: "long",
        year: "numeric",
      }),
      cautionDate: calculation.cautionStartDate.toLocaleDateString("en-NG", {
        month: "long",
        year: "numeric",
      }),
      nairaTarget: formatNaira(calculation.recommendedNairaTarget),
      monthlyDeposit: formatNaira(calculation.safeMonthlyDeposit),
      currencyCode: country.currencyCode,
      minAmountForeign: rule.minAmountForeign,
    });

    const interpolatedNigerianSpecific = interpolateAnalysisText(
      rule.nigerianSpecific,
      {
        parallelRate: fxRate.parallelRate,
        cbnRate: fxRate.cbnRate,
        safeDate: calculation.safeStartDate.toLocaleDateString("en-NG", {
          month: "long",
          year: "numeric",
        }),
        cautionDate: calculation.cautionStartDate.toLocaleDateString("en-NG", {
          month: "long",
          year: "numeric",
        }),
        nairaTarget: formatNaira(calculation.recommendedNairaTarget),
        monthlyDeposit: formatNaira(calculation.safeMonthlyDeposit),
        currencyCode: country.currencyCode,
        minAmountForeign: rule.minAmountForeign,
      },
    );

    const response: PofApiResponse = {
      success: true,
      data: {
        rule: {
          ...rule,
          analysisText: interpolateAnalysis,
          nigeriaSpecific: interpolatedNigerianSpecific,
        },
        calculation,
        fxRate,
        studyIntakes: studyIntakesFull ?? undefined,
      },
    };

    return NextResponse.json(response, {
      status: 200,
      headers: {
        "Cache-Control": "private, max-age=120",
      },
    });
  } catch (error) {
    console.error("[api/calculate-pof] Calculation failed:", error);

    const res: ApiResponse<null> = {
      success: false,
      error: "Calculation failed. Please try again.",
    };

    return NextResponse.json(res, { status: 500 });
  }
}
