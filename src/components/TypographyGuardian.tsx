"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function TypographyGuardian({ 
  enabled = true, 
  protectHome = true,
  protectCatalog = true,
  protectProjects = true,
  protectContact = true,
  blockCtrlA = true
}: { 
  enabled?: boolean, 
  protectHome?: boolean,
  protectCatalog?: boolean,
  protectProjects?: boolean,
  protectContact?: boolean,
  blockCtrlA?: boolean
}) {
  const pathname = usePathname();

  useEffect(() => {
    // Detect current route (strip locale prefix)
    const path = pathname.replace(/^\/[^\/]+/, '') || '/'; 
    let shouldEnforce = false;

    if (enabled) {
      if (path === '/' || path === '') {
        shouldEnforce = protectHome;
      } else if (path.startsWith('/catalog')) {
        shouldEnforce = protectCatalog;
      } else if (path.startsWith('/projects')) {
        shouldEnforce = protectProjects;
      } else if (path.startsWith('/contact')) {
        shouldEnforce = protectContact;
      } else if (path.startsWith('/architects')) {
        shouldEnforce = false;
      } else if (path.startsWith('/admin')) {
        shouldEnforce = false; // Never lock down the admin dashboard
      } else {
        shouldEnforce = true; // Fallback
      }
    }

    if (shouldEnforce) {
      document.body.classList.add("disable-heading-selection");
    } else {
      document.body.classList.remove("disable-heading-selection");
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (shouldEnforce && blockCtrlA) {
        // Prevent Select All (Ctrl+A or Cmd+A)
        if ((e.ctrlKey || e.metaKey) && (e.key === 'a' || e.key === 'A')) {
          e.preventDefault();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.classList.remove("disable-heading-selection");
    };
  }, [enabled, protectHome, protectCatalog, protectProjects, protectContact, blockCtrlA, pathname]);

  return null; // This component is invisible
}
