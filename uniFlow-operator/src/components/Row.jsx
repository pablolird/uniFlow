import { useState } from "react";
import AssetLink from "@/components/AssetLink";

export default function Row({ request, overlay, overlayRequest }) {
  function handleClick() {
    setHidden(prev => setHidden(!prev))
  }

  const [hidden, setHidden] = useState(true)
  

  return (
    <tr className="table w-full table-fixed h-10">
      <td className="border-b bg-white border-gray-300 p-7">{request.date}</td>
      <td className="border-b bg-white border-gray-300 p-2">
        {request.company}
      </td>
      <td className="border-b bg-white border-gray-300 p-2">
        {request.requester}
      </td>
      <td className="border-b bg-white border-gray-300 p-2">
        <AssetLink model={request.device_model} id={request.asset_id} />
      </td>
      <td className="border-b bg-white border-gray-300 p-2 max-w-xs overflow-hidden">
        {request.description}
      </td>
      <td className="border-b bg-white border-gray-300 p-2">
        <div className="button-wrapper flex justify-center">
          <SubmitActivity
            request={request}
          />
        </div>
      </td>
    </tr>
  );
}
