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
import { Project } from '@prisma/client';
import ProjectForm from '@/components/ProjectForm';
import AdminListActions from '@/components/AdminListActions';
import { useRouter } from 'next/navigation';

interface SortableProjectItemProps {
  project: Project;
}

function SortableProjectItem({ project }: SortableProjectItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: project.id.toString() });

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
          className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground transition-colors p-1"
          title="Drag to reorder"
        >
          <GripVertical size={20} />
        </div>
        <span className="font-light tracking-wide">{project.title}</span>
      </div>
      <div className="flex items-center gap-6">
        <ProjectForm existingProject={project as any} />
        <AdminListActions type="project" id={project.id} />
      </div>
    </div>
  );
}

interface SortableProjectsListProps {
  initialProjects: Project[];
}

export default function SortableProjectsList({ initialProjects }: SortableProjectsListProps) {
  const [projects, setProjects] = useState(initialProjects);
  const router = useRouter();

  useEffect(() => {
    setProjects(initialProjects);
  }, [initialProjects]);

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
      const oldIndex = projects.findIndex(p => p.id.toString() === active.id);
      const newIndex = projects.findIndex(p => p.id.toString() === over.id);
      
      const newArray = arrayMove(projects, oldIndex, newIndex);
      setProjects(newArray);

      try {
        const res = await fetch('/api/projects/reorder', {
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
      id="projects-dnd-context"
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 gap-3">
        <SortableContext 
          items={projects.map(p => p.id.toString())}
          strategy={verticalListSortingStrategy}
        >
          {projects.map(p => (
            <SortableProjectItem key={p.id} project={p} />
          ))}
        </SortableContext>
        {projects.length === 0 && (
          <div className="text-center p-10 text-muted-foreground uppercase tracking-widest text-sm border border-border/40 border-dashed">
            No projects found.
          </div>
        )}
      </div>
    </DndContext>
  );
}
