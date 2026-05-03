import RequestInfo from "@/components/RequestInfo";
import { Separator } from "@/components/ui/separator";

export default function RequestTwoColumnLayout({ request, rightTitle, children }) {
  return (
    <div className="flex flex-col lg:flex-row gap-10 items-start justify-center">
      <div className="w-full lg:w-auto">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-3">
          Request Details
        </h2>
        <RequestInfo request={request} />
      </div>

      <Separator orientation="vertical" className="hidden lg:block self-stretch" />

      <div className="w-full lg:flex-1 lg:max-w-xl">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-3">
          {rightTitle}
        </h2>
        {children}
      </div>
    </div>
  );
}
