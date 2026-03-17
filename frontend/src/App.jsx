import React from 'react';
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

function AppContent() {
  const location = useLocation();
  // Don't show Navbar/Footer on Auth pages
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <div className="flex flex-col min-h-screen">
      {!isAuthPage && <Navbar />}

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
      </Routes>

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
