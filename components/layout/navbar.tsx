import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8">
        <Link
          href="/"
          className="flex items-center gap-1 text-3xl font-extrabold tracking-tighter"
        >
          <span className="text-foreground">Sma</span>
          <span className="text-primary">rrr</span>
          <span className="text-foreground">t</span>
        </Link>

        <div className="hidden gap-6 text-sm font-medium text-gray-600 md:flex">
          <Link href="#features" className="transition-colors hover:text-foreground">
            Features
          </Link>
          <Link
            href="#reality-check"
            className="transition-colors hover:text-foreground"
          >
            The Reality
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" className="hidden font-semibold sm:inline-flex">
            Log In
          </Button>

          <Link href="/calculator">
            <Button className="font-bold shadow-md transition-all hover:shadow-lg">
              Start Planning
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}