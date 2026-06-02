import React from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Services from './components/Services'
import Pricing from './components/Pricing'
import About from './components/About'
import BookingForm from './components/BookingForm'
import ChatWidget from './components/ChatWidget'

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <Hero />
        <Services />
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

export default App
