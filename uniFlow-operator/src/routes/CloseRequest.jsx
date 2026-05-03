import { createSearchParams, useNavigate, useParams } from "react-router";
import axios from "axios";
import { useRequestState } from "../context/RequestContext";
import ActivityInfo from "@/components/ActivityInfo";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import useFetch from "@/hooks/UseFetch";
import RequestPageLayout from "@/components/RequestPageLayout";
import PageHeader from "@/components/PageHeader";
import RequestTwoColumnLayout from "@/components/RequestTwoColumnLayout";
import RequestNotFound from "@/components/RequestNotFound";

const CloseRequest = () => {
  const params = useParams();
  const { requests, refetchRequests } = useRequestState();
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  const request = requests.find((r) => r.request_id === params.requestId);

  const {
    fn: closeRequest,
    loading: submitting,
    error,
  } = useFetch(async (accessToken) => {
    const response = await axios.patch(
      `${apiUrl}/v1/service-requests/${request.request_id}`,
      { status: "CLOSED" },
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    return response.data;
  });

  const handleClose = async () => {
    try {
      await closeRequest();
      if (refetchRequests) await refetchRequests();
      toast("Request Closed", {
        description: "Request has been successfully closed.",
      });

      navigate({
        pathname: "/",
        search: createSearchParams({
          status: request.request_status,
        }).toString(),
      });
    } catch (err) {
      toast("Error", {
        description:
          err?.response?.data?.message ||
          err?.message ||
          "Failed to close request",
      });
    }
  };

  if (!request) return <RequestNotFound />;

  return (
    <RequestPageLayout>
      <PageHeader
        title="Resolve Request"
        description="Review the completed service details and close the request."
      />
      <Separator className="mb-8" />
      <RequestTwoColumnLayout request={request} rightTitle="Activity Details">
        <ActivityInfo request={request} />
      </RequestTwoColumnLayout>

      {error && (
        <p className="text-sm text-destructive text-center mt-6">
          {error?.response?.data?.message ||
            error?.message ||
            "Failed to close request"}
        </p>
      )}

      <Separator className="my-8" />

      <div className="flex justify-end gap-2">
        <Button
          variant="outline"
          className="bg-card hover:bg-card/40"
          disabled={submitting}
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
        <Button onClick={handleClose} disabled={submitting}>
          {submitting ? <Spinner /> : "Close Request"}
        </Button>
      </div>
    </RequestPageLayout>
  );
};

export default CloseRequest;
