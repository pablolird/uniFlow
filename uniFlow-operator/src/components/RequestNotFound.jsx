import RequestPageLayout from "@/components/RequestPageLayout";

export default function RequestNotFound() {
  return (
    <RequestPageLayout>
      <div className="flex-1 flex items-center justify-center">
        <p className="text-sm text-muted-foreground">Request not found.</p>
      </div>
    </RequestPageLayout>
  );
}
