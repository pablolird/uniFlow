import { useState } from "react";
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

export default function ActivityDetails({ request }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary">View Details</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-5xl max-h-10/11">
        <DialogHeader>
          <DialogTitle>Activity Details</DialogTitle>
          <DialogDescription>
            View the complete service request details and resolution information.
          </DialogDescription>
        </DialogHeader>
        <div className="main-overlay-content mx-10 gap-10 flex justify-center items-center">
          <ResolvedRequestInfo request={request} />
          <ResolvedDetails request={request} />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}