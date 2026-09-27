import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FrameFlow — Creative workspace",
  description: "Plan shoots, collect references, and move creative projects from idea to delivery.",
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
