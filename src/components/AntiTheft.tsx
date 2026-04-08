"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function AntiTheft({ 
  enabled = true, 
  blockRightClick = true, 
  blockF12 = true,
  protectHome = true,
  protectCatalog = true,
  protectProjects = true,
  protectContact = false
}: { 
  enabled?: boolean, 
  blockRightClick?: boolean, 
  blockF12?: boolean,
  protectHome?: boolean,
  protectCatalog?: boolean,
  protectProjects?: boolean,
  protectContact?: boolean
}) {
  const pathname = usePathname();

  useEffect(() => {
    if (!enabled) return;

    // Detect current route
    const path = pathname.replace(/^\/[^\/]+/, '') || '/'; 
    let shouldEnforce = false;

    if (path === '/' || path === '') {
      shouldEnforce = protectHome;
    } else if (path.startsWith('/catalog')) {
      shouldEnforce = protectCatalog;
    } else if (path.startsWith('/projects')) {
      shouldEnforce = protectProjects;
    } else if (path.startsWith('/contact')) {
      shouldEnforce = protectContact;
    } else if (path.startsWith('/architects')) {
      shouldEnforce = false; // Usually forms need to be open
    } else if (path.startsWith('/admin')) {
      shouldEnforce = false; // Never lock down the admin dashboard
    } else {
      shouldEnforce = true; // Fallback
    }

    if (!shouldEnforce) return;

    // Block Right Click Context Menu
    const handleContextMenu = (e: MouseEvent) => {
      if (blockRightClick) {
        e.preventDefault();
      }
    };

    // Block F12 and DevTools Hotkeys
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!blockF12) return;

      // F12
      if (e.key === 'F12') {
        e.preventDefault();
      }
      
      // Ctrl+Shift+I / Cmd+Option+I (DevTools)
      if ((e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i')) || 
          (e.metaKey && e.altKey && (e.key === 'I' || e.key === 'i'))) {
        e.preventDefault();
      }
      
      // Ctrl+Shift+C / Cmd+Option+C (Element Inspector)
      if ((e.ctrlKey && e.shiftKey && (e.key === 'C' || e.key === 'c')) || 
          (e.metaKey && e.altKey && (e.key === 'C' || e.key === 'c'))) {
        e.preventDefault();
      }
      
      // Ctrl+Shift+J / Cmd+Option+J (Console)
      if ((e.ctrlKey && e.shiftKey && (e.key === 'J' || e.key === 'j')) || 
          (e.metaKey && e.altKey && (e.key === 'J' || e.key === 'j'))) {
        e.preventDefault();
      }
      
      // Ctrl+U / Cmd+U (View Source)
      if ((e.ctrlKey && (e.key === 'U' || e.key === 'u')) || 
          (e.metaKey && (e.key === 'U' || e.key === 'u'))) {
        e.preventDefault();
      }
    };

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [enabled, blockRightClick, blockF12, protectHome, protectCatalog, protectProjects, protectContact, pathname]);

  return null; // This component is invisible
}
