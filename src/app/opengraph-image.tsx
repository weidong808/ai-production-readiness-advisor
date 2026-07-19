import { ImageResponse } from "next/og";
import { APP_NAME, APP_SERIES_LABEL, APP_TAGLINE } from "@/lib/brand";

export const runtime = "edge";
export const alt = `${APP_NAME} — ${APP_TAGLINE}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background:
            "radial-gradient(900px 500px at 10% -10%, rgba(61,154,139,0.25), transparent 55%), #0f1419",
          color: "#e8eef4",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            fontSize: 26,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "#3d9a8b",
            marginBottom: 28,
          }}
        >
          {APP_SERIES_LABEL}
        </div>
        <div
          style={{
            fontSize: 72,
            fontWeight: 600,
            lineHeight: 1.1,
            maxWidth: 900,
          }}
        >
          {APP_NAME}
        </div>
        <div
          style={{
            fontSize: 32,
            color: "#9aabbd",
            marginTop: 28,
            maxWidth: 860,
          }}
        >
          Eight scored dimensions · hard gates · advisory report
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginTop: 56,
            fontSize: 26,
            color: "#9aabbd",
          }}
        >
          weidong-shi.com · AI in Action
        </div>
      </div>
    ),
    { ...size },
  );
}
