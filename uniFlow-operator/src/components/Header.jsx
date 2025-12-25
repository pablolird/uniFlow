export default function Header() {
  return (
    <thead className="block w-full bg-gray-200">
      <tr className="table w-full table-fixed h-10">
        <th className="font-light border-gray-300 p-2">Date</th>
        <th className="font-light border-gray-300 p-2">Company</th>
        <th className="font-light border-gray-300 p-2">Requester</th>
        <th className="font-light border-gray-300 p-2">Device Model</th>
        <th className="font-light border-gray-300 p-2">Description</th>
        <th className="font-light border-gray-300 p-2">Create Activity</th>
      </tr>
    </thead>
  );
}
