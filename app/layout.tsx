import '@/app/ui/global.css'; 
import { inter } from '@/app/ui/fonts';
import { Metadata } from 'next';
import { getBaseUrl } from '@/app/lib/utils';

const getMetadataBase = () => {
  const baseUrl = process.env.NEXTAUTH_URL || getBaseUrl();
  
  // Ensure the URL has a protocol
  if (baseUrl.startsWith('http://') || baseUrl.startsWith('https://')) {
    return new URL(baseUrl);
  }
  return new URL(`https://${baseUrl}`);
};

export const metadata: Metadata = {
  title: {
    template: '%s | Grace Dashboard',
    default: 'Grace Dashboard',
  },
  description: 'Invoice management dashboard built with Next.js and PostgreSQL.',
  metadataBase: getMetadataBase(),
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
