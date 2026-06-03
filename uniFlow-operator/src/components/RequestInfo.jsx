import { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { useNavigate } from "react-router";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/StatusBadge";
import AssetLink from "@/components/AssetLink";
import {
  ChevronLeft,
  ChevronRight,
  GitBranch,
  ArrowUpRight,
} from "lucide-react";

export default function RequestInfo({ request, showStatus = false }) {
  const [images, setImages] = useState([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [loading, setLoading] = useState(false);
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();

  useEffect(() => {
    // Check if request has client_media array with images
    if (
      request.client_media &&
      Array.isArray(request.client_media) &&
      request.client_media.length > 0
    ) {
      setLoading(true);

      // Filter for images only and build full URLs
      const imageUrls = request.client_media
        .filter((media) => media.kind === "image")
        .map((media) => {
          // If URL is already a full URL, use it as is
          if (media.url.startsWith("http")) {
            return media.url;
          }
          // Otherwise, combine with API base URL
          return `${apiUrl}${media.url.startsWith("/") ? "" : "/"}${media.url}`;
        });

      setImages(imageUrls);
      setLoading(false);
    } else {
      setImages([]);
    }
  }, [request.client_media, apiUrl]);

  const openLightbox = (index) => {
    setSelectedImageIndex(index);
  };

  const closeLightbox = (e) => {
    if (e) {
      e.stopPropagation();
    }
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
      // Use capture phase to intercept the event before it reaches the Dialog
      window.addEventListener("keydown", handleKeyDown, true);
      return () => window.removeEventListener("keydown", handleKeyDown, true);
    }
  }, [selectedImageIndex]);

  return (
    <div className="flex flex-col justify-center">
      {request.parent_id && (
        <div className="max-w-xl mb-4 rounded-md border border-muted bg-card shadow-sm px-4 py-3 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <GitBranch className="w-4 h-4" />
            Follow-up Request
          </div>
          {request.followup_reason && (
            <p className="text-sm text-foreground">{request.followup_reason}</p>
          )}
          <Button
            variant="outline"
            size="sm"
            className="self-start"
            onClick={() => navigate(`/show_request/${request.parent_id}`)}
          >
            <ArrowUpRight className="w-4 h-4 mr-1" />
            View Original Request
          </Button>
        </div>
      )}
      {!request.parent_id && request.has_followups && (
        <div className="max-w-xl mb-4 rounded-md border border-muted bg-card shadow-sm px-4 py-3 flex items-center gap-2 text-sm text-muted-foreground">
          <GitBranch className="w-4 h-4" />
          This request has a follow-up
        </div>
      )}
      <div className="max-w-xl">
        <Table>
          <TableBody>
            {showStatus && (
              <TableRow className="h-min">
                <TableCell className="font-medium">Status</TableCell>
                <TableCell><StatusBadge status={request.request_status} /></TableCell>
              </TableRow>
            )}
            <TableRow className="h-min">
              <TableCell className="font-medium">Date</TableCell>
              <TableCell>{request.date}</TableCell>
            </TableRow>

            <TableRow className="h-min">
              <TableCell className="font-medium">Company</TableCell>
              <TableCell>{request.company}</TableCell>
            </TableRow>

            <TableRow className="h-min">
              <TableCell className="font-medium">Requester</TableCell>
              <TableCell>{request.requester}</TableCell>
            </TableRow>

            <TableRow className="h-min">
              <TableCell className="font-medium">Device Model</TableCell>
              <TableCell>
                <AssetLink model={request.device_model} id={request.asset_id} />
              </TableCell>
            </TableRow>

            <TableRow className="h-max">
              <TableCell className="font-medium">Description</TableCell>
              <TableCell variant={"paragraph"}>{request.description}</TableCell>
            </TableRow>
          </TableBody>
        </Table>{" "}
      </div>

      {/* Media Section */}
      <div className="mt-4 w-[300px] flex justify-center items-center text-center">
        {/* <p className="font-medium mb-2">Media:</p> */}

        {loading && (
          <p className="text-sm text-muted-foreground">Loading images...</p>
        )}

        {!loading && images.length === 0 && (
          <p className="text-sm text-muted-foreground">No images available</p>
        )}

        {!loading && images.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {images.map((imageUrl, index) => (
              <button
                key={index}
                onClick={() => openLightbox(index)}
                className="relative aspect-square rounded-md overflow-hidden border-2 border-border hover:border-primary transition-colors cursor-pointer group"
              >
                <img
                  src={imageUrl}
                  alt={`Media ${index + 1}`}
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

      {/* Lightbox Modal - Using Portal to escape parent constraints */}
      {selectedImageIndex !== null &&
        typeof document !== "undefined" &&
        ReactDOM.createPortal(
          <div
            className="fixed inset-0 z-100 bg-black/90 flex items-center justify-center"
            onClick={(e) => {
              e.stopPropagation();
              closeLightbox(e);
            }}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                e.preventDefault();
                e.stopPropagation();
                closeLightbox(e);
              }
            }}
          >
            {/* Close Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                closeLightbox(e);
              }}
              className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
              aria-label="Close"
            ></button>

            {/* Previous Button */}
            {images.length > 1 && (
              <button
                onClick={goToPrevious}
                className="absolute left-4 text-white hover:text-gray-300 transition-colors z-10"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-10 h-10" />
              </button>
            )}

            {/* Image */}
            <div
              className="max-w-[90vw] max-h-[90vh] flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={images[selectedImageIndex]}
                alt={`Media ${selectedImageIndex + 1}`}
                className="max-w-full max-h-[90vh] object-contain rounded-lg"
              />
            </div>

            {/* Next Button */}
            {images.length > 1 && (
              <button
                onClick={goToNext}
                className="absolute right-4 text-white hover:text-gray-300 transition-colors z-10"
                aria-label="Next image"
              >
                <ChevronRight className="w-10 h-10" />
              </button>
            )}

            {/* Image Counter */}
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
