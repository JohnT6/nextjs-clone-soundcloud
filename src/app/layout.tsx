import ThemeRegistry from '@/components/theme-registry/theme.registry';
import AppHeader from "@/components/header/app.header";
import AppFooter from '@/components/footer/app.footer';
import NextAuthWrapper from './lib/next.auth.wrapper';




export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeRegistry>
          <NextAuthWrapper >
            <AppHeader />

            {children}
            <AppFooter />
          </NextAuthWrapper>
        </ThemeRegistry>
      </body>
    </html>
  );
}
