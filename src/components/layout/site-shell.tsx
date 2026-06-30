import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { CtaBanner } from "@/components/ui/cta-banner";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { BookCallRoot } from "@/components/book-call/book-call-root";

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <BookCallRoot>
      <div className="min-w-0 max-w-full overflow-x-clip">
        <ScrollProgress />
        <Navbar />
        <main>{children}</main>
        <CtaBanner />
        <Footer />
      </div>
    </BookCallRoot>
  );
}
