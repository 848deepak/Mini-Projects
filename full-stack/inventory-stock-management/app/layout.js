import "./globals.css";

export const metadata = {
  title: "Inventory & Stock Management",
  description: "Retail inventory management with low-stock alerts, stock movements, and Chart.js analytics",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js" defer></script>
      </head>
      <body>{children}</body>
    </html>
  );
}
