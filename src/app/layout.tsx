import ThemeRegistry from '@/components/theme-registry/theme.registry';
import AppHeader from "@/components/header/app.header";



export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeRegistry>
          <AppHeader />

          {children}
        </ThemeRegistry>
      </body>
    </html>
  );
}
