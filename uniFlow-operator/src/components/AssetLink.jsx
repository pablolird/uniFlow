import { useNavigate } from "react-router";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const AssetLink = ({ model, id }) => {
  const navigate = useNavigate();

  if (!id || !model) return <span>{model || "N/A"}</span>;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={() => navigate(`/asset/${id}`)}
            className="text-left underline decoration-dotted underline-offset-4 cursor-pointer hover:text-foreground/70 transition-colors"
          >
            {model}
          </button>
        </TooltipTrigger>
        <TooltipContent>Visit asset page</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default AssetLink;
