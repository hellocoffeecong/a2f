import type { ReactNode } from "react";
import SiteFooter from "@/components/public/layout/SiteFooter";
import SiteHeader from "@/components/public/layout/SiteHeader";

// Public site chrome. The page bodies are still the legacy pages until each is rebuilt.
export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <SiteHeader />
      {children}
      <SiteFooter />
    </>
  );
}
