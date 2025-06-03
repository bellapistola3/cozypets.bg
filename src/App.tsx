import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
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
import About from './About';
import PrivacyPolicy from './PrivacyPolicy';

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Header />

      <Routes>
        {/* Начална страница */}
        <Route
          path="/"
          element={
            <>
              <main>
                <Hero />
                <Services />
                <Testimonials />
                <Gallery />
                <Team />
                <Booking />
                <Faq />
                <Contact />

                {/* Бутон за политика за поверителност */}
                <div className="text-center mt-12">
                  <a
                    href="/privacy"
                    className="inline-block bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg shadow-md transition duration-300"
                  >
                    Политика за поверителност
                  </a>
                </div>
              </main>
              <Footer />
            </>
          }
        />

        {/* Страница „За нас" */}
        <Route
          path="/about"
          element={
            <>
              <main>
                <About />
              </main>
              <Footer />
            </>
          }
        />

        {/* Страница „Политика за поверителност" */}
        <Route
          path="/privacy"
          element={
            <>
              <main>
                <PrivacyPolicy />
              </main>
              <Footer />
            </>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

