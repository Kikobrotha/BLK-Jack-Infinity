import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Blackjack Decision Assistant',
  description: 'Mode-aware blackjack assistant for Regular and Infinity blackjack strategy guidance.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
