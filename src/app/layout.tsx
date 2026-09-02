import React from 'react';
import type { Metadata } from 'next';
import './globals.css';
import { Provider } from '@/components/ui/provider';
import { Toaster } from '@/components/ui/toaster';
import HeaderBar from '@/components/HeaderBar';
import SiteFooter from '@/components/SiteFooter';
import { I18nProvider } from '@/i18n';

export const metadata: Metadata = {
  title: 'Xteink Flash Tools',
  description: 'Web based tool to help flash the Xteink device',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Provider>
          <I18nProvider>
            <HeaderBar />
            <main className="app-shell">{children}</main>
            <SiteFooter />
            <Toaster />
          </I18nProvider>
        </Provider>
      </body>
    </html>
  );
}
