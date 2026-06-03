import SpinnerPage from "@/components/SpinnerPage";
import { useQuery } from "@tanstack/react-query";
import PageHeader from "@/components/PageHeader";
import { createColumnHelper } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import DefaultHeader from "@/components/ui/default-header";
import RedirectButton from "@/components/RedirectButton";
import { fetchTechnicians } from "@/hooks/FetchTechnicians";
import { useAuth } from "@/context/AuthContext";

const columnHelper = createColumnHelper();

const columns = [
  columnHelper.accessor("name", {
    header: (info) => <DefaultHeader info={info} name={"Name"} />,
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("email", {
    header: (info) => <DefaultHeader info={info} name={"Email"} />,
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("company_name", {
    header: (info) => <DefaultHeader info={info} name={"Company"} />,
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("view", {
    header: () => "Details",
    cell: (info) => (
      <RedirectButton
        text="View"
        path={`/technician/${info.row.original.id}`}
      />
    ),
  }),
];

const Technicians = () => {
  const { accessToken } = useAuth();

  const { isPending, isError, data, error } = useQuery({
    queryKey: ["technicians", accessToken],
    queryFn: () => fetchTechnicians(accessToken),
    enabled: !!accessToken,
  });

  if (isPending) return <SpinnerPage />;
  if (isError) return <div>{error.message}</div>;

  return (
    <div className="flex justify-center flex-col max-w-5xl mx-auto py-10 px-6">
      <PageHeader
        title="Technicians"
        description="This is a list of all registered technicians. Click view to see the technician details and associated service requests."
      />
      <DataTable className="pt-3" columns={columns} data={data} />
    </div>
  );
};

export default Technicians;
