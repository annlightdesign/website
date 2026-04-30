import { prisma } from '@/lib/prisma';
import ProjectForm from '@/components/ProjectForm';
import SortableProjectsList from '@/components/SortableProjectsList';
import { ArrowLeft } from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminProjectsPage() {
  const allProjects = await prisma.project.findMany({ orderBy: [{ order: 'asc' }, { createdAt: 'asc' }] });

  return (
    <div className="p-10 max-w-5xl mx-auto space-y-10 pb-40">
      
      <div className="mb-10 flex items-center justify-between border-b border-border/40 pb-6">
        <h1 className="text-3xl font-medium tracking-widest uppercase font-sans">Manage Projects</h1>
        <ProjectForm />
      </div>

      <SortableProjectsList initialProjects={allProjects as any} />

    </div>
  );
}
