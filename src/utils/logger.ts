export function logEvent(
  type: "INFO" | "WARN" | "ERROR",
  message: string,
  meta?: Record<string, any>
) {
  console.log(
    JSON.stringify({
      timestamp: new Date().toISOString(),
      type,
      message,
      ...meta,
    })
  );
}
