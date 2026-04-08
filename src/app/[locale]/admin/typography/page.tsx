import TypographyForm from '@/components/TypographyForm';
import { requirePermission } from '@/lib/auth';
import UnauthorizedView from '@/components/UnauthorizedView';

export default async function AdminTypographyPage() {
  if (!(await requirePermission('typography'))) return <UnauthorizedView moduleName="Typography Control" />;

  return (
    <div className="p-10 max-w-5xl mx-auto space-y-10 pb-40">
      
      <div className="mb-10 flex items-center justify-between border-b border-border/40 pb-6">
        <h1 className="text-3xl font-medium tracking-widest uppercase font-sans text-foreground">Typography Control</h1>
      </div>

      <div className="bg-muted/5 p-10 border border-border/40">
         <TypographyForm />
      </div>

    </div>
  );
}
