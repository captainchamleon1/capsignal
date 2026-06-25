import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { CtaBanner } from "@/components/ui/cta-banner";
import { ScrollProgress } from "@/components/ui/scroll-progress";

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ScrollProgress />
      <Navbar />
      <main>{children}</main>
      <CtaBanner />
      <Footer />
    </>
  );
}
