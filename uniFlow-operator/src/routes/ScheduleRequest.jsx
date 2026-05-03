import { createSearchParams, useNavigate, useParams } from "react-router";
import { useRequestState } from "../context/RequestContext";
import ActivityForm from "@/components/ActivityForm";
import { Separator } from "@/components/ui/separator";
import RequestPageLayout from "@/components/RequestPageLayout";
import PageHeader from "@/components/PageHeader";
import RequestTwoColumnLayout from "@/components/RequestTwoColumnLayout";

const ScheduleRequest = () => {
  const params = useParams();
  const { requests } = useRequestState();
  const navigate = useNavigate();

  const request = requests.find((r) => r.request_id === params.requestId);

  const handleSuccess = () => {
    navigate({
      pathname: "/",
      search: createSearchParams({
        status: request.request_status,
      }).toString(),
    });
  };

  const handleCancel = () => {
    navigate({
      pathname: "/",
      search: createSearchParams({
        status: request.request_status,
      }).toString(),
    });
  };

  return (
    <RequestPageLayout>
      <PageHeader
        title="Create Activity"
        description='Assign a technician and schedule the service request. The request will be moved to "Scheduled" status.'
      />
      <Separator className="mb-8" />
      <RequestTwoColumnLayout request={request} rightTitle="Schedule">
        <ActivityForm
          request={request}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </RequestTwoColumnLayout>
    </RequestPageLayout>
  );
};

export default ScheduleRequest;
