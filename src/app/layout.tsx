import type { Metadata } from "next";
import "../../styles/global.css";

export const metadata: Metadata = {
  title: "CleanBreath",
  description: "A project to guide people to smoke properly and help non-smokers avoid smoking areas.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
      
      

      </head>
      <body>{children}</body>
    </html>
  );
}
