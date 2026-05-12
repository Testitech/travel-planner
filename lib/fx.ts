import { prisma } from "@/lib/prisma";
import type { FxRate } from "@/types";

// ─────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────

// Fallback rates if DB fetch fails or cron hasn't run yet
// Update these periodically as a safety net
const FALLBACK_RATES: Record<
  string,
  { cbnRate: number; parallelRate: number }
> = {
  GBP: { cbnRate: 1980, parallelRate: 2050 },
  USD: { cbnRate: 1580, parallelRate: 1650 },
  CAD: { cbnRate: 1160, parallelRate: 1220 },
  EUR: { cbnRate: 1720, parallelRate: 1790 },
  AUD: { cbnRate: 1020, parallelRate: 1075 },
  SEK: { cbnRate: 152, parallelRate: 160 },
};

// ─────────────────────────────────────────
// FETCH RATE FROM DATABASE
// ─────────────────────────────────────────

export async function getFxRate(currencyCode: string): Promise<FxRate> {
  try {
    const rate = await prisma.fxRate.findUnique({
      where: { currencyCode },
    });

    if (rate) return rate;

    // No rate in DB yet — use fallback and log warning
    console.warn(
      `[fx] No rate found for ${currencyCode} in DB. Using fallback.`,
    );
    return buildFallbackRate(currencyCode);
  } catch (error) {
    console.error(`[fx] DB fetch failed for ${currencyCode}:`, error);
    return buildFallbackRate(currencyCode);
  }
}

// ─────────────────────────────────────────
// FETCH ALL RATES
// ─────────────────────────────────────────

export async function getAllFxRates(): Promise<FxRate[]> {
  try {
    const rates = await prisma.fxRate.findMany();

    if (rates.length > 0) return rates;

    // DB empty — return all fallbacks
    console.warn("[fx] No rates in DB. Using all fallbacks.");
    return Object.keys(FALLBACK_RATES).map(buildFallbackRate);
  } catch (error) {
    console.error("[fx] Failed to fetch all rates:", error);
    return Object.keys(FALLBACK_RATES).map(buildFallbackRate);
  }
}

// ─────────────────────────────────────────
// UPSERT RATE (used by cron job)
// ─────────────────────────────────────────

export async function upsertFxRate(
  currencyCode: string,
  cbnRate: number,
  parallelRate: number,
): Promise<FxRate> {
  return prisma.fxRate.upsert({
    where: { currencyCode },
    update: {
      cbnRate,
      parallelRate,
    },
    create: {
      currencyCode,
      cbnRate,
      parallelRate,
    },
  });
}

// ─────────────────────────────────────────
// FORMATTING UTILITIES
// ─────────────────────────────────────────

export function formatNaira(amount: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatForeign(amount: number, currencyCode: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatRate(rate: number): string {
  return new Intl.NumberFormat("en-NG").format(rate);
}

// ─────────────────────────────────────────
// RATE AGE CHECKER
// ─────────────────────────────────────────

// Returns true if rate was updated within the last 3 hours
export function isRateFresh(lastUpdated: Date): boolean {
  const threeHoursAgo = new Date(Date.now() - 3 * 60 * 60 * 1000);
  return lastUpdated > threeHoursAgo;
}

export function getRateAge(lastUpdated: Date): string {
  const diffMs = Date.now() - lastUpdated.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 60) return `${diffMins} minutes ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} hours ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} days ago`;
}

// ─────────────────────────────────────────
// PRIVATE HELPERS
// ─────────────────────────────────────────

function buildFallbackRate(currencyCode: string): FxRate {
  const fallback = FALLBACK_RATES[currencyCode] ?? {
    cbnRate: 1500,
    parallelRate: 1600,
  };

  return {
    currencyCode,
    cbnRate: fallback.cbnRate,
    parallelRate: fallback.parallelRate,
    lastUpdated: new Date(),
  };
}
