import React, { useEffect, useLayoutEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
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
import SitterSearch from './components/SitterSearch';
import UserDashboard from './components/UserDashboard';
import PetOwnerProfile from './components/PetOwnerProfile';
import InteractiveMap from './components/InteractiveMap';
import AdminDashboard from './components/AdminDashboard';
import PersonalizedRecommendations from './components/PersonalizedRecommendations';
import ProtectedRoute from './components/ProtectedRoute';
import SitterProfileForm from './pages/SitterProfileForm';
import VeterinaryChat from './components/VeterinaryChat';
import VeterinarySection from './components/VeterinarySection';
import PremiumMagazine from './components/PremiumMagazine';
import ServicesDirectory from './pages/ServicesDirectory';
import AIAssistantChat from './components/AIAssistantChat';
import AIMatchCenter2 from './components/matching/AIMatchCenter2';
import BrandExperience from './pages/BrandExperience';
import ConversionLanding from './pages/ConversionLanding';
import Home from './pages/Home';
import MatchCenter from './pages/MatchCenter';
import PetNeeds from './pages/PetNeeds';
import MascotShowcase from './pages/MascotShowcase';

import DatabaseTest from './components/DatabaseTest';

function ScrollToHashElement() {
  const location = useLocation();

  useLayoutEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      requestAnimationFrame(() => {
        const element = document.getElementById(id);
        if (element) {
          const offset = element.offsetTop - 100;
          window.scrollTo(0, offset);
        }
      });
    }
  }, [location]);

  return null;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <ScrollToHashElement />
        <Header />
        <AIAssistantChat />

        <Routes>
        {/* New Home Page */}
        <Route
          path="/"
          element={
            <>
              <Home />
              <Footer />
            </>
          }
        />

        {/* Original Home Page (now /old-home) */}
        <Route
          path="/old-home"
          element={
            <>
              <main>
                <Hero />
                <Services />
                <Booking />
                <VeterinarySection />
                <PremiumMagazine />
                <Testimonials />
                <Gallery />
                <Team />
                <Faq />
                <Contact />
              </main>
              <Footer />
            </>
          }
        />

        {/* Database Test Route */}
        <Route
          path="/database-test"
          element={
            <>
              <main>
                <DatabaseTest />
              </main>
            </>
          }
        />

        {/* Sitter Profile Form */}
        <Route
          path="/become-sitter"
          element={
            <ProtectedRoute>
              <>
                <main>
                  <SitterProfileForm />
                </main>
                <Footer />
              </>
            </ProtectedRoute>
          }
        />

        {/* Services Directory */}
        <Route
          path="/services"
          element={
            <>
              <main>
                <ServicesDirectory />
              </main>
              <Footer />
            </>
          }
        />

        {/* Sitters List with Service Filter */}
        <Route
          path="/sitters"
          element={
            <>
              <main>
                <SitterSearch />
              </main>
              <Footer />
            </>
          }
        />

        {/* Страница за търсене на гледачи */}
        <Route
          path="/search"
          element={
            <>
              <main>
                <SitterSearch />
              </main>
              <Footer />
            </>
          }
        />

        {/* AI Match Center 2.0 */}
        <Route
          path="/ai-match"
          element={
            <>
              <AIMatchCenter2 />
              <Footer />
            </>
          }
        />

        {/* Brand Experience */}
        <Route
          path="/brand"
          element={
            <>
              <BrandExperience />
              <Footer />
            </>
          }
        />

        {/* Conversion Landing */}
        <Route
          path="/start"
          element={
            <>
              <ConversionLanding />
              <Footer />
            </>
          }
        />

        {/* Match Center */}
        <Route
          path="/match"
          element={
            <>
              <MatchCenter />
              <Footer />
            </>
          }
        />

        {/* Pet Needs Intelligence */}
        <Route
          path="/pet-needs"
          element={
            <>
              <PetNeeds />
              <Footer />
            </>
          }
        />

        {/* Mascot Showcase */}
        <Route
          path="/mascots"
          element={
            <>
              <MascotShowcase />
              <Footer />
            </>
          }
        />

        {/* Потребителски профил */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <>
                <main>
                  <UserDashboard />
                </main>
                <Footer />
              </>
            </ProtectedRoute>
          }
        />

        {/* Профил на собственик на домашни любимци */}
        <Route
          path="/owner-profile"
          element={
            <>
              <main>
                <PetOwnerProfile userId="user1" />
              </main>
              <Footer />
            </>
          }
        />

        {/* Административен панел */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requireAdmin={true}>
              <>
                <main>
                  <AdminDashboard />
                </main>
              </>
            </ProtectedRoute>
          }
        />

        {/* Ветеринарен чат */}
        <Route
          path="/vet-chat"
          element={
            <ProtectedRoute>
              <>
                <main>
                  <VeterinaryChat />
                </main>
                <Footer />
              </>
            </ProtectedRoute>
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
    </AuthProvider>
  );
}

export default App;