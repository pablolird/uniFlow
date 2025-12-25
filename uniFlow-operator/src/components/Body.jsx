import Row from "./Row";

export default function Body({ overlay, overlayRequest }) {

  return (
      <tbody className="body-after-message bg-white block h-95 overflow-y-auto custom-scrollbar">
        {requests.map((request, i) => (
          <Row 
            key={i} 
            request={request}
            overlay={overlay}
            overlayRequest={overlayRequest}
          />
        ))}
      </tbody>
  );
}
