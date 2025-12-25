import { useState } from "react"; // Import useState
import { useRequestState } from "../RequestContext";

export default function Form() {
  const { handleAppRequest } = useRequestState();

  // State to hold the data for the new request
  const [formData, setFormData] = useState({
    date: "",
    company: "",
    requester: "",
    deviceModel: "",
    description: "",
  });

  // Update state when user types in an input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent page reload
    handleAppRequest(formData); // Pass the form data (the "JSON") up to App
    // Clear the form for the next entry
    setFormData({
      date: "",
      company: "",
      requester: "",
      deviceModel: "",
      description: "",
    });
  };

  return (
    <form
      id="requestForm"
      className="max-w-md mx-auto bg-white p-6 rounded-2xl shadow-md space-y-4"
      onSubmit={handleSubmit}
    >
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">
        Device Request Form
      </h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Date
        </label>
        <input
          type="date"
          name="date"
          required
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={formData.date}
          onChange={handleChange}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Company
        </label>
        <input
          type="text"
          name="company"
          required
          placeholder="Enter company name"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={formData.company}
          onChange={handleChange}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Requester
        </label>
        <input
          type="text"
          name="requester"
          required
          placeholder="Your name"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={formData.requester}
          onChange={handleChange}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Device Model
        </label>
        <input
          type="text"
          name="deviceModel"
          required
          placeholder="e.g. AC Premium"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={formData.deviceModel}
          onChange={handleChange}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          name="description"
          rows="3"
          required
          placeholder="Describe the issue or request..."
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={formData.description}
          onChange={handleChange}
        ></textarea>
      </div>

      <button
        type="submit"
        className="cursor-pointer w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Create JSON
      </button>
    </form>
  );
}
