import { useState, useEffect } from "react";
import axios from "axios";
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { useRequestState } from "../RequestContext";
import useFetch from "../hooks/UseFetch";

export default function ActivityForm({ request, onSuccess }) {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const { refetchRequests } = useRequestState();

  // Form state
  const [selectedTechnician, setSelectedTechnician] = useState("");
  const [notes, setNotes] = useState("");
  const [selectedDate, setSelectedDate] = useState(undefined);
  const [selectedTime, setSelectedTime] = useState("10:30");
  const [validationError, setValidationError] = useState(null);

  const {
    data: technicians,
    loading,
    error: techError,
    fn: fetchTechnicians,
  } = useFetch(async (accessToken) => {
    const response = await axios.get(`${apiUrl}/v1/technicians`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return response.data;
  });

  const {
    fn: submitRequest,
    loading: submitting,
    error: submitError,
  } = useFetch(async (accessToken, payload) => {
    const response = await axios.patch(
      `${apiUrl}/v1/service-requests/${request.request_id}`,
      payload,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    return response.data;
  });

  useEffect(() => {
    fetchTechnicians();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedTechnician) {
      setValidationError("Please select a technician");
      return;
    }
    setValidationError(null);

    const payload = {
      status: "SCHEDULED",
      technician_id: selectedTechnician,
    };

    if (notes.trim()) {
      payload.description = notes.trim();
    }

    if (selectedDate && selectedTime) {
      const [hours, minutes] = selectedTime.split(":");
      const dateTime = new Date(selectedDate);
      dateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      payload.scheduled_date = dateTime.toISOString();
    }

    console.log("Submitting payload:", payload);

    try {
      await submitRequest(payload);

      if (refetchRequests) {
        await refetchRequests();
      }

      if (onSuccess) {
        onSuccess();
      }
    } catch {
      // error captured in submitError state
    }
  };

  const error =
    validationError ||
    (techError && "Failed to load technicians") ||
    (submitError &&
      (submitError.response?.data?.message ||
        submitError.message ||
        "Failed to create activity"));

  return (
    <div className="w-full max-w-md p-5 rounded-md shadow-sm bg-card">
      <form
        id="activity-form"
        className="gap-5 flex flex-col"
        onSubmit={handleSubmit}
      >
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="activity-notes">Notes</FieldLabel>
            <Textarea
              id="activity-notes"
              placeholder="Add notes about the activity or schedule"
              className="resize-none"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              disabled={submitting}
            />
          </Field>
        </FieldGroup>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="technician-select">Technician</FieldLabel>
            <Select
              value={selectedTechnician}
              onValueChange={setSelectedTechnician}
              disabled={loading || submitting}
            >
              <SelectTrigger id="technician-select">
                <SelectValue
                  placeholder={
                    loading
                      ? "Loading technicians..."
                      : techError
                      ? "Error loading technicians"
                      : "Select technician"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {(technicians || []).map((technician) => (
                  <SelectItem key={technician.id} value={technician.id}>
                    {technician.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {error && <p className="text-sm text-destructive mt-1">{error}</p>}
          </Field>
        </FieldGroup>
        <FieldGroup>
          <div className="flex gap-4">
            <div className="flex flex-col gap-3">
              <Label htmlFor="date-picker" className="px-1">
                Date
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    id="date-picker"
                    className="w-32 bg-card justify-between font-normal"
                    disabled={submitting}
                  >
                    {selectedDate
                      ? selectedDate.toLocaleDateString()
                      : "Select date"}
                    <ChevronDownIcon />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto overflow-hidden p-0"
                  align="start"
                >
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    captionLayout="dropdown"
                    onSelect={setSelectedDate}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="time-picker" className="px-1">
                Time
              </Label>
              <Input
                type="time"
                id="time-picker"
                step="1"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="bg-card appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                disabled={submitting}
              />
            </div>
          </div>
        </FieldGroup>
      </form>
    </div>
  );
}
