const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Ids are UUIDs: anything else cannot exist in the database
export function isUuid(value) {
  return typeof value === 'string' && UUID.test(value);
}
