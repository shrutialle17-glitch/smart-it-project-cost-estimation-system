export const complexityLabel = (level) => {
  const labels = { low: 'Low', medium: 'Medium', high: 'High', enterprise: 'Enterprise' };
  return labels[level] || level;
};
export const complexityColor = (level) => {
  const colors = { low: 'bg-emerald-100 text-emerald-700', medium: 'bg-yellow-100 text-yellow-700', high: 'bg-orange-100 text-orange-700', enterprise: 'bg-red-100 text-red-700' };
  return colors[level] || 'bg-gray-100 text-gray-700';
};
export const statusColor = (status) => {
  const colors = { draft: 'bg-gray-100 text-gray-600', saved: 'bg-blue-100 text-blue-700', sent: 'bg-indigo-100 text-indigo-700', accepted: 'bg-emerald-100 text-emerald-700', rejected: 'bg-red-100 text-red-700' };
  return colors[status] || 'bg-gray-100 text-gray-700';
};
export const projectTypeLabel = (type) => {
  if (typeof type === 'object' && type !== null) return type.name || 'Unknown';
  const labels = { website: 'Website', mobile_app: 'Mobile App', web_application: 'Web Application', ecommerce_platform: 'E-Commerce Platform', custom_software: 'Custom Software' };
  return labels[type] || type;
};
