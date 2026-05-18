import { NextRequest, NextResponse } from "next/server"
import { upsertFxRate } from "@/lib/fx"

// ─────────────────────────────────────────
// CURRENCY CONFIG
// ─────────────────────────────────────────

const CURRENCIES = ["GBP", "USD", "CAD", "EUR", "AUD", "SEK"]

// ─────────────────────────────────────────
// MOCK FETCHER
// Replace these with real API calls when
// you get AbokiFX or equivalent API access
// ─────────────────────────────────────────

async function fetchParallelRates(): Promise<Record<string, number>> {
  // TODO: Replace with real AbokiFX API call
  // const response = await axios.get(process.env.ABOKI_API_URL!, {
  //   headers: { Authorization: `Bearer ${process.env.ABOKI_API_KEY}` }
  // })
  // return response.data.rates

  // Placeholder rates — update when API is ready
  return {
    GBP: 2050,
    USD: 1650,
    CAD: 1220,
    EUR: 1790,
    AUD: 1075,
    SEK: 160,
  }
}

async function fetchCbnRates(): Promise<Record<string, number>> {
  // TODO: Replace with real CBN API call
  // const response = await axios.get(process.env.CBN_API_URL!)
  // return response.data.rates

  // Placeholder rates — update when API is ready
  return {
    GBP: 1980,
    USD: 1580,
    CAD: 1160,
    EUR: 1720,
    AUD: 1020,
    SEK: 152,
  }
}

// ─────────────────────────────────────────
// CRON HANDLER
// ─────────────────────────────────────────

export async function GET(request: NextRequest) {
  try {
    // ── Security check ──
    // Vercel sends this header on cron requests
    // Prevents anyone from manually triggering the sync
    const authHeader = request.headers.get("authorization")

    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    console.log("[cron/sync-fx] Starting FX rate sync...")

    // ── Fetch rates ──
    const [parallelRates, cbnRates] = await Promise.all([
      fetchParallelRates(),
      fetchCbnRates(),
    ])

    // ── Upsert each currency ──
    const results = await Promise.all(
      CURRENCIES.map(async (currency) => {
        const parallel = parallelRates[currency]
        const cbn = cbnRates[currency]

        if (!parallel || !cbn) {
          console.warn(`[cron/sync-fx] Missing rate for ${currency} — skipping`)
          return { currency, success: false }
        }

        await upsertFxRate(currency, cbn, parallel)
        console.log(`[cron/sync-fx] Updated ${currency}: CBN=${cbn} Parallel=${parallel}`)

        return { currency, success: true }
      })
    )

    const successCount = results.filter((r) => r.success).length

    console.log(
      `[cron/sync-fx] Sync complete. ${successCount}/${CURRENCIES.length} currencies updated.`
    )

    return NextResponse.json({
      success: true,
      data: {
        synced: successCount,
        total: CURRENCIES.length,
        results,
        timestamp: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error("[cron/sync-fx] Sync failed:", error)

    return NextResponse.json(
      {
        success: false,
        error: "FX sync failed. Check logs.",
      },
      { status: 500 }
    )
  }
}