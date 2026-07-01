"use client";

import { Button } from "@/components/ui/button";
import { updateConsentStatus, useConsentStatus } from "@/lib/consent";
import { hasThirdPartyScripts } from "@/lib/site-config";

function getConsentLabel(consent: ReturnType<typeof useConsentStatus>) {
  if (consent === "accepted") return "Optional analytics and ads are enabled.";
  if (consent === "declined") return "Optional analytics and ads are disabled.";
  if (consent === "unknown") return "No optional privacy choice has been saved yet.";
  return "Loading your privacy setting…";
}

export function PrivacySettingsControl({
  compact = false,
}: {
  compact?: boolean;
}) {
  const consent = useConsentStatus();

  if (!hasThirdPartyScripts()) return null;

  function accept() {
    updateConsentStatus("accepted");
  }

  function decline() {
    updateConsentStatus("declined", { reload: consent === "accepted" });
  }

  return (
    <div
      className={
        compact
          ? "rounded-[1.25rem] border border-[var(--line)] bg-[var(--surface-strong)] px-5 py-4 shadow-sm transition-colors duration-300"
          : "rounded-[1.5rem] border border-[var(--line)] bg-white px-5 py-5 shadow-[var(--shadow)]"
      }
    >
      <p
        className={
          compact
            ? "text-sm font-semibold text-[var(--forest-deep)]"
            : "text-base font-semibold text-[var(--forest-deep)]"
        }
      >
        Privacy settings
      </p>
      <p
        className={
          compact
            ? "mt-1 text-sm leading-6 text-[var(--muted)]"
            : "mt-2 text-sm leading-6 text-[var(--muted)]"
        }
      >
        {getConsentLabel(consent)}
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <Button
          type="button"
          size={compact ? "default" : "lg"}
          onClick={accept}
          disabled={consent === "accepted" || consent === null}
        >
          Allow optional cookies
        </Button>
        <Button
          type="button"
          variant={compact ? "secondary" : "secondary"}
          size={compact ? "default" : "lg"}
          onClick={decline}
          disabled={consent === "declined" || consent === null}
        >
          Keep them off
        </Button>
      </div>
      <p
        className={
          compact
            ? "mt-3 text-xs leading-5 text-[var(--muted)]"
            : "mt-3 text-xs leading-5 text-[var(--muted)]"
        }
      >
        Turning consent off after it was previously allowed reloads the page so optional third-party
        scripts stop loading on the next view.
      </p>
    </div>
  );
}
