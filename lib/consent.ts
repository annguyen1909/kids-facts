import { useSyncExternalStore } from "react";

export const CONSENT_KEY = "afk-cookie-consent";
export const CONSENT_EVENT = "afk-cookie-consent-change";
const CONSENT_COOKIE_MAX_AGE = 60 * 60 * 24 * 180;

export type ConsentStatus = "unknown" | "accepted" | "declined";
export type ConsentSnapshot = ConsentStatus | null;

export function parseConsentStatus(value?: string | null): ConsentStatus {
  if (value === "accepted" || value === "declined") {
    return value;
  }

  return "unknown";
}

function readConsentCookie(): ConsentStatus {
  if (typeof document === "undefined") return "unknown";

  const cookieValue = document.cookie
    .split("; ")
    .find((entry) => entry.startsWith(`${CONSENT_KEY}=`))
    ?.split("=")
    .slice(1)
    .join("=");

  return parseConsentStatus(cookieValue ? decodeURIComponent(cookieValue) : undefined);
}

function readStoredConsent(): ConsentStatus {
  if (typeof window === "undefined") return "unknown";

  const stored = parseConsentStatus(window.localStorage.getItem(CONSENT_KEY));
  if (stored !== "unknown") {
    return stored;
  }

  return readConsentCookie();
}

function subscribeToConsent(callback: () => void) {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  const notify = () => callback();

  window.addEventListener("storage", notify);
  window.addEventListener(CONSENT_EVENT, notify);

  return () => {
    window.removeEventListener("storage", notify);
    window.removeEventListener(CONSENT_EVENT, notify);
  };
}

export function useConsentStatus() {
  return useSyncExternalStore(subscribeToConsent, readStoredConsent, () => null);
}

function clearThirdPartyCookies() {
  if (typeof document === "undefined") return;
  const cookies = document.cookie.split(";");
  const hostname = window.location.hostname;
  const parts = hostname.split(".");
  const domains: string[] = [hostname, `.${hostname}`];

  if (parts.length > 2) {
    const mainDomain = parts.slice(-2).join(".");
    domains.push(mainDomain);
    domains.push(`.${mainDomain}`);
  }

  for (const cookie of cookies) {
    const name = cookie.split("=")[0].trim();
    if (
      name.startsWith("_ga") ||
      name.startsWith("_gid") ||
      name.startsWith("_gat") ||
      name === "__gads" ||
      name === "__gpi" ||
      name === "__gjsid"
    ) {
      for (const domain of domains) {
        document.cookie = `${name}=; Path=/; Domain=${domain}; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Lax`;
      }
      document.cookie = `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Lax`;
    }
  }
}

export function updateConsentStatus(
  status: Exclude<ConsentStatus, "unknown">,
  options?: { reload?: boolean },
) {
  if (typeof window === "undefined") return;

  if (status === "declined") {
    clearThirdPartyCookies();
  }

  window.localStorage.setItem(CONSENT_KEY, status);
  document.cookie =
    `${CONSENT_KEY}=${encodeURIComponent(status)}; ` +
    `Max-Age=${CONSENT_COOKIE_MAX_AGE}; Path=/; SameSite=Lax`;
  window.dispatchEvent(new Event(CONSENT_EVENT));

  if (options?.reload) {
    window.location.reload();
  }
}
