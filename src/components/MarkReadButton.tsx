"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function MarkReadButton({ id }: { id: number }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function setUnread() {
    setLoading(true);
    try {
      const res = await fetch(`/api/leads/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isRead: false })
      });
      if (res.ok) {
        router.refresh();
      } else {
        alert("Failed to mark unread");
      }
    } catch (e) {
      alert("An error occurred");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button 
      onClick={setUnread} 
      disabled={loading}
      className="text-xs text-muted-foreground uppercase tracking-widest hover:text-foreground transition-colors disabled:opacity-50"
    >
      Mark Unread
    </button>
  );
}
