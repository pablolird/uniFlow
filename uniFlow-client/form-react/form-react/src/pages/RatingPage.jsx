import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import RatingForm from "../components/RatingForm.jsx";

export default function RatingPage() {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const { token } = useParams();

  const [eligibility, setEligibility] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function checkEligibility() {
      try {
        const res = await fetch(`${apiUrl}/v1/public/intake/rate/${token}`);
        if (res.status === 404) {
          setError("This rating link is invalid or has expired.");
          return;
        }
        if (!res.ok) {
          setError("Unable to verify this rating link.");
          return;
        }
        const data = await res.json();
        setEligibility(data);
      } catch {
        setError("Unable to verify this rating link.");
      } finally {
        setLoading(false);
      }
    }
    checkEligibility();
  }, [token, apiUrl]);

  if (loading) return <p className="text-center mt-20 text-gray-500">Loading...</p>;

  if (error)
    return (
      <div className="flex justify-center items-center h-dvh">
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg text-center">
          {error}
        </div>
      </div>
    );

  if (eligibility?.already_rated || success)
    return (
      <div className="text-center h-dvh flex justify-center items-center text-gray-700">
        {success
          ? "Thank you for your feedback!"
          : "You have already submitted a rating for this service."}
      </div>
    );

  if (!eligibility?.eligible)
    return (
      <div className="flex justify-center items-center h-dvh">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-6 py-4 rounded-lg text-center">
          This service request is not ready for rating yet.
        </div>
      </div>
    );

  return <RatingForm token={token} setSuccess={setSuccess} />;
}
