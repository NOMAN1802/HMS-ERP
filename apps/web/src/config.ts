// Where the API lives. The web app and the API are separate origins (ADR-021); the browser
// sends the HttpOnly session cookie with `credentials: 'include'` and the API allows this origin.
// Implements: T-UI-02, ADR-021.
export const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4100').replace(
  /\/$/,
  '',
);

export const API_PREFIX = '/api/v1';
