import { Clock, CalendarClock, Wrench, CircleCheck, Archive } from "lucide-react";

const STATUS_CONFIG = {
  PENDING: {
    label: "Pending",
    icon: Clock,
    className: "text-amber-600 bg-amber-50 border-amber-200",
  },
  SCHEDULED: {
    label: "Scheduled",
    icon: CalendarClock,
    className: "text-blue-600 bg-blue-50 border-blue-200",
  },
  IN_PROGRESS: {
    label: "In Progress",
    icon: Wrench,
    className: "text-violet-600 bg-violet-50 border-violet-200",
  },
  RESOLVED: {
    label: "Resolved",
    icon: CircleCheck,
    className: "text-green-600 bg-green-50 border-green-200",
  },
  CLOSED: {
    label: "Closed",
    icon: Archive,
    className: "text-slate-500 bg-slate-100 border-slate-200",
  },
};

export default function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status];

  if (!config) {
    return <span className="text-sm text-muted-foreground">{status ?? "—"}</span>;
  }

  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium ${config.className}`}
    >
      <Icon className="w-3.5 h-3.5" />
      {config.label}
    </span>
  );
}
