'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import ConfirmModal from '@/components/ConfirmModal';
import CopyProductModal from '@/components/CopyProductModal';

export default function AdminListActions({ type, id, categoryId }: { type: 'project' | 'product' | 'lead', id: number, categoryId?: number }) {
  const [loading, setLoading] = useState(false);
  const [showCopyConfirm, setShowCopyConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  async function handleCopy(targetCategoryId?: number) {
    setLoading(true);
    setShowCopyConfirm(false);
    try {
      const res = await fetch(`/api/${type}s/${id}/copy`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: targetCategoryId ? JSON.stringify({ targetCategoryId }) : undefined
      });
      if (res.ok) {
        const data = await res.json();
        if (type === 'product' && data.product?.id) {
          const params = new URLSearchParams(window.location.search);
          params.set('edit', data.product.id.toString());
          if (targetCategoryId) params.set('categoryId', targetCategoryId.toString());
          router.push(`${pathname}?${params.toString()}`, { scroll: false });
        } else {
          router.refresh();
        }
      } else {
        const errText = await res.text();
        alert(`Failed to copy: ${errText}`);
      }
    } catch (e) {
      alert("An error occurred while copying.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    setLoading(true);
    setShowDeleteConfirm(false);
    try {
      const res = await fetch(`/api/${type}s/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        router.refresh();
      } else {
        const errText = await res.text();
        alert(`Failed to delete: ${errText}`);
      }
    } catch (e) {
      alert("An error occurred while deleting.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {type === 'product' && (
        <>
          <button 
            onClick={() => setShowCopyConfirm(true)} 
            disabled={loading}
            className="text-xs text-blue-500 uppercase tracking-widest hover:text-blue-700 transition-colors disabled:opacity-50"
          >
            Copy
          </button>
          {showCopyConfirm && (
             <CopyProductModal 
               isOpen={showCopyConfirm}
               onClose={() => setShowCopyConfirm(false)}
               onConfirm={handleCopy}
               title="Duplicate Product"
               originalCategoryId={categoryId || 0}
             />
          )}
        </>
      )}
      
      <button 
        onClick={() => setShowDeleteConfirm(true)} 
        disabled={loading}
        className="text-xs text-red-500 uppercase tracking-widest hover:text-red-700 transition-colors disabled:opacity-50"
      >
        Delete
      </button>

      {showDeleteConfirm && (
         <ConfirmModal 
           isOpen={showDeleteConfirm}
           onClose={() => setShowDeleteConfirm(false)}
           onConfirm={handleDelete}
           title={`Are you sure you want to delete this ${type}?`}
           message="This action cannot be undone."
           confirmText="YES, DELETE"
           cancelText="NO"
           confirmStyle="danger"
         />
      )}
    </>
  );
}
