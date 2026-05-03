import { GitBranch } from "lucide-react";

export default function FollowupBadge() {
  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground bg-secondary/50 rounded px-1.5 py-0.5 ml-1">
      <GitBranch className="w-3 h-3" />
      Follow-up
    </span>
  );
}
