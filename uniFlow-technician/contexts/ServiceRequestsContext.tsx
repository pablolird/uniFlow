import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  fetchTechnicianServiceRequests,
  ServiceRequest,
} from "../services/api";
import { useSession } from "./AuthContext";

interface ServiceRequestsContextType {
  scheduledRequests: ServiceRequest[];
  finishedRequests: ServiceRequest[];
  loading: boolean;
  error: string | null;
  refreshRequests: () => Promise<void>;
}

const ServiceRequestsContext = createContext<
  ServiceRequestsContextType | undefined
>(undefined);

export const useServiceRequests = () => {
  const context = useContext(ServiceRequestsContext);
  if (!context) {
    throw new Error(
      "useServiceRequests must be used within a ServiceRequestsProvider",
    );
  }
  return context;
};

interface ServiceRequestsProviderProps {
  children: ReactNode;
}

export const ServiceRequestsProvider: React.FC<
  ServiceRequestsProviderProps
> = ({ children }) => {
  const { isAuthenticated, accessToken, technicianId } = useSession();
  const [scheduledRequests, setScheduledRequests] = useState<ServiceRequest[]>(
    [],
  );
  const [finishedRequests, setFinishedRequests] = useState<ServiceRequest[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRequests = async () => {
    if (!technicianId) {
      setError("Technician ID not available");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Fetch scheduled requests (PENDING, SCHEDULED, IN_PROGRESS)
      const scheduledResponse = await fetchTechnicianServiceRequests(
        technicianId,
        ["PENDING", "SCHEDULED", "IN_PROGRESS"],
        accessToken,
      );

      // Fetch finished requests (RESOLVED, CLOSED)
      const finishedResponse = await fetchTechnicianServiceRequests(
        technicianId,
        ["RESOLVED", "CLOSED"],
        accessToken,
      );

      setScheduledRequests(scheduledResponse.items);
      setFinishedRequests(finishedResponse.items);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch requests");
      console.error("Error fetching requests:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchRequests();
    }
  }, [isAuthenticated]);

  const refreshRequests = async () => {
    await fetchRequests();
  };

  return (
    <ServiceRequestsContext.Provider
      value={{
        scheduledRequests,
        finishedRequests,
        loading,
        error,
        refreshRequests,
      }}
    >
      {children}
    </ServiceRequestsContext.Provider>
  );
};
