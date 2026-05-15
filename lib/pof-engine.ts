import type {
  PofRule,
  FxRate,
  PofStatus,
  MonthStatus,
  PofCalculationResult,
} from "@/types";

// ─────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const FX_BUFFER_PERCENT = 0.05; // 5% buffer on parallel rate
const LUMP_SUM_THRESHOLD = 0.4; // monthly deposit > 40% of balance = lump sum risk

// ─────────────────────────────────────────
// CORE DATE CALCULATION
// ─────────────────────────────────────────

function subtractMonths(date: Date, months: number): Date {
  const result = new Date(date);
  result.setMonth(result.getMonth() - months);
  return result;
}

function getMonthKey(date: Date): string {
  // Returns "YYYY-MM" for easy comparison
  return `${date.getFullYear()}-${String(date.getMonth()).padStart(2, "0")}`;
}

// ─────────────────────────────────────────
// STATUS RESOLVER
// ─────────────────────────────────────────

function resolveMonthStatus(
  monthDate: Date,
  safeStartDate: Date,
  cautionStartDate: Date,
  riskyStartDate: Date,
  intakeDate: Date,
): PofStatus {
  const m = monthDate.getTime();
  const safe = safeStartDate.getTime();
  const caution = cautionStartDate.getTime();
  const risky = riskyStartDate.getTime();
  const intake = intakeDate.getTime();

  if (m >= intake) return "risky"; // past intake date
  if (m <= safe) return "safe"; // before or at safe start
  if (m <= caution) return "caution"; // between safe and caution
  if (m <= risky) return "risky"; // between caution and intake
  return "risky";
}

// ─────────────────────────────────────────
// MONTH NOTE GENERATOR
// ─────────────────────────────────────────

function generateMonthNote(
  status: PofStatus,
  monthName: string,
  rule: PofRule,
  isIntakeMonth: boolean,
): string {
  if (isIntakeMonth) {
    return `${monthName} is your target intake month. Your funds must already be fully seasoned and sitting in your account by now.`;
  }

  switch (status) {
    case "safe":
      return `${monthName} is an ideal time to begin building your account balance. Start making consistent monthly deposits now to establish a credible financial history.`;
    case "caution":
      return rule.requiresHistory
        ? `${monthName} is getting tight. Embassies like ${rule.countryId} scrutinise account history closely. You need to accelerate deposits carefully without triggering lump sum flags.`
        : `${monthName} is within range but leaves little buffer. Ensure funds are in place and avoid any large unexplained transactions.`;
    case "risky":
      return `${monthName} is a high-risk period to be starting your preparation. A sudden large deposit now will almost certainly raise financial manipulation flags with the embassy. Proceed with extreme caution.`;
  }
}

// ─────────────────────────────────────────
// NAIRA CALCULATIONS
// ─────────────────────────────────────────

function calculateNairaTargets(
  amountForeign: number,
  fxRate: FxRate,
): {
  officialNairaTarget: number;
  parallelNairaTarget: number;
  recommendedNairaTarget: number;
} {
  const officialNairaTarget = Math.ceil(amountForeign * fxRate.cbnRate);
  const parallelNairaTarget = Math.ceil(amountForeign * fxRate.parallelRate);
  const recommendedNairaTarget = Math.ceil(
    parallelNairaTarget * (1 + FX_BUFFER_PERCENT),
  );

  return {
    officialNairaTarget,
    parallelNairaTarget,
    recommendedNairaTarget,
  };
}

// ─────────────────────────────────────────
// STATEMENT HEALTH ANALYZER
// ─────────────────────────────────────────

function analyzeStatementHealth(
  currentBalanceNaira: number,
  recommendedNairaTarget: number,
  monthsAvailable: number,
): {
  safeMonthlyDeposit: number;
  lumpSumRisk: boolean;
} {
  const deficit = Math.max(0, recommendedNairaTarget - currentBalanceNaira);
  const safeMonthlyDeposit =
    monthsAvailable > 0 ? Math.ceil(deficit / monthsAvailable) : deficit;

  // Lump sum risk: if required monthly deposit exceeds
  // 40% of current balance it looks suspicious to embassy
  const lumpSumRisk =
    currentBalanceNaira > 0
      ? safeMonthlyDeposit / currentBalanceNaira > LUMP_SUM_THRESHOLD
      : true;

  return { safeMonthlyDeposit, lumpSumRisk };
}

// ─────────────────────────────────────────
// 12-MONTH CALENDAR BREAKDOWN
// ─────────────────────────────────────────

