import { useLayoutEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

// Core components - load immediately (small and always needed)
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/common/ScrollToTop';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingSpinner from './components/common/LoadingSpinner';

// Lazy load all heavy components for better performance
const Hero = lazy(() => import('./components/Hero'));
const Services = lazy(() => import('./components/Services'));
const Testimonials = lazy(() => import('./components/Testimonials'));
const Gallery = lazy(() => import('./components/Gallery'));
const Booking = lazy(() => import('./components/Booking'));
const Faq = lazy(() => import('./components/Faq'));
const Contact = lazy(() => import('./components/Contact'));
const About = lazy(() => import('./About'));
const PrivacyPolicy = lazy(() => import('./PrivacyPolicy'));
const SitterSearch = lazy(() => import('./components/SitterSearch'));
const UserDashboard = lazy(() => import('./components/UserDashboard'));
const PetOwnerProfile = lazy(() => import('./components/PetOwnerProfile'));
const SitterProfileForm = lazy(() => import('./pages/SitterProfileForm'));
const VeterinaryChat = lazy(() => import('./components/VeterinaryChat'));
const VeterinarySection = lazy(() => import('./components/VeterinarySection'));
const PremiumMagazine = lazy(() => import('./components/PremiumMagazine'));
const ServicesDirectory = lazy(() => import('./pages/ServicesDirectory'));
const AIAssistantChat = lazy(() => import('./components/AIAssistantChat'));
const AIMatchCenter2 = lazy(() => import('./components/matching/AIMatchCenter2'));
const BrandExperience = lazy(() => import('./pages/BrandExperience'));
const ConversionLanding = lazy(() => import('./pages/ConversionLanding'));
const MatchCenter = lazy(() => import('./pages/MatchCenter'));
const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const VetChatWidget = lazy(() => import('./components/VetChatWidget'));
const AuthCallback = lazy(() => import('./pages/AuthCallback'));
const DatabaseTest = lazy(() => import('./components/DatabaseTest'));
const NotFound = lazy(() => import('./pages/NotFound'));

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
  const isMaintenanceMode = false;

  if (isMaintenanceMode) {
    return (
      <div className="min-h-screen bg-green-50 flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center border border-green-100">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
            <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Сайтът се обновява</h1>
          <p className="text-gray-600 text-lg leading-relaxed">
            В момента въвеждаме нов дизайн и подобряваме платформата. Ще бъдем отново на линия съвсем скоро!<br /><br />Благодарим ви за търпението. 🐾
          </p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <AuthProvider>

        <ScrollToTop />
        <ScrollToHashElement />
        <Header />

        {/* Lazy load chat widgets to improve performance */}
        <Suspense fallback={null}>
          <AIAssistantChat />
          <VetChatWidget />
        </Suspense>

        <Routes>
          {/* Начална страница */}
          <Route
            path="/"
            element={
              <>
                <Suspense fallback={<LoadingSpinner />}>
                  <main>
                    <Hero />
                    <Services />
                    <Booking />
                    <VeterinarySection />
                    <PremiumMagazine /> {/* Disabled - requires magazine system migration */}
                    <Testimonials />
                    <Gallery />
                    <MatchCenter />
                    <Faq />
                    <Contact />

                    {/* Бутон за политика за поверителност */}
                    <div className="text-center mt-12">
                      <a
                        href="/privacy"
                        className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
                      >
                        Политика за поверителност
                      </a>
                    </div>
                  </main>
                </Suspense>
                <Footer />
              </>
            }
          />

          {/* Database Test Route */}
          <Route
            path="/database-test"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <main>
                  <DatabaseTest />
                </main>
              </Suspense>
            }
          />

          {/* Sitter Profile Form */}
          <Route
            path="/become-sitter"
            element={
              <ProtectedRoute>
                <Suspense fallback={<LoadingSpinner />}>
                  <main>
                    <SitterProfileForm />
                  </main>
                  <Footer />
                </Suspense>
              </ProtectedRoute>
            }
          />

          {/* Services Directory */}
          <Route
            path="/services"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <main>
                  <ServicesDirectory />
                </main>
                <Footer />
              </Suspense>
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
              <Suspense fallback={<LoadingSpinner />}>
                <main>
                  <SitterSearch />
                </main>
                <Footer />
              </Suspense>
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

          {/* Потребителски профил */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Suspense fallback={<LoadingSpinner />}>
                  <main>
                    <UserDashboard />
                  </main>
                  <Footer />
                </Suspense>
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

          {/* Административен панел - Login */}
          <Route
            path="/admin/login"
            element={
              <>
                <main>
                  <AdminLogin />
                </main>
              </>
            }
          />

          {/* Административен панел - Dashboard */}
          <Route
            path="/admin/dashboard"
            element={
              <>
                <main>
                  <AdminDashboard />
                </main>
              </>
            }
          />

          {/* Административен панел - Old Route */}
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
                <Suspense fallback={<LoadingSpinner />}>
                  <main>
                    <VeterinaryChat />
                  </main>
                  <Footer />
                </Suspense>
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
              <Suspense fallback={<LoadingSpinner />}>
                <main>
                  <PrivacyPolicy />
                </main>
                <Footer />
              </Suspense>
            }
          />

          {/* OAuth Callback */}
          <Route
            path="/auth/callback"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <AuthCallback />
              </Suspense>
            }
          />

          {/* 404 Not Found Page */}
          <Route
            path="*"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <NotFound />
              </Suspense>
            }
          />
        </Routes>

      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;