/* eslint-disable import/extensions */
import NavBar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="wrapper">
          <NavBar />
          {children}
          <Footer />
        </div>
      </body>
    </html>
  );
}
