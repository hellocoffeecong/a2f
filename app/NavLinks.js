"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

function isActivePath(pathname, href) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <nav className="main-nav">
      <Link href="/" className="brand">
        <span className="logo">A2F</span> Design Lab
      </Link>
      <Link
        href="/news"
        className={isActivePath(pathname, "/news") ? "is-active" : ""}
      >
        News
      </Link>
      <Link
        href="/education"
        className={isActivePath(pathname, "/education") ? "is-active" : ""}
      >
        Education
      </Link>
      <Link
        href="/publication"
        className={isActivePath(pathname, "/publication") ? "is-active" : ""}
      >
        Publication
      </Link>
      <Link
        href="/project"
        className={isActivePath(pathname, "/project") ? "is-active" : ""}
      >
        Project
      </Link>
    </nav>
  );
}
