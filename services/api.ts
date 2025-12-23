const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;
console.log(`BASE URL: ${API_BASE_URL}`)

export interface ServiceRequest {
  id: string;
  created_at: string;
  type: 'MAINTENANCE' | 'MALFUNCTION';
  status: 'PENDING' | 'ASSIGNED' | 'SCHEDULED' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  description_preview: string;
  client_media?: Array<{ url: string; kind: string }>;
  technician_media?: Array<{ url: string; kind: string }> | null;
  asset: {
    id: string;
    name: string;
    model: string;
    company_name: string;
    location_lng: string;
    location_lat: string;
    location_address: string;
  };
  client: {
    id: string;
    name: string;
    email: string;
  };
  technician?: {
    id: string;
    name: string;
  };
  technician_notes?: string | null;
  scheduled_date?: string | null;
}

export interface ServiceRequestsResponse {
  items: ServiceRequest[];
  nextCursor: string | null;
  hasMore: boolean;
  count: number;
}

export const fetchTechnicianServiceRequests = async (
  technicianId: string,
  status?: string[]
): Promise<ServiceRequestsResponse> => {
  try {
    let url = `${API_BASE_URL}/v1/technicians/${technicianId}/service-requests`;
    
    if (status && status.length > 0) {
      const statusParams = status.map(s => `status=${s}`).join('&');
      url += `?${statusParams}`;
    }

    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch service requests: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching service requests:', error);
    throw error;
  }
};