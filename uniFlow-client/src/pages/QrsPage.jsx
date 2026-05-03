import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import axios from "axios";

export default function QrsPage() {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(`${apiUrl}/v1/public/assets`)
      .then((res) => setAssets(res.data))
      .catch(() => setError("Failed to load assets"))
      .finally(() => setLoading(false));
  }, [apiUrl]);

  const baseUrl = window.location.origin;

  if (loading)
    return (
      <div className="flex h-dvh items-center justify-center text-stone-600 text-xl">
        Loading assets...
      </div>
    );

  if (error)
    return (
      <div className="flex h-dvh items-center justify-center text-red-500 text-xl">
        {error}
      </div>
    );

  return (
    <div className="min-h-dvh w-dvw bg-stone-50 p-8">
      <h1 className="text-2xl text-center font-bold text-stone-800 mb-2">
        Asset QR Codes
      </h1>
      <p className="text-sm text-stone-400 text-center mb-8">
        Open this page from the LAN IP to generate scannable QR codes for
        devices on the same network.
      </p>

      {assets.length === 0 && (
        <p className="text-stone-500 text-center mt-16">No assets found.</p>
      )}

      <div className="flex flex-col gap-4 max-w-2xl mx-auto">
        {assets.map((asset) => (
          <div
            key={asset.id}
            className="flex items-center gap-8 bg-white border border-stone-200 rounded-xl p-6 shadow-sm"
          >
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-stone-800 text-lg truncate">
                {asset.company_name}
              </p>
              <p className="text-stone-600 truncate">{asset.name}</p>
              <p className="text-stone-500 text-sm truncate">
                Model: {asset.model}
              </p>
              <p className="text-stone-500 text-sm truncate">
                S/N: {asset.serial_number}
              </p>
              <p className="text-stone-400 text-sm truncate mt-1">
                {asset.location_address}
              </p>
              <a
                href={`${baseUrl}/v1/assets/${asset.qr_token}`}
                target="_blank"
                rel="noreferrer"
                className="inline-block mt-3 text-sm text-blue-500 hover:underline"
              >
                Go to form page →
              </a>
            </div>
            <div className="shrink-0">
              <QRCodeSVG
                value={`${baseUrl}/v1/assets/${asset.qr_token}`}
                size={120}
                bgColor="#ffffff"
                fgColor="#1c1917"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
