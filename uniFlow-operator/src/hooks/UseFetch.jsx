import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

const useFetch = (cb, options = {}) => {
  // value={{ user, accessToken, authLoading, isAuthenticated, login }
  const { accessToken } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fn = async (...args) => {
    setLoading(true);
    setError(null);
    try {
      const response = await cb(accessToken, ...args);
      setData(response);
      return response;
    } catch (error) {
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, fn };
};

export default useFetch;
