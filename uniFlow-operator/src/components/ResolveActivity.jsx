import { useState } from "react";
import axios from "axios";
import ResolvedRequestInfo from "./ResolvedRequestInfo";
import ResolvedDetails from "./ResolvedDetails";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useRequestState } from "../RequestContext";
import { toast } from "sonner";
import useFetch from "../hooks/UseFetch";

export default function ResolveActivity({ request }) {
  const [open, setOpen] = useState(false);
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const { refetchRequests } = useRequestState();

  const { fn: closeRequest, loading: submitting, error } = useFetch(
    async (accessToken) => {
      const response = await axios.patch(
        `${apiUrl}/v1/service-requests/${request.request_id}`,
        { status: "CLOSED" },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      return response.data;
    }
  );

  const handleClose = async () => {
    try {
      await closeRequest();

      if (refetchRequests) {
        await refetchRequests();
      }

      toast("Request Closed", {
        description: `Request has been successfully closed`,
      });

      setOpen(false);
    } catch (err) {
      toast("Error", {
        description:
          err.response?.data?.message || err.message || "Failed to close request",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Close Activity</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-5xl max-h-10/11">
        <DialogHeader>
          <DialogTitle>Resolve Activity</DialogTitle>
          <DialogDescription>
            Review the service request details and close the activity.
          </DialogDescription>
        </DialogHeader>
        <div className="main-overlay-content mx-10 gap-10 flex justify-center items-center">
          <ResolvedRequestInfo request={request} />
          <ResolvedDetails request={request} />
        </div>
        {error && (
          <p className="text-sm text-destructive text-center">{error}</p>
        )}
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={submitting}>Cancel</Button>
          </DialogClose>
          <Button 
            onClick={handleClose}
            disabled={submitting}
          >
            {submitting ? "Closing..." : "Close Request"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}