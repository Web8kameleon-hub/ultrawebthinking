export const metadata = { title: "EuroWeb" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "system-ui, -apple-system, Segoe UI, Roboto", margin: 0 }}>
        {children}
      </body>
    </html>
  );
}
