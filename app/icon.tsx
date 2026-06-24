import { ImageResponse } from "next/og";

export const size = { width: 128, height: 128 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#2a6b52",
          borderRadius: 28,
        }}
      >
        <svg width="88" height="88" viewBox="0 0 128 128" fill="none">
          <circle cx="42" cy="42" r="12" fill="#fbbf24" />
          <circle cx="64" cy="30" r="12" fill="#f59e0b" />
          <circle cx="86" cy="42" r="12" fill="#fbbf24" />
          <circle cx="52" cy="72" r="12" fill="#efd6bb" />
          <circle cx="76" cy="72" r="12" fill="#efd6bb" />
          <path
            d="M40 84c0-13.255 10.745-24 24-24s24 10.745 24 24c0 12.15-10.745 20-24 20s-24-7.85-24-20Z"
            fill="#fbbf24"
          />
        </svg>
      </div>
    ),
    size,
  );
}
