import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ShieldAlert,
  LineChart,
  CalendarClock,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Navbar />

      <main>
        {/* HERO SECTION */}
        <section className="container mx-auto px-4 py-24 md:py-32 text-center max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
            Stop Guessing Your <br className="hidden md:block" />
            <span className="bg-primary text-primary-foreground px-4 leading-relaxed">
              Proof of Funds.
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Don&apos;t let FX volatility or embassy &quot;lump-sum flags ruin
            your visa chances. Map your exact Naira target, track parallel
            market rates, and build a bulletproof bank statement.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/calculator">
              <Button
                size="lg"
                className="w-full sm:w-auto font-bold text-lg h-14 px-8"
              >
                Calculate My POF Timeline{" "}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto font-bold text-lg h-14 px-8 border-2 border-gray-200"
            >
              View Supported Countries
            </Button>
          </div>
          <p className="mt-6 text-sm font-medium text-gray-500 flex items-center justify-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            Updated for UKVI, IRCC, US DOS & DHA 2026 Guidelines
          </p>
        </section>

        {/* REALITY CHECK SECTION (The Black Cards) */}
        <section
          id="reality-check"
          className="bg-gray-50 py-20 border-y border-gray-100"
        >
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Built for the Nigerian Reality
              </h2>
              <p className="text-lg text-gray-600">
                Official embassy websites don&apos;t tell you about Form A
                delays or parallel market rates. We do.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* UK Card */}
              <Card className="bg-foreground text-background border-none shadow-xl">
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-4xl">🇬🇧</span>
                    <h3 className="text-2xl font-bold">The UK Myth</h3>
                  </div>
                  <div className="space-y-4">
                    <p className="text-gray-400 font-medium">
                      ❌ &quot;UKVI only needs the money to sit for 28
                      days.&quot;
                    </p>
                    <div className="h-px w-full bg-gray-800"></div>
                    <p className="font-semibold text-lg leading-relaxed">
                      <span className="text-primary mr-2">Reality:</span>
                      If you rely on CBN rates, bank delays for Form A can take
                      3 months. You actually need a 90-day preparation buffer to
                      be safe.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Canada Card */}
              <Card className="bg-foreground text-background border-none shadow-xl">
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-4xl">🇨🇦</span>
                    <h3 className="text-2xl font-bold">The Canada Trap</h3>
                  </div>
                  <div className="space-y-4">
                    <p className="text-gray-400 font-medium">
                      ❌ &quot;I&apos;ll just borrow the money a week before
                      applying.
                    </p>
                    <div className="h-px w-full bg-gray-800"></div>
                    <p className="font-semibold text-lg leading-relaxed">
                      <span className="text-primary mr-2">Reality:</span>
                      IRCC heavily targets Nigerian applications for
                      &quot;financial manipulation.&quot; You need a 6-month
                      organic deposit strategy to avoid rejection.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section
          id="features"
          className="py-24 container mx-auto px-4 max-w-6xl"
        >
          <div className="grid md:grid-cols-3 gap-12 text-center md:text-left">
            <div className="flex flex-col items-center md:items-start">
              <div className="h-14 w-14 rounded-2xl bg-primary/20 text-primary flex items-center justify-center mb-6">
                <CalendarClock className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Dynamic Timelines</h3>
              <p className="text-gray-600 leading-relaxed">
                Select your intake date and we reverse-engineer your exact
                &quot;Safe&quot;, &quot;Caution&quot;, and &quot;Risky months to
                start saving&quot;.
              </p>
            </div>

            <div className="flex flex-col items-center md:items-start">
              <div className="h-14 w-14 rounded-2xl bg-primary/20 text-primary flex items-center justify-center mb-6">
                <LineChart className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">
                Parallel Market Tracking
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Stop calculating with official rates you can&apos;t access. We
                track the real parallel market so you know exactly how much
                Naira you need today.
              </p>
            </div>

            <div className="flex flex-col items-center md:items-start">
              <div className="h-14 w-14 rounded-2xl bg-primary/20 text-primary flex items-center justify-center mb-6">
                <ShieldAlert className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">
                Statement Health Analyzer
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Input your current balance, and we&apos;ll calculate your safe
                monthly deposit limit to avoid embassy lump-sum rejection flags.
              </p>
            </div>
          </div>
        </section>

        {/* BOTTOM CTA */}
        <section className="bg-foreground py-20 text-center">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-5xl font-bold text-background mb-8">
              Your visa is too important <br /> to leave to guesswork.
            </h2>
            <Link href="/calculator">
              <Button
                size="lg"
                className="font-bold text-lg h-14 px-10 shadow-[0_0_40px_-10px_rgba(255,204,0,0.5)]"
              >
                Build Your Financial Strategy
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
