import "./globals.css";

export const metadata = {
  title: "RUVA Command Center",
  description: "Tu centro de mando personal",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
  themeColor: "#0A0E1A",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
