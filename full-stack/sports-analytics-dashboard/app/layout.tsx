import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "SportsData — Advanced Analytics",
  description: "Next-gen sports analytics dashboard.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen antialiased bg-slate-950 text-slate-100`}>
        {children}
      </body>
    </html>
  );
}