function generateMonthlyBreakdown(
  intakeDate: Date,
  safeStartDate: Date,
  cautionStartDate: Date,
  riskyStartDate: Date,
  rule: PofRule,
  intakeMonths: number[], // e.g. [1, 5, 9] for Jan, May, Sep
): MonthStatus[] {
  const breakdown: MonthStatus[] = [];
  const today = new Date();
  console.log(today);

  // Generate 12 months starting from current month
  for (let i = 0; i < 12; i++) {
    const monthDate = new Date(today.getFullYear(), today.getMonth() + i, 1);
    const monthNumber = monthDate.getMonth() + 1; // 1-indexed
    const isIntakeMonth = intakeMonths.includes(monthNumber);

    const status = resolveMonthStatus(
      monthDate,
      safeStartDate,
      cautionStartDate,
      riskyStartDate,
      intakeDate,
    );

    const monthName = MONTH_NAMES[monthDate.getMonth()];

    breakdown.push({
      month: monthDate.getMonth(), // 0-indexed for frontend
      monthName,
      status,
      note: generateMonthNote(status, monthName, rule, isIntakeMonth),
      isIntakeMonth,
    });
  }

  return breakdown;
}

// ─────────────────────────────────────────
// MAIN ENGINE FUNCTION
// ─────────────────────────────────────────

export function calculatePof(params: {
  rule: PofRule;
  fxRate: FxRate;
  intakeDate: Date;
  currentBalanceNaira: number;
  intakeMonths?: number[];
}): PofCalculationResult {
  const {
    rule,
    fxRate,
    intakeDate,
    currentBalanceNaira,
    intakeMonths = [],
  } = params;

  // Step 1 — Calculate buffer dates backward from intake
  const safeStartDate = subtractMonths(intakeDate, rule.safeBufferMonths);
  const cautionStartDate = subtractMonths(intakeDate, rule.cautionBufferMonths);
  const riskyStartDate = subtractMonths(intakeDate, rule.riskyBufferMonths);

  // Step 2 — Resolve current month status
  const today = new Date();
  const currentStatus = resolveMonthStatus(
    today,
    safeStartDate,
    cautionStartDate,
    riskyStartDate,
    intakeDate,
  );

  // Step 3 — Naira calculations
  const { officialNairaTarget, parallelNairaTarget, recommendedNairaTarget } =
    calculateNairaTargets(rule.minAmountForeign, fxRate);

  // Step 4 — Months available from today to intake
  const monthsAvailable = Math.max(
    0,
    (intakeDate.getFullYear() - today.getFullYear()) * 12 +
      (intakeDate.getMonth() - today.getMonth()),
  );

  // Step 5 — Statement health analysis
  const { safeMonthlyDeposit, lumpSumRisk } = analyzeStatementHealth(
    currentBalanceNaira,
    recommendedNairaTarget,
    monthsAvailable,
  );

  // Step 6 — 12-month calendar breakdown
  const monthlyBreakdown = generateMonthlyBreakdown(
    intakeDate,
    safeStartDate,
    cautionStartDate,
    riskyStartDate,
    rule,
    intakeMonths,
  );

  return {
    safeStartDate,
    cautionStartDate,
    riskyStartDate,
    currentStatus,
    monthlyBreakdown,
    targetAmountForeign: rule.minAmountForeign,
    targetAmountNairaOfficial: officialNairaTarget,
    targetAmountNairaParallel: parallelNairaTarget,
    recommendedNairaTarget,
    safeMonthlyDeposit,
    lumpSumRisk,
  };
}

// ─────────────────────────────────────────
// TEMPLATE VARIABLE REPLACER
// ─────────────────────────────────────────

// Replaces {{variables}} in analysisText and nigeriaSpecific
// from the PofRule with real calculated values
export function interpolateAnalysisText(
  template: string,
  values: {
    parallelRate: number;
    cbnRate: number;
    safeDate: string;
    cautionDate: string;
    nairaTarget: string;
    monthlyDeposit: string;
    currencyCode: string;
    minAmountForeign: number;
  },
): string {
  return template
    .replace(/{{parallelRate}}/g, values.parallelRate.toLocaleString("en-NG"))
    .replace(/{{cbnRate}}/g, values.cbnRate.toLocaleString("en-NG"))
    .replace(/{{safeDate}}/g, values.safeDate)
    .replace(/{{cautionDate}}/g, values.cautionDate)
    .replace(/{{nairaTarget}}/g, values.nairaTarget)
    .replace(/{{monthlyDeposit}}/g, values.monthlyDeposit)
    .replace(/{{currencyCode}}/g, values.currencyCode)
    .replace(/{{minAmountForeign}}/g, values.minAmountForeign.toLocaleString());
}
