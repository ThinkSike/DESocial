export const formatEngagementNumber = (num?: number): string => {
  if (num === undefined || num === null) return "0";
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
};

export const getTimeAgo = (date: Date | string): string => {
  const d = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000);
  if (diffInSeconds < 60) return `${diffInSeconds}s`;
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d`;
  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) return `${diffInWeeks}w`;
  return d.toLocaleDateString();
};

export const formatMemberCount = (count: number): string => formatEngagementNumber(count);

const categoryColors: Record<string, string> = {
  academic: "#3B82F6",
  sports: "#EF4444",
  cultural: "#8B5CF6",
  technical: "#10B981",
  social: "#F59E0B",
  hobby: "#EC4899",
};

export const getCategoryColor = (type: string): string => {
  return categoryColors[type] || "#6B7280";
};