import type { Metadata } from 'next';
import { Poppins } from 'next/font/google'; // Change to Poppins
import './globals.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Footer from '@/components/Footer';
import NavBar from '@/components/Navbar';
import Providers from './providers';

const poppins = Poppins({ subsets: ['latin'], weight: ['400', '500', '600'] }); // Use Poppins

export const metadata: Metadata = {
  title: "Sync'd Study",
  description: 'Profiles, Projects, and Interests for the UH Community',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const classString = `${poppins.className} wrapper`; // Apply Poppins font
  return (
    <html lang="en">
      <body className={classString}>
        <Providers>
          <NavBar />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
