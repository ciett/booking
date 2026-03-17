package com.example.demo.service;

import com.example.demo.entity.AirportTaxi;
import com.example.demo.repository.AirportTaxiRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AirportTaxiService {
    @Autowired
    private AirportTaxiRepository airportTaxiRepository;

    public List<AirportTaxi> searchTaxisByAirport(String airportCode) {
        return airportTaxiRepository.findAll().stream()
                 .filter(t -> t.getAirport() != null && t.getAirport().getCode().equalsIgnoreCase(airportCode))
                 .collect(Collectors.toList());
    }
    
    public List<AirportTaxi> getAllTaxis() {
        return airportTaxiRepository.findAll();
    }
}
