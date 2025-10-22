import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "WindBorne Balloon Constellation Tracker",
  description: "Real-time visualization of WindBorne Systems balloon constellation with weather overlay",
  keywords: ["windborne", "balloons", "weather", "tracking", "visualization"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
