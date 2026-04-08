'use client';

import React, { useState, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import { Product } from '@prisma/client';
import ProductForm from '@/components/ProductForm';
import AdminListActions from '@/components/AdminListActions';
import { useRouter } from 'next/navigation';

interface SortableProductItemProps {
  product: Product;
}

function SortableProductItem({ product }: SortableProductItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: product.id.toString() });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className={`flex justify-between items-center p-5 border border-border/40 transition-colors ${
        isDragging ? 'bg-muted/30 shadow-xl opacity-90 ring-1 ring-foreground relative' : 'bg-muted/10 hover:bg-muted/20'
      }`}
    >
      <div className="flex items-center gap-4">
        <div 
          {...attributes} 
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground transition-colors p-1 flex-shrink-0"
          title="Drag to reorder"
        >
          <GripVertical size={20} />
        </div>
        <div className="flex flex-col">
          <span className="font-light tracking-wide">{product.title}</span>
          {product.titleHe && (
            <span className="text-xs text-muted-foreground mt-0.5" dir="auto">{product.titleHe}</span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-6">
        <ProductForm existingProduct={product as any} />
        <AdminListActions type="product" id={product.id} categoryId={product.categoryId} />
      </div>
    </div>
  );
}

interface SortableProductsListProps {
  initialProducts: Product[];
}

export default function SortableProductsList({ initialProducts }: SortableProductsListProps) {
  const [products, setProducts] = useState(initialProducts);
  const router = useRouter();

  useEffect(() => {
    setProducts(initialProducts);
  }, [initialProducts]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = products.findIndex(p => p.id.toString() === active.id);
      const newIndex = products.findIndex(p => p.id.toString() === over.id);
      
      const newArray = arrayMove(products, oldIndex, newIndex);
      setProducts(newArray);

      try {
        const res = await fetch('/api/products/reorder', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderedIds: newArray.map(p => p.id) })
        });
        if (!res.ok) {
          const text = await res.text();
          alert('Failed to save sort order: ' + text);
        } else {
          router.refresh(); // Fetch new server snapshot quietly into cache
        }
      } catch (e) {
        alert('An error occurred while saving reordering.');
      }
    }
  };

  return (
    <DndContext 
      id="products-dnd-context"
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 gap-3">
        <SortableContext 
          items={products.map(p => p.id.toString())}
          strategy={verticalListSortingStrategy}
        >
          {products.map(p => (
            <SortableProductItem key={p.id} product={p} />
          ))}
        </SortableContext>
        {products.length === 0 && (
          <div className="text-center p-10 text-muted-foreground uppercase tracking-widest text-sm border border-border/40 border-dashed">
            No products found.
          </div>
        )}
      </div>
    </DndContext>
  );
}
