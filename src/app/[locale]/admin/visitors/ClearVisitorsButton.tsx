"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import ConfirmModal from "@/components/ConfirmModal";

export default function ClearVisitorsButton() {
  const [isClearing, setIsClearing] = useState(false);
  const router = useRouter();

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const executeClear = async () => {
    setIsConfirmOpen(false);
    setIsClearing(true);
    try {
      const res = await fetch("/api/admin/visitors/clear", { method: "POST" });
      if (res.ok) {
        router.refresh();
      } else {
        alert("Failed to clear visitors");
      }
    } catch (e) {
      console.error(e);
      alert("Error clearing visitors");
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsConfirmOpen(true)}
        disabled={isClearing}
        className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-sm transition-colors text-sm font-medium disabled:opacity-50"
      >
        <Trash2 className="w-4 h-4" />
        {isClearing ? 'Clearing...' : 'Clear All Visitors'}
      </button>

      <ConfirmModal 
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={executeClear}
        title="Clear Visitors?"
        message="Are you sure you want to delete ALL visitor logs? This action cannot be undone and tracking history will be blank."
        confirmText="Clear History"
        confirmStyle="danger"
      />
    </>
  );
}
