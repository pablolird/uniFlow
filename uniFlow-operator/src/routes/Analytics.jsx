import { useRequestState } from "@/context/RequestContext";
import { useNavigate } from "react-router";
import PageHeader from "@/components/PageHeader";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { parse, format, startOfWeek } from "date-fns";
import {
  Clock,
  CalendarClock,
  Wrench,
  CircleCheck,
  Archive,
  GitFork,
} from "lucide-react";

const CHART_COLOR = "#3b6fa5";

const STATUS_CONFIG = [
  {
    status: "PENDING",
    label: "Pending",
    icon: Clock,
    iconClass: "text-amber-600",
    cardClass: "border-amber-200 bg-amber-50/60",
    countClass: "text-amber-700",
  },
  {
    status: "SCHEDULED",
    label: "Scheduled",
    icon: CalendarClock,
    iconClass: "text-blue-600",
    cardClass: "border-blue-200 bg-blue-50/60",
    countClass: "text-blue-700",
  },
  {
    status: "IN_PROGRESS",
    label: "In Progress",
    icon: Wrench,
    iconClass: "text-violet-600",
    cardClass: "border-violet-200 bg-violet-50/60",
    countClass: "text-violet-700",
  },
  {
    status: "RESOLVED",
    label: "Resolved",
    icon: CircleCheck,
    iconClass: "text-green-600",
    cardClass: "border-green-200 bg-green-50/60",
    countClass: "text-green-700",
  },
  {
    status: "CLOSED",
    label: "Closed",
    icon: Archive,
    iconClass: "text-slate-500",
    cardClass: "border-slate-200 bg-slate-50/60",
    countClass: "text-slate-600",
  },
];

function computeRequestsOverTime(requests) {
  const byWeek = {};
  for (const r of requests) {
    try {
      const d = parse(r.date, "MM/dd/yyyy", new Date());
      const weekStart = startOfWeek(d, { weekStartsOn: 1 });
      const key = format(weekStart, "MMM d");
      if (!byWeek[key]) byWeek[key] = { count: 0, sortKey: weekStart };
      byWeek[key].count++;
    } catch {
      // skip malformed dates
    }
  }
  return Object.entries(byWeek)
    .sort(([, a], [, b]) => a.sortKey - b.sortKey)
    .map(([week, { count }]) => ({ week, count }));
}

function computeTechnicianWorkload(requests) {
  const counts = {};
  for (const r of requests) {
    if (!r.technician) continue;
    counts[r.technician] = (counts[r.technician] || 0) + 1;
  }
  return Object.entries(counts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
}

function computeFollowUpStats(requests) {
  const total = requests.length;
  const followUps = requests.filter((r) => r.parent_id !== null).length;
  const rate = total > 0 ? (followUps / total) * 100 : 0;
  return { total, followUps, rate };
}

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-md border bg-background px-3 py-2 text-xs shadow-md">
      <p className="font-medium text-foreground">{label}</p>
      <p className="text-muted-foreground mt-0.5">{payload[0].value} requests</p>
    </div>
  );
}

function EmptyChart({ message }) {
  return (
    <p className="text-sm text-muted-foreground py-14 text-center">{message}</p>
  );
}

export default function Analytics() {
  const { requests } = useRequestState();
  const navigate = useNavigate();

  const counts = Object.fromEntries(
    STATUS_CONFIG.map(({ status }) => [
      status,
      requests.filter((r) => r.request_status === status).length,
    ])
  );

  const overTime = computeRequestsOverTime(requests);
  const technicianData = computeTechnicianWorkload(requests);
  const followUp = computeFollowUpStats(requests);

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-5xl mx-auto py-10 px-6 space-y-8">
        <PageHeader
          title="Analytics"
          description="An overview of service request activity, technician workload, and follow-up trends."
        />

        {/* Stat cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {STATUS_CONFIG.map(({ status, label, icon: Icon, iconClass, cardClass, countClass }) => (
            <button
              key={status}
              onClick={() => navigate(`/?status=${status}`)}
              className="text-left"
            >
              <Card className={`gap-3 py-5 ${cardClass} transition-shadow hover:shadow-md cursor-pointer`}>
                <CardHeader className="pb-0 px-5">
                  <div className="flex items-center justify-between">
                    <CardDescription className="text-xs font-medium uppercase tracking-wide">
                      {label}
                    </CardDescription>
                    <Icon className={`w-4 h-4 ${iconClass}`} />
                  </div>
                </CardHeader>
                <CardContent className="px-5">
                  <p className={`text-3xl font-bold ${countClass}`}>
                    {counts[status]}
                  </p>
                </CardContent>
              </Card>
            </button>
          ))}
        </div>

        {/* Requests over time + Follow-up rate */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-base">Requests Over Time</CardTitle>
              <CardDescription>Weekly volume of service requests</CardDescription>
            </CardHeader>
            <CardContent>
              {overTime.length === 0 ? (
                <EmptyChart message="No data available" />
              ) : (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart
                    data={overTime}
                    margin={{ top: 4, right: 8, left: -16, bottom: 4 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#e2e8f0"
                    />
                    <XAxis
                      dataKey="week"
                      tick={{ fontSize: 11, fill: "#94a3b8" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      allowDecimals={false}
                      tick={{ fontSize: 11, fill: "#94a3b8" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      content={<ChartTooltip />}
                      cursor={{ fill: "#f1f5f9" }}
                    />
                    <Bar
                      dataKey="count"
                      fill={CHART_COLOR}
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <GitFork className="w-4 h-4 text-muted-foreground" />
                Follow-up Rate
              </CardTitle>
              <CardDescription>
                How often requests require a revisit
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div>
                <p className="text-5xl font-bold tracking-tight">
                  {followUp.rate.toFixed(1)}
                  <span className="text-2xl text-muted-foreground font-medium">
                    %
                  </span>
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  of all requests are follow-ups
                </p>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="rounded-full h-2 transition-all"
                  style={{
                    width: `${Math.min(followUp.rate, 100)}%`,
                    backgroundColor: CHART_COLOR,
                  }}
                />
              </div>
              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Follow-up requests</span>
                  <span className="font-medium">{followUp.followUps}</span>
                </div>
                <div className="flex justify-between border-t pt-2.5">
                  <span className="text-muted-foreground">Total requests</span>
                  <span className="font-medium">{followUp.total}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Technician workload */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Technician Workload</CardTitle>
            <CardDescription>
              Number of assigned requests per technician (top 10)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {technicianData.length === 0 ? (
              <EmptyChart message="No technicians assigned yet" />
            ) : (
              <ResponsiveContainer
                width="100%"
                height={Math.max(160, technicianData.length * 44)}
              >
                <BarChart
                  layout="vertical"
                  data={technicianData}
                  margin={{ top: 4, right: 24, left: 8, bottom: 4 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    horizontal={false}
                    stroke="#e2e8f0"
                  />
                  <XAxis
                    type="number"
                    allowDecimals={false}
                    tick={{ fontSize: 11, fill: "#94a3b8" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={120}
                    tick={{ fontSize: 12, fill: "#334155" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    content={<ChartTooltip />}
                    cursor={{ fill: "#f1f5f9" }}
                  />
                  <Bar
                    dataKey="count"
                    fill={CHART_COLOR}
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
