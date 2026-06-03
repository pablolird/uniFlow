import SpinnerPage from "@/components/SpinnerPage";
import PageHeader from "@/components/PageHeader";
import { useNavigate, useParams } from "react-router";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { fetchAssets } from "../hooks/FetchAssets";
import { useRequestState } from "@/context/RequestContext";
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

const AssetDetails = () => {
  const navigate = useNavigate();
  const params = useParams();
  const { requests } = useRequestState();

  const { isPending, isError, data, error } = useQuery({
    queryKey: ["assets"],
    queryFn: fetchAssets,
  });

  if (isPending) return <SpinnerPage />;
  if (isError) return <div>{error.message}</div>;

  const asset = data.find((a) => a.id === params.id);

  if (!asset) return <div>Asset not found</div>;

  const createdAt = new Date(asset.created_at);
  const formattedDate = `${createdAt.getDate().toString().padStart(2, "0")}/${(createdAt.getMonth() + 1).toString().padStart(2, "0")}/${createdAt.getFullYear()}`;

  const assetRequests = requests.filter((r) => r.asset_id === asset.id);

  const backButton = <Button onClick={() => navigate(-1)}>Back</Button>;

  return (
    <div className="flex-1 overflow-y-auto">
    <div className="container lg:block flex justify-center items-center flex-col max-w-5xl mx-auto py-10 px-6">
      <PageHeader
        title="Asset Details"
        description="These are the asset details and their associated service requests."
        action={backButton}
      />
      <Separator className="mb-8" />

      <div className="mb-10">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-3">
          Asset Information
        </h2>
        <div className="max-w-xl w-fit">
          <Table>
            <TableBody>
              <TableRow className="h-min">
                <TableCell className="font-medium">Creation Date</TableCell>
                <TableCell>{formattedDate}</TableCell>
              </TableRow>
              <TableRow className="h-min">
                <TableCell className="font-medium">Company Name</TableCell>
                <TableCell>{asset.company_name}</TableCell>
              </TableRow>
              <TableRow className="h-min">
                <TableCell className="font-medium">Model</TableCell>
                <TableCell>{asset.model}</TableCell>
              </TableRow>
              <TableRow className="h-min">
                <TableCell className="font-medium">Name</TableCell>
                <TableCell>{asset.name}</TableCell>
              </TableRow>
              <TableRow className="h-min">
                <TableCell className="font-medium">Address</TableCell>
                <TableCell>{asset.location_address}</TableCell>
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
        <DataTable columns={request_columns} data={assetRequests} />
      </div>
    </div>
    </div>
  );
};

export default AssetDetails;
