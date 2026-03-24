import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Flights from "./pages/Flights";
import FlightAndHotel from "./pages/FlightAndHotel";
import CarRental from "./pages/CarRental";
import Attractions from "./pages/Attractions";
import AirportTaxis from "./pages/AirportTaxis";
import ListProperty from './pages/ListProperty';
import Careers from './pages/Careers';
import CustomerService from './pages/CustomerService';
import BecomePartner from './pages/BecomePartner';
import Business from './pages/Business';
import Account from './pages/Account';

function AppContent() {
  const location = useLocation();
  const { pathname } = location;

  // Tự động cuộn lên đầu trang mỗi khi chuyển trang (Chuyển vào đây)
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // Kiểm tra nếu là trang Auth thì ẩn Navbar/Footer
  const isAuthPage = pathname === '/login' || pathname === '/register';

  return (
    <div className="flex flex-col min-h-screen">
      {!isAuthPage && <Navbar />}

      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/flights" element={<Flights />} />
          <Route path="/flight-hotel" element={<FlightAndHotel />} />
          <Route path="/car-rentals" element={<CarRental />} />
          <Route path="/attractions" element={<Attractions />} />
          <Route path="/airport-taxis" element={<AirportTaxis />} />
          <Route path="/list-your-property" element={<ListProperty />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/customer-service" element={<CustomerService />} />
          <Route path="/become-partner" element={<BecomePartner />} />
          <Route path="/business" element={<Business />} />
          <Route path="/account" element={<Account />} />
        </Routes>
      </main>

      {!isAuthPage && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;