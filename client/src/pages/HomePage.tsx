import { Outlet } from 'react-router-dom';
import { Footer } from '../components/Footer';
import { Header } from '../components/Header';
import { SideScrollCarousel } from '../components/Carousel';

export function HomePage() {
  const isMobile = window.innerWidth <= 768;
  return (
    <>
      <Header />
      {!isMobile ? (
        <img src="/landingpage1.png" className="w-full" />
      ) : (
        <img src="/mobilelanding2.png" className="w-full" />
      )}
      <SideScrollCarousel />
      <Footer />
      <Outlet />
    </>
  );
}
