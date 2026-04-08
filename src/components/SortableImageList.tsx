"use client";

import React from 'react';
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
  rectSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, X } from 'lucide-react';

interface SortableItemProps {
  id: string;
  url: string;
  onRemove: (id: string) => void;
}

function SortableItem({ id, url, onRemove }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className={`relative group bg-muted border border-border rounded-md overflow-hidden aspect-square flex-shrink-0 ${isDragging ? 'opacity-50 ring-2 ring-foreground scale-105 shadow-xl' : ''}`}
    >
      <img src={url} alt="Sortable Thumbnail" className="w-full h-full object-cover pointer-events-none" />
      
      {/* Drag Handle */}
      <div 
        {...attributes} 
        {...listeners}
        className="absolute top-2 left-2 bg-background/90 hover:bg-background p-1.5 rounded-sm cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
      >
        <GripVertical className="w-4 h-4 text-foreground" />
      </div>

      {/* Remove Button */}
      <button 
        type="button" 
        onClick={(e) => {
          e.stopPropagation();
          onRemove(id);
        }}
        className="absolute top-2 right-2 bg-red-500/90 hover:bg-red-500 text-white p-1.5 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

interface SortableImageListProps {
  images: string[];
  onChange: (images: string[]) => void;
}

export default function SortableImageList({ images, onChange }: SortableImageListProps) {
  // Map URLs to objects with stable unique IDs avoiding clash on duplicates
  const items = images.map((url, index) => ({ id: `${url}-___-${index}`, url }));

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // minimum distance before a drag starts, prevents firing on simple click
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex(item => item.id === active.id);
      const newIndex = items.findIndex(item => item.id === over.id);
      
      const newArray = arrayMove(images, oldIndex, newIndex);
      onChange(newArray);
    }
  };

  const handleRemove = (idToRemove: string) => {
    const targetIndex = items.findIndex(item => item.id === idToRemove);
    if (targetIndex !== -1) {
      const newArray = [...images];
      newArray.splice(targetIndex, 1);
      onChange(newArray);
    }
  };

  return (
    <DndContext 
      id="images-dnd-context"
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 w-full">
        <SortableContext 
          items={items.map(i => i.id)}
          strategy={rectSortingStrategy}
        >
          {items.map(item => (
            <SortableItem key={item.id} id={item.id} url={item.url} onRemove={handleRemove} />
          ))}
        </SortableContext>
        
        {images.length === 0 && (
          <div className="col-span-full py-12 text-center text-sm tracking-widest text-muted-foreground bg-muted/30 border border-dashed border-border rounded-lg">
            No images uploaded yet. Upload images below to construct your gallery.
          </div>
        )}
      </div>
    </DndContext>
  );
}
