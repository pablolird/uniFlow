import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Form from "../components/Form.jsx";
import axios from "axios";
import Success from "../components/Success.jsx";

export default function ReportForm() {
  
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  console.log(apiUrl);

  const { id } = useParams();
  const [device, setDevice] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false)



  useEffect(() => {
    async function fetchDevice() {
      try {
        const res = await axios.get(`${apiUrl}/v1/public/qr/asset/${id}`);
        console.log(res.data);
        setDevice(res.data);
      } catch (err) {
        if (err.response?.status === 404) setError("Device not found");
        else setError("Failed to fetch device info");
      } finally {
        setLoading(false);
      }
    }
    fetchDevice();
  }, [id, apiUrl]);

  if (loading) return <p>Loading device info...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (success) return <Success/>
  return <Form device={device} id={id} setSuccess={setSuccess}/>;
}
