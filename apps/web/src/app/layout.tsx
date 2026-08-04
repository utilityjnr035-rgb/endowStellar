import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'EndowStellar | Onchain Donor-Advised Funds on Stellar',
  description: 'Tax-deductible donor-advised funds (DAF), instant crypto giving, and transparent grantmaking on Stellar & Soroban.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="app-container">
          {children}
        </div>
      </body>
    </html>
  );
}
