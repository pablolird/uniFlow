export const fetchAssets = async () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const res = await fetch(`${apiUrl}/v1/public/assets`);

  if (!res.ok) {
    throw new Error("Network response was not ok");
  }

  return res.json();
};
