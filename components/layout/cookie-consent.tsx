"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { hasThirdPartyScripts, siteConfig } from "@/lib/site-config";

const CONSENT_KEY = "afk-cookie-consent";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!hasThirdPartyScripts()) return;
    const stored = window.localStorage.getItem(CONSENT_KEY);
    if (!stored) setVisible(true);
  }, []);

  if (!visible) return null;

  function accept() {
    window.localStorage.setItem(CONSENT_KEY, "accepted");
    setVisible(false);
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
          We use cookies for basic analytics and, when enabled, advertising that helps keep the
          site free. Read our{" "}
          <Link href="/privacy" className="cookie-consent__link">
            Privacy Policy
          </Link>
          .
        </p>
        <div className="cookie-consent__actions">
          <button type="button" onClick={accept} className="cookie-consent__accept">
            Got it
          </button>
          <Link href="/privacy" className="cookie-consent__learn">
            Learn more
          </Link>
        </div>
      </div>
    </div>
  );
}
