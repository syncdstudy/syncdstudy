import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Providers from './providers';

const poppins = Poppins({ subsets: ['latin'], weight: ['400', '500', '600'] });

export const metadata: Metadata = {
  title: "Sync'd Study",
  description: 'Profiles, Projects, and Interests for the UH Community',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${poppins.className} wrapper`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
