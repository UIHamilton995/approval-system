export const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  return {
    date: date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }),
    time: date.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit'
    })
  };
};

export const generateTrackingCode = (index) => {
  const prefix = "EXC";
  const timestamp = Date.now().toString().slice(-6);
  const sequence = (index + 1).toString().padStart(4, '0');
  return `${prefix}-${timestamp}-${sequence}`;
};

