import { useState } from "react";
import ActivityForm from "./ActivityForm";
import RequestInfo from "./RequestInfo";
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

export default function SubmitActivity({ request }) {
  const [open, setOpen] = useState(false);
  const handleSuccess = () => {
    // Close the dialog when activity is successfully created
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Create</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-5xl max-h-10/11">
        <DialogHeader>
          <DialogTitle>Create Activity</DialogTitle>
          <DialogDescription>
            Assign a technician and schedule the service request. The request will be moved to "Scheduled" status.
          </DialogDescription>
        </DialogHeader>
        <div className="main-overlay-content mx-10 gap-10 flex justify-center items-center">
          <RequestInfo request={request} />
          <ActivityForm request={request} onSuccess={handleSuccess} />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="submit" form="activity-form">
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}