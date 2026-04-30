"use client";

import React, { useState, useEffect, useTransition } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  closestCorners,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import AdminCategoryAccordion from './AdminCategoryAccordion';
import { GripVertical } from 'lucide-react';
import ProductForm from './ProductForm';
import AdminListActions from './AdminListActions';
import { Product } from '@prisma/client';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

// ----- Product Item Component -----
function SortableProductItem({ product, categoryId }: { product: Product, categoryId?: number | null }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ 
    id: `product-${product.id}`,
    data: { type: 'Product', product, categoryId }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 1,
    opacity: isDragging ? 0.8 : 1,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className={`flex justify-between items-center p-5 border border-border/40 transition-colors ${
        isDragging ? 'bg-muted/50 shadow-2xl ring-2 ring-primary relative z-50' : 'bg-muted/10 hover:bg-muted/20'
      }`}
    >
      <div className="flex items-center gap-4">
        <div 
          {...attributes} 
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground transition-colors p-1 flex-shrink-0"
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
        <AdminListActions type="product" id={product.id} categoryId={categoryId || undefined} />
      </div>
    </div>
  );
}

// ----- Category/Collection List Wrapper -----
function CategoryContainer({ 
  categoryId, 
  title, 
  products, 
  category 
}: { 
  categoryId: string; 
  title: string; 
  products: Product[]; 
  category?: any;
}) {
  const { setNodeRef } = useSortable({
    id: categoryId,
    data: { type: 'Category', categoryId }
  });

  const productIds = products.map(p => `product-${p.id}`);

  return (
    <div ref={setNodeRef} className="w-full">
      <AdminCategoryAccordion 
        category={category}
        title={title}
        count={products.length}
        products={products}
        defaultOpen={products.length > 0}
        dragAttributes={undefined} 
        dragListeners={undefined}
        isDragging={false}
      >
        <div className="grid grid-cols-1 gap-3 min-h-[50px]">
          <SortableContext items={productIds} strategy={verticalListSortingStrategy}>
            {products.map(p => (
              <SortableProductItem key={p.id} product={p} categoryId={category?.id || null} />
            ))}
            {products.length === 0 && (
              <div className="text-center p-10 text-muted-foreground uppercase tracking-widest text-sm border border-border/40 border-dashed">
                Drop products here.
              </div>
            )}
          </SortableContext>
        </div>
      </AdminCategoryAccordion>
    </div>
  );
}

