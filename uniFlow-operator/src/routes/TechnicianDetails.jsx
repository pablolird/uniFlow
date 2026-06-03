import SpinnerPage from "@/components/SpinnerPage";
import PageHeader from "@/components/PageHeader";
import { useNavigate, useParams } from "react-router";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { fetchTechnicians } from "@/hooks/FetchTechnicians";
import { useRequestState } from "@/context/RequestContext";
import { useAuth } from "@/context/AuthContext";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/data-table";
import { createColumnHelper } from "@tanstack/react-table";
import DefaultHeader from "@/components/ui/default-header";
import RedirectButton from "@/components/RedirectButton";
import StatusBadge from "@/components/StatusBadge";

const columnHelper = createColumnHelper();

const getRequestPath = (request) => {
  switch (request.request_status) {
    case "PENDING":
      return `/schedule_request/${request.request_id}`;
    case "RESOLVED":
      return `/close_request/${request.request_id}`;
    default:
      return `/show_request/${request.request_id}`;
  }
};

const getButtonText = (status) => {
  switch (status) {
    case "PENDING":
      return "Schedule";
    case "RESOLVED":
      return "Close";
    default:
      return "View Details";
  }
};

const request_columns = [
  columnHelper.accessor("date", {
    header: (info) => <DefaultHeader info={info} name={"Date"} />,
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("requester", {
    header: (info) => <DefaultHeader info={info} name={"Requester"} />,
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("description", {
    header: (info) => <DefaultHeader info={info} name={"Description"} />,
    cell: (info) => {
      const value = info.getValue();
      return value && value.length > 30 ? value.slice(0, 30) + "…" : value;
    },
  }),
  columnHelper.accessor("request_status", {
    header: (info) => <DefaultHeader info={info} name={"Status"} />,
    cell: (info) => <StatusBadge status={info.getValue()} />,
  }),
  columnHelper.accessor("action", {
    header: () => "Action",
    cell: (info) => (
      <RedirectButton
        text={getButtonText(info.row.original.request_status)}
        path={getRequestPath(info.row.original)}
      />
    ),
  }),
];

const TechnicianDetails = () => {
  const navigate = useNavigate();
  const params = useParams();
  const { accessToken } = useAuth();
  const { requests } = useRequestState();

  const { isPending, isError, data, error } = useQuery({
    queryKey: ["technicians", accessToken],
    queryFn: () => fetchTechnicians(accessToken),
    enabled: !!accessToken,
  });

  if (isPending) return <SpinnerPage />;
  if (isError) return <div>{error.message}</div>;

  const technician = data.find((t) => t.id === params.id);

  if (!technician) return <div>Technician not found</div>;

  const technicianRequests = requests.filter(
    (r) => r.technician_id === technician.id
  );

  const backButton = <Button onClick={() => navigate(-1)}>Back</Button>;

  return (
    <div className="flex-1 overflow-y-auto">
    <div className="container lg:block flex justify-center items-center flex-col max-w-5xl mx-auto py-10 px-6">
      <PageHeader
        title="Technician Details"
        description="These are the technician details and their associated service requests."
        action={backButton}
      />
      <Separator className="mb-8" />

      <div className="mb-10">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-3">
          Technician Information
        </h2>
        <div className="max-w-xl w-fit">
          <Table>
            <TableBody>
              <TableRow className="h-min">
                <TableCell className="font-medium">Name</TableCell>
                <TableCell>{technician.name}</TableCell>
              </TableRow>
              <TableRow className="h-min">
                <TableCell className="font-medium">Email</TableCell>
                <TableCell>{technician.email}</TableCell>
              </TableRow>
              <TableRow className="h-min">
                <TableCell className="font-medium">Phone</TableCell>
                <TableCell>{technician.phone}</TableCell>
              </TableRow>
              <TableRow className="h-min">
                <TableCell className="font-medium">Company</TableCell>
                <TableCell>{technician.company_name}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>

      <Separator className="mb-8" />

      <div className="w-fit">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-3">
          Service Requests
        </h2>
        <DataTable columns={request_columns} data={technicianRequests} />
      </div>
    </div>
    </div>
  );
};

export default TechnicianDetails;
