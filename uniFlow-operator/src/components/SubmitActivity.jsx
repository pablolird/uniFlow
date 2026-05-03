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
import { NavLink } from "react-router";

export default function SubmitActivity({ request }) {
  const [open, setOpen] = useState(false);
  const handleSuccess = () => {
    // Close the dialog when activity is successfully created
    setOpen(false);
  };

  return (
    <Button asChild>
      <NavLink to={`/schedule_request/${request.request_id}`}>
        Schedule Request
      </NavLink>
    </Button>
  );
}
