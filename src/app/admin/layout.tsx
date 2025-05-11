/* eslint-disable import/extensions */
import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import AdminNavBar from '@/components/AdminNavBar';
import Footer from '@/components/Footer';

const poppins = Poppins({ subsets: ['latin'], weight: ['400', '500', '600'] });

export const metadata: Metadata = {
  title: 'Admin | Sync’d Study',
  description: 'Admin Dashboard for Sync’d Study',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${poppins.className} min-h-screen flex flex-col`}>
        <AdminNavBar />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
