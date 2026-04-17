'use client';

import React, { useState, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  useSensors,
  DragEndEvent,
  closestCorners,
  PointerSensor,
  useSensor,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useRouter } from 'next/navigation';
import AdminCategoryAccordion from '@/components/AdminCategoryAccordion';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface SortableCategoryItemProps {
  categoryItem: any;
}

function SortableCategoryItem({ categoryItem }: SortableCategoryItemProps) {
  const isUncategorized = !categoryItem.category;
  const idValue = isUncategorized ? 'uncategorized' : `category-${categoryItem.category?.id}`;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: idValue, disabled: isUncategorized });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 1,
    position: isDragging ? 'relative' as const : 'static' as const,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <AdminCategoryAccordion 
        category={categoryItem.category}
        title={categoryItem.category ? categoryItem.category.name : "Uncategorized"} 
        count={categoryItem.products.length}
        products={categoryItem.products}
        defaultOpen={categoryItem.products.length > 0}
        dragAttributes={isUncategorized ? undefined : attributes}
        dragListeners={isUncategorized ? undefined : listeners}
        isDragging={isDragging}
      />
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface SortableCategoriesListProps {
  initialCategories: any[];
}

export default function SortableCategoriesList({ initialCategories }: SortableCategoriesListProps) {
  const [items, setItems] = useState(initialCategories);
  const router = useRouter();

  useEffect(() => {
    setItems(initialCategories);
  }, [initialCategories]);

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
      const oldIndex = items.findIndex(item => {
        const idVal = !item.category ? 'uncategorized' : `category-${item.category.id}`;
        return idVal === active.id;
      });
      const newIndex = items.findIndex(item => {
        const idVal = !item.category ? 'uncategorized' : `category-${item.category.id}`;
        return idVal === over.id;
      });
      
      if (oldIndex === -1 || newIndex === -1) return;

      const newArray = arrayMove(items, oldIndex, newIndex);
      setItems(newArray);

      // We only care about categories with IDs, ignoring "Uncategorized"
      const orderedIds = newArray.filter(i => !!i.category).map(i => i.category.id);

      try {
        const res = await fetch('/api/categories/reorder', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderedIds })
        });
        if (!res.ok) {
          const text = await res.text();
          alert('Failed to save category order: ' + text);
        } else {
          router.refresh();
        }
      } catch (e) {
        alert('An error occurred while saving reordering.');
      }
    }
  };

  const sortableItemIds = items.map(item => !item.category ? 'uncategorized' : `category-${item.category.id}`);

  return (
    <DndContext 
      id="categories-dnd-context"
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragEnd={handleDragEnd}
    >
      <div className="flex flex-col gap-4">
        <SortableContext 
          items={sortableItemIds}
          strategy={verticalListSortingStrategy}
        >
          {items.map((item, index) => {
            const key = !item.category ? 'uncategorized' : `category-${item.category.id}`;
            return (
              <SortableCategoryItem key={key} categoryItem={item} />
            );
          })}
        </SortableContext>
      </div>
    </DndContext>
  );
}
