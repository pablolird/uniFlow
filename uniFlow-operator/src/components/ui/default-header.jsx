import { ArrowDownUp, ArrowUpDown } from "lucide-react";

const DefaultHeader = ({ info, name }) => {
  const sorted = info.column.getIsSorted();

  return (
    <div
      className="flex w-full h-full justify-start items-center"
      onPointerDown={(e) => {
        e.preventDefault();
        info.column.toggleSorting(info.column.getIsSorted() === "asc");
      }}
    >
      {name}
      {sorted === "asc" && <ArrowDownUp className="pl-1 text-foreground" />}
      {sorted === "desc" && <ArrowUpDown className="pl-1 text-foreground" />}
    </div>
  );
};

export default DefaultHeader;
