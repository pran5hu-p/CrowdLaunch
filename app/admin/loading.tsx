import { Loader2Icon } from "lucide-react";

export default function AdminLoading() {
  return (
    <div className="flex h-[70vh] w-full items-center justify-center">
      <div className="flex flex-col items-center gap-4 text-muted-foreground">
        <Loader2Icon className="size-10 animate-spin text-primary" />
        <p className="text-lg font-medium">Loading admin dashboard...</p>
      </div>
    </div>
  );
}