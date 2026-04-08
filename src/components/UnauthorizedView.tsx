import { AlertTriangle } from "lucide-react";

export default function UnauthorizedView({ moduleName }: { moduleName: string }) {
  return (
    <div className="flex-1 p-16 h-full flex flex-col items-center justify-center text-center">
      <AlertTriangle className="w-16 h-16 text-red-500 mb-6 opacity-80" />
      <h1 className="text-4xl font-bold tracking-widest uppercase text-red-500 mb-4">Clearance Denied</h1>
      <p className="text-muted-foreground uppercase tracking-widest text-sm max-w-md mb-8">
        Your current security profile does not grant access to the <span className="text-foreground font-bold">{moduleName}</span> module.
      </p>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground border border-border/30 px-4 py-2 bg-muted/10">
        Contact Superadmin to request elevated permissions
      </div>
    </div>
  );
}
