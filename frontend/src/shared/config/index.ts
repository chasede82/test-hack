export const config = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL || "http://172.30.1.92:8081/api",
  wsUrl: process.env.NEXT_PUBLIC_WS_URL || "http://172.30.1.92:8081",
} as const;
