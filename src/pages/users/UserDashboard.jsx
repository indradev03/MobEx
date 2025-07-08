import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Slideshow from '../../components/Slideshow';
import NewArrival from '../../components/NewArrivals';
import Premium from '../../components/PremiumProducts';
import Banner from '../../components/Banner';
import AboutSection from '../../components/AboutSection';
import WhyUsSection from '../../components/WhyusSection';

const UserDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userType = localStorage.getItem('userType');

    if (!token || userType !== 'user') {
      navigate('/'); // redirect to login if not user
    }
  }, [navigate]);

  return (
    <>
      <Slideshow />
      <NewArrival />
      <Premium />
      <Banner />
      <AboutSection />
      <WhyUsSection />
    </>
  );
};

export default UserDashboard;
