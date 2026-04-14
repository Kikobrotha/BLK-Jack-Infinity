import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Blackjack Assistant',
  description: 'Starter shell for a blackjack assistant built with Next.js App Router.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased">{children}</body>
    </html>
  );
}
