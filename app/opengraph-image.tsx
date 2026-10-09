import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt = "Totthobox — information, tools and everyday digital services";
export const size = { width: 1200, height: 630 };
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
          padding: "64px 76px",
          boxSizing: "border-box",
          background:
            "radial-gradient(circle at 88% 18%, rgba(103,232,249,0.22), transparent 28%), linear-gradient(125deg, #071a2f 0%, #0f766e 57%, #155e75 100%)",
          color: "#ffffff",
          fontFamily: "Arial, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            right: "-86px",
            bottom: "-200px",
            width: "520px",
            height: "520px",
            borderRadius: "260px",
            border: "2px solid rgba(255,255,255,0.14)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: "36px",
            bottom: "-106px",
            width: "340px",
            height: "340px",
            borderRadius: "170px",
            border: "2px solid rgba(255,255,255,0.18)",
            display: "flex",
          }}
        />
        <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
          <div
            style={{
              width: "62px",
              height: "62px",
              borderRadius: "18px",
              background: "#ffffff",
              color: "#0f766e",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "34px",
              fontWeight: 900,
              letterSpacing: "-2px",
            }}
          >
            tb
          </div>
          <div
            style={{
              display: "flex",
              fontSize: "28px",
              fontWeight: 800,
              letterSpacing: "3px",
            }}
          >
            TOTTHOBOX
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "22px",
            maxWidth: "900px",
            position: "relative",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              color: "#fde68a",
              fontSize: "19px",
              fontWeight: 700,
              letterSpacing: "4px",
            }}
          >
            INFORMATION · TOOLS · SERVICES
          </div>
          <div
            style={{
              display: "flex",
              fontSize: "66px",
              lineHeight: 1.08,
              fontWeight: 800,
              letterSpacing: "-2px",
            }}
          >
            Everything you need,
          </div>
          <div
            style={{
              display: "flex",
              fontSize: "66px",
              lineHeight: 1.08,
              fontWeight: 800,
              letterSpacing: "-2px",
              color: "#99f6e4",
            }}
          >
            in one place.
          </div>
          <div
            style={{
              display: "flex",
              fontSize: "27px",
              color: "#e2e8f0",
              marginTop: "4px",
            }}
          >
            Knowledge, calculators, converters and more.
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "5px",
              background: "#fbbf24",
              display: "flex",
            }}
          />
          <div style={{ display: "flex", fontSize: "20px", color: "#ccfbf1" }}>
            totthobox.com
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
