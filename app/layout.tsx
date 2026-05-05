import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL('https://programme-feedback.aipowered.xyz'),
  title: 'ai powered, case study',
  description: 'End of cohort feedback and case study capture for ai powered.',
  robots: { index: false, follow: false },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-ink text-bone antialiased">{children}</body>
    </html>
  );
}
