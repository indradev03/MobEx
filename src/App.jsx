import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Headers from './components/Headers';
import Slideshow from './components/Slideshow';
import Brands from './pages/Brands';
import Exchange from './pages/Exchange';
import SpecialOffers from './pages/SpecialOffers';
import About from './pages/About';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';
import Login from './pages/Login';
import Signup from './pages/Signup';
import NewArrival from './components/NewArrivals';
import './App.css';
import Premium from './components/PremiumProducts';
import Banner from './components/Banner';
import AboutSection from './components/AboutSection';
import WhyUsSection from './components/WhyusSection';
import QuickLinksSection from './components/QuickLinksFooters';
import FooterBottom from './components/Footer';
import ProductDetails from './pages/ProductDetails';
import ForgotPassword from './pages/ForgotPassword';
import Apple from './pages/brands/Apple';
import UserDashboard from './pages/users/UserDashboard';
import Profile from './pages/users/Profile';

import AdminDashboard from './pages/admin/pages/AdminDashboard';

// Home section (used on "/")
const Home = () => (
  <>
    <Slideshow />
    <NewArrival />
    <Premium />
    <Banner />
    <AboutSection />
    <WhyUsSection />
  </>
);

function App() {
  return (
    <Router>
      <Routes>
        {/* Admin route without header/footer */}
          <Route path="/admindashboard/*" element={<AdminDashboard />} />


        {/* All other routes with normal header/footer */}
        <Route
          path="/*"
          element={
            <>
              <Headers />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/brands" element={<Brands />} />
                <Route path="/exchange" element={<Exchange />} />
                <Route path="/special-offers" element={<SpecialOffers />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/productdetails" element={<ProductDetails />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/userdashboard" element={<UserDashboard />} />
                <Route path="/brands/apple" element={<Apple />} />
              </Routes>
              <QuickLinksSection />
              <FooterBottom />
            </>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
