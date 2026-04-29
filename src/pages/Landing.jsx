import React, { useState } from 'react';
import Navbar from '../components/Navbar.jsx';
import Hero from '../components/landing/Hero.jsx';
import Problem from '../components/landing/Problem.jsx';
import Solution from '../components/landing/Solution.jsx';
import Ecosystem from '../components/landing/Ecosystem.jsx';
import Pricing from '../components/landing/Pricing.jsx';
import Testimonial from '../components/landing/Testimonial.jsx';
import AboutUs from '../components/landing/AboutUs.jsx';
import WaitlistCTA from '../components/landing/WaitlistCTA.jsx';
import Footer from '../components/Footer.jsx';
import RegisterModal from '../components/modals/RegisterModal.jsx';
import PartnerModal from '../components/modals/PartnerModal.jsx';

const Landing = () => {
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isPartnerOpen, setIsPartnerOpen] = useState(false);

  const openRegister = (plan = null) => {
    setSelectedPlan(plan);
    setIsRegisterOpen(true);
  };

  React.useEffect(() => {
    // Fallback routing untuk link non-hash (misal dari email lama)
    const path = window.location.pathname;
    if (path === '/partner-agreement') {
      const search = window.location.search;
      window.location.replace(`/#/partner-agreement${search}`);
    }
  }, []);

  return (
    <div className="bg-black min-h-screen text-white font-['Inter',sans-serif] selection:bg-orange-500/30 selection:text-orange-200">
      {/* Background Elements */}
      <div className="fixed inset-0 -z-10 h-[100vh] w-full bg-black bg-[linear-gradient(to_right,#27272a_1px,transparent_1px),linear-gradient(to_bottom,#27272a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none"></div>
      <div className="fixed top-[-10%] left-[-10%] -z-10 w-[40%] h-[40%] rounded-full bg-orange-600/20 blur-[100px] pointer-events-none"></div>
      <div className="fixed top-[-10%] right-[-10%] -z-10 w-[40%] h-[40%] rounded-full bg-amber-500/10 blur-[100px] pointer-events-none"></div>

      <Navbar 
        onOpenPartner={() => setIsPartnerOpen(true)} 
        onOpenWaitlist={() => openRegister()} 
      />
      
      {/* === SECTION 1: Hero / Above the Fold === */}
      <main>
        <Hero />

        {/* === SECTION 2: The Problem === */}
        <Problem />

        {/* === SECTION 3: The Solution === */}
        <Solution />

        {/* === SECTION 4: Our Ecosystem === */}
        <Ecosystem />

        {/* === SECTION 5: Pricing (Coming Soon) === */}
        <Pricing onOpenWaitlist={(plan) => openRegister(plan)} />

        {/* === SECTION 6: Social Proof / Testimonials === */}
        <Testimonial />

        {/* === SECTION 7: About Us === */}
        <AboutUs />

        {/* === SECTION 8: Final CTA === */}
        <WaitlistCTA onOpenWaitlist={() => openRegister()} />
      </main>

      <Footer />

      <RegisterModal isOpen={isRegisterOpen} onClose={() => setIsRegisterOpen(false)} selectedPlan={selectedPlan} />
      <PartnerModal isOpen={isPartnerOpen} onClose={() => setIsPartnerOpen(false)} />
    </div>
  );
};

export default Landing;
