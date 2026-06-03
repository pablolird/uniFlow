import SpinnerPage from "@/components/SpinnerPage";
import { useQuery } from "@tanstack/react-query";
import PageHeader from "@/components/PageHeader";
import { createColumnHelper } from "@tanstack/react-table";
import { DataTable } from "../components/ui/data-table";
import DefaultHeader from "../components/ui/default-header";
import RedirectButton from "../components/RedirectButton";
import { fetchAssets } from "../hooks/FetchAssets";

const columnHelper = createColumnHelper();
const columns = [
  columnHelper.accessor("company_name", {
    header: (info) => <DefaultHeader info={info} name={"Company Name"} />,
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("model", {
    header: (info) => <DefaultHeader info={info} name={"Asset Model"} />,
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("name", {
    header: (info) => <DefaultHeader info={info} name={"Name"} />,
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("created_at", {
    header: (info) => <DefaultHeader info={info} name={"Creation Date"} />,
    cell: (info) => info.getValue().split("T")[0].replace(/-/g, "/"),
  }),
  columnHelper.accessor("schedule_request", {
    header: () => "Details",
    cell: (info) => (
      <RedirectButton text="View" path={`/asset/${info.row.original.id}`} />
    ),
  }),
];

const Assets = () => {
  const { isPending, isError, data, error } = useQuery({
    queryKey: ["assets"],
    queryFn: fetchAssets,
  });

  if (isPending) {
    return <SpinnerPage />;
  }

  if (isError) {
    return <div>{error.message}</div>;
  }

  console.log(data);
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-4xl mx-auto py-10 px-6">
        <PageHeader
          title="Assets"
          description="This is a list of all current available assets. Click view to see the asset details"
        />
        <DataTable className="pt-3" columns={columns} data={data} />
      </div>
    </div>
  );
};

export default Assets;
