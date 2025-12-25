// RequestContext.jsx
import React, {
  createContext,
  useEffect,
  useContext,
  useState,
  useRef,
} from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { toast } from "sonner";
import useFetch from "./hooks/UseFetch";

const RequestContext = createContext();

const RequestProvider = ({ children }) => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const socketRef = useRef(null);
  const [isSocketConnected, setIsSocketConnected] = useState(false);

  const fetchRequests = async () => {
    const res = await axios.get(`${apiUrl}/v1/service-requests`);
    console.log("Fetched requests:", res);
    const items = res.data.items.map((item) => {
      const date = new Date(item.created_at);
      const formatted = `${(date.getMonth() + 1)
        .toString()
        .padStart(2, "0")}/${date
        .getDate()
        .toString()
        .padStart(2, "0")}/${date.getFullYear()}`;
      return {
        date: formatted,
        request_id: item.id,
        request_status: item.status,
        request_type: item.type,
        company: item.asset.company_name,
        requester: item.client.name,
        device_model: item.asset.model,
        description: item.description_preview,
        client_media: item.client_media || [],
        technician_media: item.technician_media || [],
        technician: item.technician ? item.technician.name : null,
        technician_notes: item.technician_notes || null,
        scheduled_date: item.scheduled_date || null,
      };
    });
    return items;
  };

  const {
    data: requests,
    loading,
    error,
    fn: fetchData,
  } = useFetch(fetchRequests);
  const [localRequests, setLocalRequests] = useState([]);

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, []);

  // Sync fetched requests into our localRequests state
  useEffect(() => {
    if (requests) setLocalRequests(requests);
  }, [requests]);

  // WebSocket setup and cleanup
  useEffect(() => {
    // Initialize socket connection
    socketRef.current = io(apiUrl, {
      transports: ["websocket", "polling"],
    });

    const socket = socketRef.current;

    // Connection event handlers
    socket.on("connect", () => {
      console.log("✅ WebSocket connected:", socket.id);
      setIsSocketConnected(true);

      // Join global room to receive all updates
      socket.emit("joinRoom", "global", (response) => {
        console.log("📡 Joined global room:", response);
      });
    });

    socket.on("disconnect", () => {
      console.log("❌ WebSocket disconnected");
      setIsSocketConnected(false);
    });

    socket.on("connect_error", (error) => {
      console.error("WebSocket connection error:", error);
      setIsSocketConnected(false);
    });

    // Listen for service request updates
    socket.on("service-request.updated", (data) => {
      console.log("🔔 Service request updated:", data);
      handleServiceRequestUpdate(data);
    });

    // Cleanup on unmount
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [apiUrl]);

  const handleServiceRequestUpdate = async (updateData) => {
    console.log("Processing update:", updateData);

    let requestId;
    let wsRequest = null;

    // 1️⃣ Normalize incoming WS payload
    if (updateData.type === "SERVICE_REQUEST_CREATED") {
      requestId = updateData.id;
    } else if (updateData.serviceRequest) {
      requestId = updateData.serviceRequest.id;
      wsRequest = updateData.serviceRequest;
    } else if (updateData.id) {
      requestId = updateData.id;
    }

    if (updateData.type === "CLIENT_MEDIA_ADDED") {
      const requestId = updateData.serviceRequestId;

      setLocalRequests((prev) => {
        const existingIndex = prev.findIndex((r) => r.request_id === requestId);

        if (existingIndex !== -1) {
          const updated = [...prev];
          updated[existingIndex] = {
            ...updated[existingIndex],
            client_media: updateData.client_media,
          };

          toast("Media Added to Request", {
            description: `${updateData.client_media.length} file(s) added`,
            action: {
              label: "Dismiss",
              onClick: () => {},
            },
          });

          return updated;
        }

        return prev;
      });

      return;
    }

        if (updateData.type === "TECHNICIAN_MEDIA_ADDED") {
      const requestId = updateData.serviceRequestId;

      setLocalRequests((prev) => {
        const existingIndex = prev.findIndex((r) => r.request_id === requestId);

        if (existingIndex !== -1) {
          const updated = [...prev];
          updated[existingIndex] = {
            ...updated[existingIndex],
            technician_media: updateData.technician_media,
          };

          toast("Media Added to Request", {
            description: `${updateData.technician_media.length} file(s) added`,
            action: {
              label: "Dismiss",
              onClick: () => {},
            },
          });

          return updated;
        }

        return prev;
      });

      return;
    }

    if (!requestId) {
      console.error("No request ID found in update data:", updateData);
      return;
    }

    try {
      let apiRequest = null;

      // 2️⃣ Fetch from API ONLY if WS payload is incomplete
      if (!wsRequest || !wsRequest.asset || !wsRequest.client) {
        const response = await axios.get(
          `${apiUrl}/v1/service-requests/${requestId}`
        );
        apiRequest = response.data;
      }

      // 3️⃣ Merge WS data OVER API data
      const item = {
        ...(apiRequest || {}),
        ...(wsRequest || {}),
      };

      // 4️⃣ Format date
      const createdDate = new Date(item.created_at);
      const formattedDate = `${(createdDate.getMonth() + 1)
        .toString()
        .padStart(2, "0")}/${createdDate
        .getDate()
        .toString()
        .padStart(2, "0")}/${createdDate.getFullYear()}`;

      // 5️⃣ Normalize for UI
      const formattedRequest = {
        date: formattedDate,
        request_id: item.id,
        request_status: item.status,
        request_type: item.type,
        company: item.asset?.company_name || item.asset?.company.name || null,
        requester: item.client?.name || null,
        device_model: item.asset?.model || null,
        description: item.description,
        client_media: item.client_media || [],
        technician_media: item.technician_media || [],
        technician: item.technician?.name || null,
        technician_notes: item.technician_notes || null,
        scheduled_date: item.scheduled_date || null,
      };

      // 6️⃣ Update local state
      setLocalRequests((prev) => {
        const index = prev.findIndex((r) => r.request_id === requestId);

        if (index !== -1) {
          const updated = [...prev];
          updated[index] = formattedRequest;

          toast("Service Request Updated", {
            description: `${formattedRequest.request_type} - ${formattedRequest.device_model}`,
          });

          return updated;
        }

        toast("New Service Request", {
          description: `${formattedRequest.request_type} from ${formattedRequest.requester}`,
        });

        return [formattedRequest, ...prev];
      });
    } catch (error) {
      console.error("Error processing service request update:", error);
      fetchData(); // safe fallback
    }
  };

  const handleAppRequest = (newRequestData) => {
    setLocalRequests((prev) => [...prev, newRequestData]);
  };

  if (loading) return <p>Loading device info...</p>;
  if (error) return <p style={{ color: "red" }}>{error.message}</p>;

  return (
    <RequestContext.Provider
      value={{
        requests: localRequests,
        handleAppRequest,
        isSocketConnected,
        socketRef,
        refetchRequests: fetchData, // Expose refetch function
      }}
    >
      {children}
    </RequestContext.Provider>
  );
};

export const useRequestState = () => useContext(RequestContext);

export default RequestProvider;
