import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0f172a",
          color: "#fff",
          padding: "56px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "18px",
            color: "#fbbf24",
            fontSize: 30,
            fontWeight: 700,
          }}
        >
          <div
            style={{
              width: 58,
              height: 58,
              borderRadius: 9999,
              background: "#fbbf24",
              color: "#0f172a",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 28,
              fontWeight: 800,
            }}
          >
            A
          </div>
          Animal Facts for Kids
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
          <div style={{ fontSize: 74, lineHeight: 1.02, fontWeight: 800 }}>
            Wildlife facts, photos, and kid-friendly answers
          </div>
          <div style={{ fontSize: 30, lineHeight: 1.35, color: "#cbd5e1" }}>
            Animal pages built for search, classrooms, and curious readers.
          </div>
        </div>
        <div style={{ display: "flex", gap: "16px", fontSize: 24, color: "#fde68a" }}>
          <div>Habitats</div>
          <div>Diet</div>
          <div>Life Cycle</div>
          <div>Comparisons</div>
        </div>
      </div>
    ),
    size,
  );
}

