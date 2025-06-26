export const getStatusColor = (status) => {
  const colors = {
    Queued: "bg-yellow-200 text-yellow-900",
    Paid: "bg-green-200 text-green-900",
  };
  return colors[status] || "bg-red-200 text-gray-800";
}