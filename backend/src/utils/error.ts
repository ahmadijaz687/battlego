export function createErrorResponse(error: unknown, message = 'Something went wrong') {
  return {
    error: message,
    details: error instanceof Error ? error.message : String(error),
    timestamp: new Date().toISOString(),
  };
}