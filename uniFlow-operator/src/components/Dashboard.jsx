import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTable } from "./ui/data-table";
import { createColumnHelper } from "@tanstack/react-table";
import { useRequestState } from "@/context/RequestContext";
import RedirectButton from "./RedirectButton";
import DefaultHeader from "./ui/default-header";
import { Toaster } from "sonner";
import { useSearchParams } from "react-router";
import FollowupBadge from "./FollowupBadge";
import PageHeader from "@/components/PageHeader";
import { Clock, CalendarClock, Wrench, CircleCheck, Archive } from "lucide-react";
import TechnicianLink from "@/components/TechnicianLink";
import AssetLink from "@/components/AssetLink";

const columnHelper = createColumnHelper();
const pending_columns = [
  columnHelper.accessor("date", {
    header: (info) => <DefaultHeader info={info} name={"Date"} />,
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("company", {
    header: (info) => <DefaultHeader info={info} name={"Company"} />,
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("requester", {
    header: (info) => <DefaultHeader info={info} name={"Requester"} />,
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("device_model", {
    header: (info) => <DefaultHeader info={info} name={"Device Model"} />,
    cell: (info) => (
      <AssetLink model={info.getValue()} id={info.row.original.asset_id} />
    ),
  }),
  columnHelper.accessor("description", {
    header: (info) => <DefaultHeader info={info} name={"Description"} />,
    cell: (info) => {
      const value = info.getValue();
      const truncated =
        value && value.length > 20 ? value.slice(0, 20) + "…" : value;
      return (
        <span>
          {truncated}
          {info.row.original.parent_id && <FollowupBadge />}
        </span>
      );
    },
  }),
  columnHelper.accessor("schedule_request", {
    header: () => "Schedule Request",
    cell: (info) => (
      <RedirectButton
        text="Schedule Request"
        path={`/schedule_request/${info.row.original.request_id}`}
      />
    ),
  }),
];

const scheduled_columns = [
  columnHelper.accessor("scheduled_date", {
    header: (info) => <DefaultHeader info={info} name={"Scheduled Date"} />,
    cell: (info) => {
      const isoDate = info.getValue();
      const formatted = new Date(isoDate).toLocaleString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
      return formatted;
    },
  }),
  columnHelper.accessor("company", {
    header: (info) => <DefaultHeader info={info} name={"Company"} />,
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("requester", {
    header: (info) => <DefaultHeader info={info} name={"Requester"} />,
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("device_model", {
    header: (info) => <DefaultHeader info={info} name={"Device Model"} />,
    cell: (info) => (
      <span className="inline-flex items-center gap-1">
        <AssetLink model={info.getValue()} id={info.row.original.asset_id} />
        {info.row.original.parent_id && <FollowupBadge />}
      </span>
    ),
  }),
  columnHelper.accessor("technician", {
    header: (info) => (
      <DefaultHeader info={info} name={"Assigned Technician"} />
    ),
    cell: (info) => (
      <TechnicianLink
        name={info.getValue()}
        id={info.row.original.technician_id}
      />
    ),
  }),
  columnHelper.accessor("show_request", {
    header: () => "Details",
    cell: (info) => (
      <RedirectButton
        path={`/show_request/${info.row.original.request_id}`}
        text="Show Details"
      />
    ),
  }),
];

const inprogress_columns = [
  columnHelper.accessor("scheduled_date", {
    header: (info) => <DefaultHeader info={info} name={"Scheduled Date"} />,
    cell: (info) => {
      const isoDate = info.getValue();
      const formatted = new Date(isoDate).toLocaleString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
      return formatted;
    },
  }),
  columnHelper.accessor("company", {
    header: (info) => <DefaultHeader info={info} name={"Company"} />,
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("requester", {
    header: (info) => <DefaultHeader info={info} name={"Requester"} />,
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("device_model", {
    header: (info) => <DefaultHeader info={info} name={"Device Model"} />,
    cell: (info) => (
      <span className="inline-flex items-center gap-1">
        <AssetLink model={info.getValue()} id={info.row.original.asset_id} />
        {info.row.original.parent_id && <FollowupBadge />}
      </span>
    ),
  }),
  columnHelper.accessor("technician", {
    header: (info) => (
      <DefaultHeader info={info} name={"Assigned Technician"} />
    ),
    cell: (info) => (
      <TechnicianLink
        name={info.getValue()}
        id={info.row.original.technician_id}
      />
    ),
  }),
  columnHelper.accessor("show_request", {
    header: () => "Details",
    cell: (info) => (
      <RedirectButton
        path={`/show_request/${info.row.original.request_id}`}
        text="Show Details"
      />
    ),
  }),
];

const resolved_columns = [
  columnHelper.accessor("scheduled_date", {
    header: (info) => <DefaultHeader info={info} name={"Date Solved"} />,
    cell: (info) => {
      const isoDate = info.getValue();
      if (!isoDate) return "N/A";
      const formatted = new Date(isoDate).toLocaleString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
      return formatted;
    },
  }),
  columnHelper.accessor("company", {
    header: (info) => <DefaultHeader info={info} name={"Company"} />,
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("requester", {
    header: (info) => <DefaultHeader info={info} name={"Requester"} />,
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("device_model", {
    header: (info) => <DefaultHeader info={info} name={"Device Model"} />,
    cell: (info) => (
      <span className="inline-flex items-center gap-1">
        <AssetLink model={info.getValue()} id={info.row.original.asset_id} />
        {info.row.original.parent_id && <FollowupBadge />}
      </span>
    ),
  }),
  columnHelper.accessor("technician_notes", {
    header: (info) => <DefaultHeader info={info} name={"Technician Notes"} />,
    cell: (info) => {
      const value = info.getValue();
      if (!value) return "No notes";
      return value.length > 30 ? value.slice(0, 30) + "…" : value;
    },
  }),
  columnHelper.accessor("technician", {
    header: (info) => <DefaultHeader info={info} name={"Technician"} />,
    cell: (info) => (
      <TechnicianLink
        name={info.getValue()}
        id={info.row.original.technician_id}
      />
    ),
  }),
  columnHelper.accessor("resolve_activity", {
    header: () => "Close Activity",
    cell: (info) => (
      <RedirectButton
        text="Close"
        path={`/close_request/${info.row.original.request_id}`}
      />
    ),
  }),
];

const closed_columns = [
  columnHelper.accessor("scheduled_date", {
    header: (info) => <DefaultHeader info={info} name={"Date Solved"} />,
    cell: (info) => {
      const isoDate = info.getValue();
      if (!isoDate) return "N/A";
      const formatted = new Date(isoDate).toLocaleString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
      return formatted;
    },
  }),
  columnHelper.accessor("company", {
    header: (info) => <DefaultHeader info={info} name={"Company"} />,
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("requester", {
    header: (info) => <DefaultHeader info={info} name={"Requester"} />,
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("device_model", {
    header: (info) => <DefaultHeader info={info} name={"Device Model"} />,
    cell: (info) => (
      <span className="inline-flex items-center gap-1">
        <AssetLink model={info.getValue()} id={info.row.original.asset_id} />
        {info.row.original.parent_id && <FollowupBadge />}
      </span>
    ),
  }),
  columnHelper.accessor("technician_notes", {
    header: (info) => <DefaultHeader info={info} name={"Technician Notes"} />,
    cell: (info) => {
      const value = info.getValue();
      if (!value) return "No notes";
      return value.length > 30 ? value.slice(0, 30) + "…" : value;
    },
  }),
  columnHelper.accessor("technician", {
    header: (info) => <DefaultHeader info={info} name={"Technician"} />,
    cell: (info) => (
      <TechnicianLink
        name={info.getValue()}
        id={info.row.original.technician_id}
      />
    ),
  }),
  columnHelper.accessor("show_request", {
    header: () => "Details",
    cell: (info) => (
      <RedirectButton
        path={`/show_request/${info.row.original.request_id}`}
        text="Show Details"
      />
    ),
  }),
];

export default function Dashboard() {
  const { requests } = useRequestState();
  console.log(requests);
  const filteredRequests = {
    pending: requests.filter((r) => r.request_status === "PENDING"),
    scheduled: requests.filter((r) => r.request_status === "SCHEDULED"),
    in_progress: requests.filter((r) => r.request_status === "IN_PROGRESS"),
    resolved: requests.filter((r) => r.request_status === "RESOLVED"),
    closed: requests.filter((r) => r.request_status === "CLOSED"),
  };

  const [searchParams] = useSearchParams();

  const defaultTab = searchParams.get("status") || "PENDING";

  return (
    <div className="relative w-full h-full overflow-hidden flex flex-col items-center">
      <Toaster></Toaster>
      <div className="w-fit h-full flex-col flex justify-start pt-10 items-center">
        <div className="w-full">
          <PageHeader
            title="Service Requests"
            description="This is a list of all service requests. Assign a date and a technician to pending requests and review any already resolved requests"
          />
        </div>

        <Tabs
          defaultValue={defaultTab}
          className="background w-full h-full flex flex-col justify-start items-center"
        >
          <TabsList className="mt-5">
            <TabsTrigger value="PENDING"><Clock className="w-3.5 h-3.5 mr-1.5" />Pending</TabsTrigger>
            <TabsTrigger value="SCHEDULED"><CalendarClock className="w-3.5 h-3.5 mr-1.5" />Scheduled</TabsTrigger>
            <TabsTrigger value="IN_PROGRESS"><Wrench className="w-3.5 h-3.5 mr-1.5" />In progress</TabsTrigger>
            <TabsTrigger value="RESOLVED"><CircleCheck className="w-3.5 h-3.5 mr-1.5" />Resolved</TabsTrigger>
            <TabsTrigger value="CLOSED"><Archive className="w-3.5 h-3.5 mr-1.5" />Closed</TabsTrigger>
          </TabsList>
          <TabsContent value="PENDING" className="h-full">
            <DataTable
              columns={pending_columns}
              data={filteredRequests.pending}
              className="max-w-5xl h-9/11"
            />
          </TabsContent>
          <TabsContent className="h-full" value="SCHEDULED">
            <DataTable
              columns={scheduled_columns}
              data={filteredRequests.scheduled}
              className="max-w-5xl h-9/11"
            />
          </TabsContent>
          <TabsContent className="h-full" value="IN_PROGRESS">
            <DataTable
              columns={inprogress_columns}
              data={filteredRequests.in_progress}
              className="max-w-5xl h-9/11"
            />
          </TabsContent>
          <TabsContent className="h-full" value="RESOLVED">
            <DataTable
              columns={resolved_columns}
              data={filteredRequests.resolved}
              className="max-w-5xl h-9/11"
            />
          </TabsContent>
          <TabsContent className="h-full" value="CLOSED">
            <DataTable
              columns={closed_columns}
              data={filteredRequests.closed}
              className="max-w-5xl h-9/11"
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