// ----- Main DnD Manager -----
export default function CatalogDndManager({ initialCategories }: { initialCategories: any[] }) {
  const [categoriesState, _setCategories] = useState(initialCategories);
  const categoriesRef = React.useRef(initialCategories);

  const setCategories = (updateFn: any) => {
    _setCategories((prev: any) => {
      const next = typeof updateFn === 'function' ? updateFn(prev) : updateFn;
      categoriesRef.current = next;
      return next;
    });
  };

  const categories = categoriesState;

  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const lastDragTime = React.useRef(0);
  const fetchQueue = React.useRef<Promise<void>>(Promise.resolve());

  useEffect(() => {
    // Only update from server props if we are not pending a transition
    // AND if the user hasn't dragged anything recently (within 4 seconds).
    // This strictly prevents rapid subsequent drops from snapping back to stale cached props.
    if (!isPending && Date.now() - lastDragTime.current > 4000) {
      setCategories(initialCategories);
    }
  }, [initialCategories, isPending]);

  const handleDragStart = () => {
    lastDragTime.current = Date.now();
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const findContainer = (id: string) => {
    if (id.startsWith('category-') || id === 'uncategorized') return id;
    // Find which category has this product
    const prodIdNum = parseInt(id.replace('product-', ''), 10);
    for (const cat of categories) {
      if (cat.products.find((p: any) => p.id === prodIdNum)) {
        return cat.category ? `category-${cat.category.id}` : 'uncategorized';
      }
    }
    return null;
  };

  const handleDragOver = (event: DragOverEvent) => {
    lastDragTime.current = Date.now();
    const { active, over } = event;
    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    if (activeId.startsWith('category-')) return; // Ignore category drags over other categories

    setCategories((prev: any[]) => {
      // ALWAYS calculate containers dynamically inside the state setter using the absolute latest `prev` state!
      const findContainerInPrev = (id: string) => {
        if (id.startsWith('category-') || id === 'uncategorized') return id;
        const prodIdNum = parseInt(id.replace('product-', ''), 10);
        for (const cat of prev) {
          if (cat.products.find((p: any) => p.id === prodIdNum)) {
            return cat.category ? `category-${cat.category.id}` : 'uncategorized';
          }
        }
        return null;
      };

      const activeContainer = findContainerInPrev(activeId);
      let overContainer = overId;
      if (overId.startsWith('product-')) {
        overContainer = findContainerInPrev(overId) || 'uncategorized';
      }

      if (!activeContainer || !overContainer || activeContainer === overContainer) {
        return prev;
      }

      const activeItems = prev.find((c: any) => (c.category ? `category-${c.category.id}` : 'uncategorized') === activeContainer)?.products || [];
      const overItems = prev.find((c: any) => (c.category ? `category-${c.category.id}` : 'uncategorized') === overContainer)?.products || [];
      const activeIndex = activeItems.findIndex((p: any) => `product-${p.id}` === activeId);
      let overIndex = overItems.findIndex((p: any) => `product-${p.id}` === overId);

      if (activeIndex === -1) return prev; // GUARD: Prevent corrupting state!

      const itemToMove = activeItems[activeIndex];

      // Remove from active container
      const newActiveItems = [...activeItems];
      newActiveItems.splice(activeIndex, 1);

      // Add to over container
      const newOverItems = [...overItems];
      if (overIndex < 0) {
        overIndex = newOverItems.length;
      }
      newOverItems.splice(overIndex, 0, itemToMove);

      return prev.map(c => {
        const catId = c.category ? `category-${c.category.id}` : 'uncategorized';
        if (catId === activeContainer) return { ...c, products: newActiveItems };
        if (catId === overContainer) return { ...c, products: newOverItems };
        return c;
      });
    });
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    lastDragTime.current = Date.now();
    const { active, over } = event;
    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    if (activeId.startsWith('product-')) {
      // Use the synchronous ref to guarantee we never read a stale closure state
      const currentCats = categoriesRef.current;
      
      const findContainerSync = (id: string) => {
        if (id.startsWith('category-') || id === 'uncategorized') return id;
        const prodIdNum = parseInt(id.replace('product-', ''), 10);
        for (const cat of currentCats) {
          if (cat.products.find((p: any) => p.id === prodIdNum)) {
            return cat.category ? `category-${cat.category.id}` : 'uncategorized';
          }
        }
        return null;
      };

      let activeContainer = overId;
      if (overId.startsWith('product-')) {
        activeContainer = findContainerSync(overId) || 'uncategorized';
      }

      if (!activeContainer) return;

      const containerIndex = currentCats.findIndex((c: any) => (c.category ? `category-${c.category.id}` : 'uncategorized') === activeContainer);
      if (containerIndex < 0) return;

      const productsArray = currentCats[containerIndex].products;
      const oldIndex = productsArray.findIndex((p: any) => `product-${p.id}` === activeId);
      const newIndex = productsArray.findIndex((p: any) => `product-${p.id}` === overId);

      // Check if container changed (from start of drag to drop location)
      const originalContainer = active.data.current?.categoryId ? `category-${active.data.current.categoryId}` : 'uncategorized';
      const isCrossContainer = originalContainer !== activeContainer;

      // Only perform arrayMove and reorder if it's within the SAME container, OR if the state has fully resolved
      if (oldIndex !== -1 && oldIndex !== newIndex && newIndex !== -1) {
        const newArray = arrayMove(productsArray, oldIndex, newIndex);
        setCategories((prev: any[]) => {
          const newCats = [...prev];
          newCats[containerIndex] = { ...newCats[containerIndex], products: newArray };
          return newCats;
        });

        // Save reordering via queue
        fetchQueue.current = fetchQueue.current.then(async () => {
          try {
            await fetch('/api/products/reorder', {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ orderedIds: newArray.map((p: any) => p.id) })
            });
            startTransition(() => {
              router.refresh();
            });
          } catch (e) {
            toast.error("Failed to reorder products.");
          }
        });
      }

      if (isCrossContainer) {
        const oldCatId = originalContainer.replace('category-', '');
        const newCatId = activeContainer.replace('category-', '');
        
        fetchQueue.current = fetchQueue.current.then(async () => {
          try {
            await fetch('/api/products/move', {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                productId: parseInt(activeId.replace('product-', ''), 10),
                oldCategoryId: oldCatId === 'uncategorized' ? null : parseInt(oldCatId, 10),
                newCategoryId: newCatId === 'uncategorized' ? null : parseInt(newCatId, 10),
              })
            });
            toast.success("Product moved successfully!");
            startTransition(() => {
              router.refresh();
            });
          } catch (e) {
            toast.error("Failed to move product.");
          }
        });
      }
    }
  };

  const categoryIds = categories.map(c => c.category ? `category-${c.category.id}` : 'uncategorized');

  // Let's render nested hierarchy instead of flat list
  const rootCategories = categories.filter(c => !c.category?.parentId);

  return (
    <DndContext 
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex flex-col gap-6">
        {rootCategories.map(rootCat => {
          const id = rootCat.category ? `category-${rootCat.category.id}` : 'uncategorized';
          const children = categories.filter(c => c.category?.parentId === rootCat.category?.id);
          
          return (
            <div key={id} className="flex flex-col gap-2">
              <CategoryContainer 
                categoryId={id} 
                category={rootCat.category} 
                title={rootCat.category?.name || 'Uncategorized'} 
                products={rootCat.products} 
              />
              
              {children.length > 0 && (
                <div className="ml-8 md:ml-12 flex flex-col gap-2 border-l-2 border-border/50 pl-4">
                  {children.map(childCat => {
                    const childId = `category-${childCat.category.id}`;
                    return (
                      <CategoryContainer 
                        key={childId}
                        categoryId={childId} 
                        category={childCat.category} 
                        title={childCat.category.name} 
                        products={childCat.products} 
                      />
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </DndContext>
  );
}
