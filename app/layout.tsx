import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://lyindyin999.github.io/frameflow/"),
  title: "FrameFlow — Creative workspace",
  description:
    "Plan shoots, collect references, and move creative projects from idea to delivery.",
  applicationName: "FrameFlow",
  openGraph: {
    title: "FrameFlow — Creative workspace",
    description:
      "A visual workspace for creators to plan shoots, references and post-production.",
    url: "https://lyindyin999.github.io/frameflow/",
    siteName: "FrameFlow",
    images: [
      {
        url: "/frameflow/og.svg",
        width: 1200,
        height: 630,
        alt: "FrameFlow creative workspace",
      },
    ],
    type: "website",
  },
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
