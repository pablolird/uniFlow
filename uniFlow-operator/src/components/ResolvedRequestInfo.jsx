import { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ResolvedRequestInfo({ request }) {
  const [clientImages, setClientImages] = useState([]);
  const [technicianImages, setTechnicianImages] = useState([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [currentGallery, setCurrentGallery] = useState(null); // 'client' or 'technician'
  const [loading, setLoading] = useState(false);
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    setLoading(true);
    
    // Process client media
    if (request.client_media && Array.isArray(request.client_media) && request.client_media.length > 0) {
      const clientImageUrls = request.client_media
        .filter(media => media.kind === 'image')
        .map(media => {
          if (media.url.startsWith('http')) {
            return media.url;
          }
          return `${apiUrl}${media.url.startsWith('/') ? '' : '/'}${media.url}`;
        });
      setClientImages(clientImageUrls);
    } else {
      setClientImages([]);
    }

    // Process technician media
    if (request.technician_media && Array.isArray(request.technician_media) && request.technician_media.length > 0) {
      const technicianImageUrls = request.technician_media
        .filter(media => media.kind === 'image')
        .map(media => {
          if (media.url.startsWith('http')) {
            return media.url;
          }
          return `${apiUrl}${media.url.startsWith('/') ? '' : '/'}${media.url}`;
        });
      setTechnicianImages(technicianImageUrls);
    } else {
      setTechnicianImages([]);
    }
    
    setLoading(false);
  }, [request.client_media, request.technician_media, apiUrl]);

  const openLightbox = (index, gallery) => {
    setSelectedImageIndex(index);
    setCurrentGallery(gallery);
  };

  const closeLightbox = (e) => {
    if (e) {
      e.stopPropagation();
    }
    setSelectedImageIndex(null);
    setCurrentGallery(null);
  };

  const getCurrentImages = () => {
    return currentGallery === 'client' ? clientImages : technicianImages;
  };

  const goToPrevious = (e) => {
    e.stopPropagation();
    const images = getCurrentImages();
    setSelectedImageIndex((prev) => 
      prev > 0 ? prev - 1 : images.length - 1
    );
  };

  const goToNext = (e) => {
    e.stopPropagation();
    const images = getCurrentImages();
    setSelectedImageIndex((prev) => 
      prev < images.length - 1 ? prev + 1 : 0
    );
  };

  const handleKeyDown = (e) => {
    if (selectedImageIndex === null) return;
    
    if (e.key === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      closeLightbox();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      goToPrevious(e);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      goToNext(e);
    }
  };

  useEffect(() => {
    if (selectedImageIndex !== null) {
      window.addEventListener('keydown', handleKeyDown, true);
      return () => window.removeEventListener('keydown', handleKeyDown, true);
    }
  }, [selectedImageIndex, currentGallery]);

  const renderImageGallery = (images, galleryType, title) => {
    if (loading) {
      return <p className="text-sm text-muted-foreground">Loading images...</p>;
    }
    
    if (images.length === 0) {
      return <p className="text-sm text-muted-foreground">No images available</p>;
    }
    
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {images.map((imageUrl, index) => (
          <button
            key={index}
            onClick={() => openLightbox(index, galleryType)}
            className="relative aspect-square rounded-md overflow-hidden border-2 border-border hover:border-primary transition-colors cursor-pointer group"
          >
            <img
              src={imageUrl}
              alt={`${title} ${index + 1}`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
              onError={(e) => {
                e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23ddd" width="100" height="100"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EImage Error%3C/text%3E%3C/svg%3E';
              }}
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div>
      <Table>
        <TableBody>
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
            <TableCell>{request.device_model}</TableCell>
          </TableRow>

          <TableRow className="h-min">
            <TableCell className="font-medium">Description</TableCell>
            <TableCell>{request.description}</TableCell>
          </TableRow>
        </TableBody>
      </Table>

      {/* Client Media Section */}
      <div className="mt-4 w-[300px]">
        <p className="font-medium mb-2">Client Media:</p>
        {renderImageGallery(clientImages, 'client', 'Client Media')}
      </div>

      {/* Lightbox Modal */}
      {selectedImageIndex !== null && currentGallery && typeof document !== 'undefined' && 
        ReactDOM.createPortal(
        <div
          className="fixed inset-0 z-100 bg-black/90 flex items-center justify-center"
          onClick={(e) => {
            e.stopPropagation();
            closeLightbox(e);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              e.preventDefault();
              e.stopPropagation();
              closeLightbox(e);
            }
          }}
        >
          {/* Previous Button */}
          {getCurrentImages().length > 1 && (
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
              src={getCurrentImages()[selectedImageIndex]}
              alt={`Media ${selectedImageIndex + 1}`}
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
            />
          </div>

          {/* Next Button */}
          {getCurrentImages().length > 1 && (
            <button
              onClick={goToNext}
              className="absolute right-4 text-white hover:text-gray-300 transition-colors z-10"
              aria-label="Next image"
            >
              <ChevronRight className="w-10 h-10" />
            </button>
          )}

          {/* Image Counter */}
          {getCurrentImages().length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm bg-black/50 px-3 py-1 rounded-full">
              {selectedImageIndex + 1} / {getCurrentImages().length}
            </div>
          )}
        </div>,
        document.body
      )}
    </div>
  );
}