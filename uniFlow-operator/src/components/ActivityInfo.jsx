import { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChevronLeft, ChevronRight } from "lucide-react";

function formatStatus(status) {
  if (!status) return "—";
  return status
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatScheduledDate(isoString) {
  if (!isoString) return null;
  const date = new Date(isoString);
  return {
    date: date.toLocaleDateString(),
    time: date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  };
}

export default function ActivityInfo({ request }) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  const images = (request.technician_media || [])
    .filter((media) => media.kind === "image")
    .map((media) => {
      if (media.url.startsWith("http")) return media.url;
      return `${apiUrl}${media.url.startsWith("/") ? "" : "/"}${media.url}`;
    });

  const scheduled = formatScheduledDate(request.scheduled_date);

  const closeLightbox = (e) => {
    if (e) e.stopPropagation();
    setSelectedImageIndex(null);
  };

  const goToPrevious = (e) => {
    e.stopPropagation();
    setSelectedImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const goToNext = (e) => {
    e.stopPropagation();
    setSelectedImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  const handleKeyDown = (e) => {
    if (selectedImageIndex === null) return;
    if (e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      closeLightbox();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      goToPrevious(e);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      goToNext(e);
    }
  };

  useEffect(() => {
    if (selectedImageIndex !== null) {
      window.addEventListener("keydown", handleKeyDown, true);
      return () => window.removeEventListener("keydown", handleKeyDown, true);
    }
  }, [selectedImageIndex]);

  return (
    <div className="flex flex-col">
      <div className="max-w-xl">
        <Table>
          <TableBody>
            <TableRow className="h-min">
              <TableCell className="font-medium">Status</TableCell>
              <TableCell>{formatStatus(request.request_status)}</TableCell>
            </TableRow>

            {request.technician && (
              <TableRow className="h-min">
                <TableCell className="font-medium">Technician</TableCell>
                <TableCell>{request.technician}</TableCell>
              </TableRow>
            )}

            {scheduled && (
              <>
                <TableRow className="h-min">
                  <TableCell className="font-medium">Scheduled Date</TableCell>
                  <TableCell>{scheduled.date}</TableCell>
                </TableRow>
                <TableRow className="h-min">
                  <TableCell className="font-medium">Scheduled Time</TableCell>
                  <TableCell>{scheduled.time}</TableCell>
                </TableRow>
              </>
            )}

            {request.technician_notes && (
              <TableRow className="h-max">
                <TableCell className="font-medium">Notes</TableCell>
                <TableCell variant="paragraph">
                  {request.technician_notes}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="mt-4 w-[300px] flex justify-center items-center text-center">
        {images.length === 0 ? (
          <p className="text-sm text-muted-foreground">No technician media</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {images.map((imageUrl, index) => (
              <button
                key={index}
                onClick={() => setSelectedImageIndex(index)}
                className="relative aspect-square rounded-md overflow-hidden border-2 border-border hover:border-primary transition-colors cursor-pointer group"
              >
                <img
                  src={imageUrl}
                  alt={`Technician media ${index + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  onError={(e) => {
                    e.target.src =
                      'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23ddd" width="100" height="100"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EImage Error%3C/text%3E%3C/svg%3E';
                  }}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
              </button>
            ))}
          </div>
        )}
      </div>

      {selectedImageIndex !== null &&
        typeof document !== "undefined" &&
        ReactDOM.createPortal(
          <div
            className="fixed inset-0 z-100 bg-black/90 flex items-center justify-center"
            onClick={(e) => {
              e.stopPropagation();
              closeLightbox(e);
            }}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                closeLightbox(e);
              }}
              className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
              aria-label="Close"
            />

            {images.length > 1 && (
              <button
                onClick={goToPrevious}
                className="absolute left-4 text-white hover:text-gray-300 transition-colors z-10"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-10 h-10" />
              </button>
            )}

            <div
              className="max-w-[90vw] max-h-[90vh] flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={images[selectedImageIndex]}
                alt={`Technician media ${selectedImageIndex + 1}`}
                className="max-w-full max-h-[90vh] object-contain rounded-lg"
              />
            </div>

            {images.length > 1 && (
              <button
                onClick={goToNext}
                className="absolute right-4 text-white hover:text-gray-300 transition-colors z-10"
                aria-label="Next image"
              >
                <ChevronRight className="w-10 h-10" />
              </button>
            )}

            {images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm bg-black/50 px-3 py-1 rounded-full">
                {selectedImageIndex + 1} / {images.length}
              </div>
            )}
          </div>,
          document.body
        )}
    </div>
  );
}
