import { useRef, useState } from "react";

const RatingForm = ({ token, setSuccess }) => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  const [score, setScore] = useState(0);
  const [hovered, setHovered] = useState(0);
  const commentRef = useRef();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (score === 0) {
      setError("Please select a star rating before submitting.");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${apiUrl}/v1/public/intake/rate/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          score,
          comment: commentRef.current.value || undefined,
        }),
      });

      if (res.status === 400) {
        const data = await res.json();
        throw new Error(data.message || "This request cannot be rated right now.");
      }
      if (!res.ok) {
        throw new Error("Failed to submit rating. Please try again.");
      }

      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-dvh">
      <div className="bg-white shadow-lg rounded-2xl m-10 sm:p-8 p-4 w-full sm:max-w-lg max-w-9/11">
        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-2">
          Rate the Service
        </h2>
        <p className="text-sm text-gray-500 text-center mb-6">
          How would you rate the service you received?
        </p>

        <div className="space-y-6">
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setScore(star)}
                onMouseEnter={() => setHovered(star)}
                onMouseLeave={() => setHovered(0)}
                className="text-4xl transition-transform duration-100 hover:scale-110 focus:outline-none"
                aria-label={`${star} star`}
              >
                <span className={(hovered || score) >= star ? "text-yellow-400" : "text-gray-300"}>
                  ★
                </span>
              </button>
            ))}
          </div>

          <div>
            <label
              htmlFor="comment"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Comment <span className="text-gray-400">(optional)</span>
            </label>
            <textarea
              id="comment"
              ref={commentRef}
              rows="4"
              placeholder="Tell us about your experience..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            />
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full mt-2 bg-blue-600 text-white font-semibold py-2 rounded-lg shadow hover:bg-blue-700 transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Submitting..." : "Submit Rating"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RatingForm;
