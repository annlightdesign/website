import SecurityForm from '@/components/SecurityForm';
import { requirePermission } from '@/lib/auth';
import UnauthorizedView from '@/components/UnauthorizedView';

export default async function AdminSecurityPage() {
  if (!(await requirePermission('security'))) return <UnauthorizedView moduleName="Security Protocol" />;

  return (
    <div className="p-10 max-w-5xl mx-auto space-y-10 pb-40">
      
      <div className="mb-10 flex items-center justify-between border-b border-border/40 pb-6">
        <h1 className="text-3xl font-medium tracking-widest uppercase font-sans text-red-500">Security Core</h1>
      </div>

      <div className="bg-muted/5 p-10 border border-border/40">
         <SecurityForm />
      </div>

    </div>
  );
}
