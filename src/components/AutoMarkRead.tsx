"use client";

import { useEffect, useRef } from "react";

export default function AutoMarkRead() {
  const marked = useRef(false);

  useEffect(() => {
    if (!marked.current) {
      marked.current = true;
      fetch('/api/leads/mark-all', { method: 'POST' }).catch(() => {});
    }
  }, []);

  return null;
}
