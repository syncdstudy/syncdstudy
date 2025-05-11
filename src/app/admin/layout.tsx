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
    <html lang="en" className="h-full">
      <body className={`${poppins.className} h-full m-0 p-0`}>
        <div className="admin-grid-layout">
          <header><AdminNavBar /></header>
          <main>{children}</main>
          <footer><Footer /></footer>
        </div>
      </body>
    </html>
  );
}
