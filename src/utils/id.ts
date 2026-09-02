/**
 * Generates a collision-resistant unique identifier for dynamic entities like filters.
 */
export const generateUniqueId = (prefix = 'id'): string => {
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 7);
  return `${prefix}_${timestamp}_${randomStr}`;
};
