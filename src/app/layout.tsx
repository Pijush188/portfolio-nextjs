import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Pijush Das - Portfolio",
  description: "Enthusiastic IT graduate passionate about exploring the dynamic world of technology. Web Developer, Software Developer, UI/UX Designer",
  keywords: ["Pijush Das", "Portfolio", "Web Developer", "Software Developer", "UI/UX Designer", "IT Graduate"],
  authors: [{ name: "Pijush Das" }],
  creator: "Pijush Das",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/image/P-icon.png" type="image/png" />
      </head>
      <body className={`${poppins.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
