"use client";

import Link from "next/link";
import { updateConsentStatus, useConsentStatus } from "@/lib/consent";
import { hasThirdPartyScripts, siteConfig } from "@/lib/site-config";

export function CookieConsent() {
  const consent = useConsentStatus();

  if (!hasThirdPartyScripts() || consent === null || consent !== "unknown") return null;

  function accept() {
    updateConsentStatus("accepted");
  }

  function decline() {
    updateConsentStatus("declined");
  }

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie notice"
      className="cookie-consent"
    >
      <div className="cookie-consent__panel">
        <p className="cookie-consent__title">Cookies on {siteConfig.name}</p>
        <p className="cookie-consent__text">
          We only load optional analytics and advertising after you accept. Read our{" "}
          <Link href="/privacy" className="cookie-consent__link">
            Privacy Policy
          </Link>
          {" "}or change this any time in{" "}
          <Link href="/privacy#privacy-settings" className="cookie-consent__link">
            Privacy settings
          </Link>
          .
        </p>
        <div className="cookie-consent__actions">
          <button type="button" onClick={accept} className="cookie-consent__accept">
            Accept
          </button>
          <button type="button" onClick={decline} className="cookie-consent__learn">
            Decline
          </button>
          <Link href="/privacy" className="cookie-consent__learn">
            Learn more
          </Link>
        </div>
      </div>
    </div>
  );
}
