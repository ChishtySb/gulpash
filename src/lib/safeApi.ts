/**
 * Safe API response utility
 * Enforces safe HTTP status inspection, Content-Type checking, and resilient parsing.
 * Prevents non-JSON infrastructure errors (e.g., Vercel 500 plain text "A server error has occurred")
 * from triggering client-side JSON.parse syntax errors.
 */

export interface SafeApiResponse<T = any> {
  success: boolean;
  status: number;
  data: T | null;
  error?: string;
  code?: string;
}

export async function safeFetchJson<T = any>(
  input: RequestInfo | URL,
  init?: RequestInit,
  fallbackMessage = 'Notification service is temporarily unavailable. Please retry.'
): Promise<SafeApiResponse<T>> {
  try {
    const res = await fetch(input, init);
    const contentType = res.headers.get('content-type') || '';
    const isJson = contentType.toLowerCase().includes('application/json');

    let parsedBody: any = null;
    let textBody = '';

    if (isJson) {
      try {
        parsedBody = await res.json();
      } catch (parseErr) {
        console.warn('[SafeAPI] Failed to parse JSON response body:', parseErr);
        parsedBody = null;
      }
    } else {
      try {
        textBody = (await res.text()).trim();
      } catch {
        textBody = '';
      }
    }

    if (!res.ok) {
      // Extract structured error message if provided by server
      const serverError =
        parsedBody && typeof parsedBody === 'object'
          ? (parsedBody.error || parsedBody.message)
          : null;

      const code =
        parsedBody && typeof parsedBody === 'object' ? parsedBody.code : undefined;

      const displayError = serverError || fallbackMessage;

      if (textBody && !serverError) {
        console.warn(`[SafeAPI] Non-JSON server failure (${res.status}):`, textBody.slice(0, 160));
      }

      return {
        success: false,
        status: res.status,
        data: parsedBody,
        error: displayError,
        code
      };
    }

    // Success response: prefer parsed JSON, fallback to text if non-empty
    const finalData = parsedBody !== null ? parsedBody : (textBody ? (textBody as any) : null);
    return {
      success: true,
      status: res.status,
      data: finalData
    };
  } catch (netErr: any) {
    console.warn('[SafeAPI] Network exception during request:', netErr);
    return {
      success: false,
      status: 0,
      data: null,
      error: fallbackMessage,
      code: 'NETWORK_ERROR'
    };
  }
}
