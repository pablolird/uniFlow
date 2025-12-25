import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTable } from "./ui/data-table";
import { createColumnHelper } from "@tanstack/react-table";
import { useRequestState } from "../RequestContext";
import SubmitActivity from "./SubmitActivity";
import ResolveActivity from "./ResolveActivity";
import ActivityDetails from "./ActivityDetails";
import DefaultHeader from "./ui/default-header";
import { WifiOff } from "lucide-react";
import { Wifi } from "lucide-react";
import { Toaster } from "sonner";

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
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("description", {
    header: (info) => <DefaultHeader info={info} name={"Description"} />,
    cell: (info) => {
      const value = info.getValue();
      return value && value.length > 20 ? value.slice(0, 20) + "…" : value;
    },
  }),
  columnHelper.accessor("create_activity", {
    header: () => "Create Activity",
    cell: (info) => <SubmitActivity request={info.row.original} />,
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
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("description", {
    header: (info) => <DefaultHeader info={info} name={"Description"} />,
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("technician", {
    header: (info) => (
      <DefaultHeader info={info} name={"Assigned Technician"} />
    ),
    cell: (info) => info.getValue(),
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
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("description", {
    header: (info) => <DefaultHeader info={info} name={"Description"} />,
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("technician", {
    header: (info) => (
      <DefaultHeader info={info} name={"Assigned Technician"} />
    ),
    cell: (info) => info.getValue(),
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
    cell: (info) => info.getValue(),
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
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("resolve_activity", {
    header: () => "Resolve",
    cell: (info) => <ResolveActivity request={info.row.original} />,
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
    cell: (info) => info.getValue(),
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
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("activity_details", {
    header: () => "Activity Details",
    cell: (info) => <ActivityDetails request={info.row.original} />,
  }),
];

export default function Dashboard() {
  const { requests, isSocketConnected } = useRequestState();

  const filteredRequests = {
    pending: requests.filter((r) => r.request_status === "PENDING"),
    scheduled: requests.filter((r) => r.request_status === "SCHEDULED"),
    in_progress: requests.filter((r) => r.request_status === "IN_PROGRESS"),
    resolved: requests.filter((r) => r.request_status === "RESOLVED"),
    closed: requests.filter((r) => r.request_status === "CLOSED"),
  };

  return (
    <div className="relative w-full h-full overflow-hidden">
      <Toaster></Toaster>
      <Tabs
        defaultValue="pending"
        className="bg-background w-full h-full flex flex-col justify-start items-center"
      >
        <TabsList className="mt-5">
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
          <TabsTrigger value="in-progress">In progress</TabsTrigger>
          <TabsTrigger value="resolved">Resolved</TabsTrigger>
          <TabsTrigger value="closed">Closed</TabsTrigger>
        </TabsList>
        <TabsContent value="pending" className="h-full">
          <DataTable
            columns={pending_columns}
            data={filteredRequests.pending}
          />
        </TabsContent>
        <TabsContent className="h-full" value="scheduled">
          <DataTable
            columns={scheduled_columns}
            data={filteredRequests.scheduled}
          />
        </TabsContent>
        <TabsContent className="h-full" value="in-progress">
          <DataTable
            columns={inprogress_columns}
            data={filteredRequests.in_progress}
          />
        </TabsContent>
        <TabsContent className="h-full" value="resolved">
          <DataTable
            columns={resolved_columns}
            data={filteredRequests.resolved}
          />
        </TabsContent>
        <TabsContent className="h-full" value="closed">
          <DataTable
            columns={closed_columns}
            data={filteredRequests.closed}
          />
        </TabsContent>
      </Tabs>
      <div className="absolute flex gap-1 p-1 bottom-0 left-0">
        {isSocketConnected ? (
          <>
            <Wifi className="text-green-500 animate-blink" />
            <p className="text-green-500 animate-blink">Connected</p>
          </>
        ) : (
          <>
            <WifiOff className="text-red-500 animate-blink" />
            <p className="text-red-500 animate-blink">Disconnected</p>
          </>
        )}
      </div>
    </div>
  );
}