import "./globals.css";

export const metadata = {
  title: "Online Examination System",
  description: "Timed online exam platform with automated grading and anti-cheat features",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
