export function checkFileType(file: File): boolean {
  const allowed = ['jpg', 'gif', 'png', 'jpeg'];
  const extension = file.name.split('.').pop()?.toLowerCase() || '';
  return allowed.includes(extension);
}

/**
 * Recursively removes properties with undefined values from an object/array and its nested structures
 * @template T - The type of the input data structure
 * @param {T} obj - The input object or array to clean
 * @returns {T} A new object or array with undefined properties removed, maintaining the original type
 */
export function removeUndefined<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  // Handle arrays
  if (Array.isArray(obj)) {
    return obj.map(item => removeUndefined(item)) as T;
  }

  return Object.fromEntries(
    Object.entries(obj)
      .filter(([_, value]) => value !== undefined)
      .map(([key, value]) => [key, removeUndefined(value)])
  ) as T;
}
