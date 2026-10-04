import type { ReactNode } from "react";
import NavLinks from "./NavLinks";

// Public site chrome (legacy nav/footer, unchanged). Replaced in the Figma UI phases.
export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <NavLinks />
      {children}
      <footer>
        <h5><span>A2F</span> Design Lab</h5>
        <h6>ryou@inje.ac.kr | 055-320-3412 | (50834) 경남 김해시 인제로 197 신어관 C동 522호</h6>
        <h6>Copyright 2026 A2F Design Lab. All rights reserved.</h6>
      </footer>
    </>
  );
}
