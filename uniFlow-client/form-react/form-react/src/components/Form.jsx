import React, { useRef, useState } from "react";

const Form = ({ device, id, setSuccess }) => {
  console.log(import.meta.env.VITE_API_BASE_URL);
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  const nameRef = useRef();
  const emailRef = useRef();
  const descriptionRef = useRef();
  const phoneRef = useRef();
  const mediaRef = useRef();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setUploadProgress(0);

    try {
      const files = mediaRef.current?.files;

      if (files && files.length > 3) {
        throw new Error("Do not attach more than 3 files.");
      }
      // Step 1: Submit the intake form (without media first)
      const payload = {
        type: "MAINTENANCE",
        description: descriptionRef.current.value,
        contact: {
          name: nameRef.current.value,
          email: emailRef.current.value,
          phone: phoneRef.current.value,
        },
        media: [],
      };

      const intakeResponse = await fetch(
        `${apiUrl}/v1/public/intake/${id}/request`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!intakeResponse.ok) {
        throw new Error("Failed to create service request");
      }

      const intakeData = await intakeResponse.json();
      const serviceRequestId = intakeData.request_id;

      // Step 2: Upload media files if any were selected

      if (files && files.length > 0) {
        const formData = new FormData();

        // Add all files to FormData
        for (let i = 0; i < files.length; i++) {
          formData.append("files", files[i]);
        }

        // Upload media to the service request
        const mediaResponse = await fetch(
          `${apiUrl}/v1/service-requests/${serviceRequestId}/client-media`,
          {
            method: "POST",
            body: formData,
          }
        );

        console.log(mediaResponse);

        if (!mediaResponse.ok) {
          throw new Error("Failed to upload media");
        }
      }

      setSuccess(true);
    } catch (err) {
      console.error("Error:", err);
      setError(err.message || "Failed to submit report. Please try again.");
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-2xl m-10 sm:p-8 p-4 w-full sm:h-auto sm:max-w-lg max-w-9/11">
      <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">
        🛠️ Report an Issue
      </h2>
      <div className="space-y-4">
        <div>
          <label
            htmlFor="company"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Company
          </label>
          <input
            type="text"
            id="company"
            value={device.company_name}
            readOnly
            className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100 text-gray-700 focus:outline-none cursor-not-allowed"
          />
        </div>

        <div>
          <label
            htmlFor="device"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Device Model
          </label>
          <input
            type="text"
            id="device"
            value={device.model}
            readOnly
            className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100 text-gray-700 focus:outline-none cursor-not-allowed"
          />
        </div>

        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Your Name
          </label>
          <input
            type="text"
            ref={nameRef}
            id="name"
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Your Phone Number
          </label>
          <input
            type="tel"
            ref={phoneRef}
            id="phone"
            required
            title="Please enter a valid phone number (7–15 digits, optional +, spaces, dashes, or parentheses)"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            ref={emailRef}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Problem Description
          </label>
          <textarea
            id="description"
            ref={descriptionRef}
            required
            rows="4"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
          ></textarea>
        </div>

        <div>
          <label
            htmlFor="photo"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Add Photos (optional)
          </label>
          <input
            type="file"
            ref={mediaRef}
            id="photo"
            multiple
            accept="image/*"
            className="w-full text-gray-700 border border-gray-300 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {uploadProgress > 0 && uploadProgress < 100 && (
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full mt-4 bg-blue-600 text-white font-semibold py-2 rounded-lg shadow hover:bg-blue-700 transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading
            ? uploadProgress > 0 && uploadProgress < 100
              ? `Uploading... ${uploadProgress}%`
              : "Submitting..."
            : "Submit Report"}
        </button>
      </div>
    </div>
  );
};

export default Form;
