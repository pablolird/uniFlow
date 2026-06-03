const API_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchTechnicians = async (accessToken) => {
  const [techRes, companyRes] = await Promise.all([
    fetch(`${API_URL}/v1/technicians`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    }),
    fetch(`${API_URL}/v1/companies`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    }),
  ]);

  if (!techRes.ok) throw new Error("Failed to fetch technicians");
  if (!companyRes.ok) throw new Error("Failed to fetch companies");

  const [technicians, companies] = await Promise.all([
    techRes.json(),
    companyRes.json(),
  ]);

  const companyMap = Object.fromEntries(companies.map((c) => [c.id, c.name]));

  return technicians.map((t) => ({
    ...t,
    company_name: companyMap[t.company_id] || t.company_id,
  }));
};
