import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Services from './components/Services'
import Portfolio from './components/Portfolio'
import Pricing from './components/Pricing'
import About from './components/About'
import BookingForm from './components/BookingForm'
import ChatWidget from './components/ChatWidget'
import ProtectedRoute from './components/ProtectedRoute'

// New Admin Components
import AdminLogin from './components/admin/AdminLogin'
import AdminDashboard from './components/admin/AdminDashboard'
import AdminOverview from './components/admin/AdminOverview'
import AdminLeads from './components/admin/AdminLeads'
import AdminBookings from './components/admin/AdminBookings'
import AdminPricing from './components/admin/AdminPricing'
import AdminContent from './components/admin/AdminContent'
import AdminPortfolio from './components/admin/AdminPortfolio'

// Public Portfolio Components
import PortfolioGallery from './components/PortfolioGallery'
import ThreeSixtyViewer from './components/ThreeSixtyViewer'

function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <Hero />
        <Services />
        <Portfolio />
        <Pricing />
        <About />
        <BookingForm />
      </main>
      <footer className="bg-white border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="text-xl font-bold text-primary">ImmersiveEstates</div>
            <div className="text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} ImmersiveEstates. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
      <ChatWidget />
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        
        {/* Public Portfolio Routes */}
        <Route path="/portfolio" element={<><Navbar /><PortfolioGallery /></>} />
        <Route path="/portfolio/:id" element={<ThreeSixtyViewer />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLogin />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<AdminDashboard />}>
            <Route path="dashboard" element={<AdminOverview />} />
            <Route path="leads" element={<AdminLeads />} />
            <Route path="bookings" element={<AdminBookings />} />
            <Route path="pricing" element={<AdminPricing />} />
            <Route path="content" element={<AdminContent />} />
            <Route path="portfolio" element={<AdminPortfolio />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
