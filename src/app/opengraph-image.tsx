import { ImageResponse } from "next/og"

export const alt = "Ready Set Go Tours & Travel — Luxury Kenya & Tanzania Safaris"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"
export const dynamic = "force-dynamic"

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(130deg, #04170d 0%, #0b4f34 52%, #0a2c4e 100%)",
          color: "#ffffff",
          padding: "64px 72px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Setting sun */}
        <div
          style={{
            position: "absolute",
            top: "-150px",
            right: "-140px",
            width: "520px",
            height: "520px",
            borderRadius: "50%",
            background: "linear-gradient(180deg, #fbbf24 0%, #f59e0b 45%, #d97706 100%)",
            opacity: 0.9,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "-40px",
            right: "-40px",
            width: "300px",
            height: "300px",
            borderRadius: "50%",
            background: "#fcd34d",
          }}
        />

        {/* Savanna hills */}
        <div
          style={{
            position: "absolute",
            bottom: "-260px",
            left: "-160px",
            width: "900px",
            height: "520px",
            borderRadius: "50%",
            background: "#06301f",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-260px",
            left: "420px",
            width: "1000px",
            height: "560px",
            borderRadius: "50%",
            background: "#052315",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "0px",
            left: "0px",
            width: "100%",
            height: "120px",
            background: "linear-gradient(180deg, rgba(4,35,22,0) 0%, #04170d 100%)",
          }}
        />

        {/* Top row: brand */}
        <div style={{ display: "flex", alignItems: "center", gap: "18px", position: "relative" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "64px",
              height: "64px",
              borderRadius: "20px",
              background: "linear-gradient(135deg, #0ea5e9, #10b981)",
              fontSize: "26px",
              fontWeight: 900,
            }}
          >
            RSG
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: "30px", fontWeight: 900, letterSpacing: "-0.5px" }}>
              Ready Set Go Tours &amp; Travel
            </div>
            <div style={{ fontSize: "18px", color: "#a7f3d0", marginTop: "2px" }}>
              Nairobi, Kenya · East Africa
            </div>
          </div>
        </div>

        {/* Middle: headline */}
        <div style={{ display: "flex", flexDirection: "column", position: "relative", maxWidth: "760px" }}>
          <div
            style={{
              fontSize: "64px",
              fontWeight: 900,
              lineHeight: 1.08,
              letterSpacing: "-1.5px",
            }}
          >
            Luxury Kenya &amp; Tanzania Safaris
          </div>
          <div style={{ fontSize: "24px", color: "#e2e8f0", marginTop: "18px", lineHeight: 1.4 }}>
            Bespoke private &amp; group safaris · Beach holidays · Mountaineering
          </div>
        </div>

        {/* Bottom row: proof + contact */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "relative",
            borderTop: "2px solid rgba(255,255,255,0.15)",
            paddingTop: "24px",
          }}
        >
          <div style={{ display: "flex", gap: "14px" }}>
            {["200+ Happy Travelers", "4.9★ Rated", "24/7 Support"].map((chip) => (
              <div
                key={chip}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "10px 18px",
                  borderRadius: "999px",
                  background: "rgba(255,255,255,0.10)",
                  border: "1px solid rgba(255,255,255,0.22)",
                  fontSize: "18px",
                  fontWeight: 700,
                }}
              >
                {chip}
              </div>
            ))}
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", fontSize: "18px", color: "#d1fae5", fontWeight: 700 }}>
            <div>readysetgosafaris.com</div>
            <div style={{ color: "#9bdcbf", fontWeight: 400 }}>Private &amp; group safaris from $650/person</div>
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}