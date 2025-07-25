import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Headers from './components/Headers';
import Slideshow from './components/Slideshow';
import Brands from './pages/brands/Brands';
// import ExchangePage from './pages/users/ExchangePage';
import SpecialOffers from './pages/SpecialOffers';
import About from './pages/About';
import FAQ from './pages/FAQ';
import TermsAndConditions from './pages/TermsAndConditions';
import CustomerSupport from './pages/CustomerSupport';
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
import UserDashboard from './pages/users/UserDashboard';
import Profile from './pages/users/Profile';
import BrandProductsPage from './pages/brands/BrandProductsPage';
import AdminDashboard from './pages/admin/pages/AdminDashboard';
import ProductDetailsPage from "./pages/product/ProductDetailsPage";
import FavouritesPage from './pages/users/FavouritesPage';
import CartPage from './pages/users/CartPage';
import UserBooking from './pages/users/UserBooking';
import OrderHistoryPage from './pages/users/OrderHistoryPage';
import ResetPassword from './pages/ResetPassword';


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
                  <Route path="/brands/:brandId" element={<BrandProductsPage />} />
                  <Route path="/productdetails" element={<ProductDetailsPage />} />

                {/* <Route path="/exchange" element={<ExchangePage />} /> */}
                <Route path="/special-offers" element={<SpecialOffers />} />
                <Route path="/about" element={<About />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/terms" element={<TermsAndConditions />} />
                <Route path="/support" element={<CustomerSupport />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password/:token" element={<ResetPassword />} />

                <Route path="/productdetails" element={<ProductDetails />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/userdashboard" element={<UserDashboard />} />
                <Route path="/favourites" element={<FavouritesPage />} /> 
                <Route path="/cart" element={<CartPage />} /> 
                <Route path="/userbooking" element={<UserBooking />} />
              <Route path="/order-history" element={<OrderHistoryPage />} />

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
