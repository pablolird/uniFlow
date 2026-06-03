import { useNavigate } from "react-router";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const TechnicianLink = ({ name, id }) => {
  const navigate = useNavigate();

  if (!id || !name) return <span>{name || "N/A"}</span>;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={() => navigate(`/technician/${id}`)}
            className="text-left underline decoration-dotted underline-offset-4 cursor-pointer hover:text-foreground/70 transition-colors"
          >
            {name}
          </button>
        </TooltipTrigger>
        <TooltipContent>Visit technician page</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default TechnicianLink;
