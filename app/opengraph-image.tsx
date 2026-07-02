import { ImageResponse } from "next/og";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  const bgBuffer = fs.readFileSync(path.join(process.cwd(), "public/brand/og-lion-bg.jpg"));
  const bgBase64 = `data:image/jpeg;base64,${bgBuffer.toString("base64")}`;

  const logoBuffer = fs.readFileSync(path.join(process.cwd(), "public/brand/logo-side-nobg.png"));
  const logoBase64 = `data:image/png;base64,${logoBuffer.toString("base64")}`;

  // Read highly stable static .woff fonts
  const playfairBuffer = fs.readFileSync(path.join(process.cwd(), "public/fonts/PlayfairDisplay-SemiBold.woff"));
  const interBuffer = fs.readFileSync(path.join(process.cwd(), "public/fonts/Inter-Regular.woff"));

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          color: "#fff",
        }}
      >
        {/* Background Image */}
        <img
          src={bgBase64}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
          alt="background"
        />
        
        {/* Elegant Dark Vignette Overlay */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(10, 15, 20, 0.65)",
          }}
        />

        {/* Content Container */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
            padding: "80px",
            position: "absolute",
            top: 0,
            left: 0,
            textAlign: "center",
          }}
        >
          {/* Logo */}
          <img
            src={logoBase64}
            width={120}
            height={120}
            style={{ marginBottom: "40px", filter: "drop-shadow(0px 10px 20px rgba(0,0,0,0.5))" }}
            alt="Logo"
          />

          {/* Main Title (Serif) */}
          <div
            style={{
              fontFamily: '"Playfair Display"',
              fontSize: 90,
              lineHeight: 1.1,
              fontWeight: 600,
              color: "#ffffff",
              textShadow: "0 4px 30px rgba(0,0,0,0.8)",
              marginBottom: "24px",
              letterSpacing: "-0.01em",
            }}
          >
            Wildlife Encyclopedia
          </div>

          {/* Elegant Subtitle (Sans-serif) */}
          <div
            style={{
              fontFamily: '"Inter"',
              fontSize: 32,
              fontWeight: 400,
              color: "#d1d5db",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              textShadow: "0 2px 10px rgba(0,0,0,0.8)",
            }}
          >
            Discover the Animal Kingdom
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Playfair Display",
          data: playfairBuffer,
          style: "normal",
          weight: 600,
        },
        {
          name: "Inter",
          data: interBuffer,
          style: "normal",
          weight: 400,
        },
      ],
    }
  );
}

