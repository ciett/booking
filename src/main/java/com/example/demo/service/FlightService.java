package com.example.demo.service;

import com.example.demo.entity.Flight;
import com.example.demo.repository.FlightRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class FlightService {
    @Autowired
    private FlightRepository flightRepository;

    public List<Flight> searchFlights(String departureCode, String arrivalCode, LocalDateTime departureDate) {
        // Implement logic for advanced searching if needed.
        return flightRepository.findAll().stream()
                .filter(f -> f.getDepartureAirport() != null && f.getDepartureAirport().getCode().equalsIgnoreCase(departureCode))
                .filter(f -> f.getArrivalAirport() != null && f.getArrivalAirport().getCode().equalsIgnoreCase(arrivalCode))
                .filter(f -> f.getDepartureTime().toLocalDate().isEqual(departureDate.toLocalDate()))
                .collect(Collectors.toList());
    }

    public List<Flight> getAllFlights() {
        return flightRepository.findAll();
    }
}
