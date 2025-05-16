import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Services from './components/Services';
import Testimonials from './components/Testimonials';
import Gallery from './components/Gallery';
import Team from './components/Team';
import Booking from './components/Booking';
import Faq from './components/Faq';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ScrollToTop from './components/common/ScrollToTop';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <ScrollToTop />
      <Header />
      <main>
        <Hero />
        <Services />
        <Testimonials />
        <Gallery />
        <Team />
        <Booking />
        <Faq />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

export default App;