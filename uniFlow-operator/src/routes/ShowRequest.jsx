import { createSearchParams, useNavigate, useParams } from "react-router";
import { useRequestState } from "../context/RequestContext";
import ActivityInfo from "@/components/ActivityInfo";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import RequestPageLayout from "@/components/RequestPageLayout";
import PageHeader from "@/components/PageHeader";
import RequestTwoColumnLayout from "@/components/RequestTwoColumnLayout";
import RequestNotFound from "@/components/RequestNotFound";

const STATUS_LABELS = {
  SCHEDULED: "Scheduled Request",
  IN_PROGRESS: "In Progress Request",
  CLOSED: "Closed Request",
};

const STATUS_DESCRIPTIONS = {
  SCHEDULED:
    "This request has been assigned to a technician and is awaiting service.",
  IN_PROGRESS: "A technician is currently working on this request.",
  CLOSED: "This request has been resolved and closed.",
};

const ShowRequest = () => {
  const params = useParams();
  const { requests } = useRequestState();
  const navigate = useNavigate();

  const request = requests.find((r) => r.request_id === params.requestId);

  if (!request) return <RequestNotFound />;

  const title = STATUS_LABELS[request.request_status] ?? "Request Details";
  const description =
    STATUS_DESCRIPTIONS[request.request_status] ??
    "Read-only view of this service request.";

  const backButton = (
    <Button
      onClick={() =>
        navigate({
          pathname: "/",
          search: createSearchParams({
            status: request.request_status,
          }).toString(),
        })
      }
    >
      Back
    </Button>
  );

  return (
    <RequestPageLayout>
      <PageHeader title={title} description={description} action={backButton} />
      <Separator className="mb-8" />
      <RequestTwoColumnLayout request={request} rightTitle="Activity Details">
        <ActivityInfo request={request} />
      </RequestTwoColumnLayout>
    </RequestPageLayout>
  );
};

export default ShowRequest;
