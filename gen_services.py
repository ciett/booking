import os

service_dir = "c:/Users/dangn/Documents/de-an/demo/src/main/java/com/example/demo/service"
controller_dir = "c:/Users/dangn/Documents/de-an/demo/src/main/java/com/example/demo/controller"

services = {
    "FlightService.java": """package com.example.demo.service;

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
""",
    "CarService.java": """package com.example.demo.service;

import com.example.demo.entity.Car;
import com.example.demo.repository.CarRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CarService {
    @Autowired
    private CarRepository carRepository;

    public List<Car> searchCars(String pickupCity, LocalDateTime pickupTime, LocalDateTime dropoffTime) {
         return carRepository.findAll().stream()
                 .filter(c -> c.getLocation() != null && c.getLocation().getCity().equalsIgnoreCase(pickupCity))
                 .collect(Collectors.toList());
    }
    
    public List<Car> getAllCars() {
        return carRepository.findAll();
    }
}
""",
    "AttractionService.java": """package com.example.demo.service;

import com.example.demo.entity.Attraction;
import com.example.demo.repository.AttractionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AttractionService {
    @Autowired
    private AttractionRepository attractionRepository;

    public List<Attraction> searchAttractions(String city) {
        return attractionRepository.findAll().stream()
                 .filter(a -> a.getCity().equalsIgnoreCase(city))
                 .collect(Collectors.toList());
    }
    
    public List<Attraction> getAllAttractions() {
        return attractionRepository.findAll();
    }
}
""",
    "AirportTaxiService.java": """package com.example.demo.service;

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
"""
}

controllers = {
    "FlightController.java": """package com.example.demo.controller;

import com.example.demo.entity.Flight;
import com.example.demo.service.FlightService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/flights")
@CrossOrigin(origins = "*")
public class FlightController {

    @Autowired
    private FlightService flightService;

    @GetMapping
    public List<Flight> getAllFlights() {
        return flightService.getAllFlights();
    }

    @GetMapping("/search")
    public List<Flight> searchFlights(
            @RequestParam String departureCode,
            @RequestParam String arrivalCode,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime departureDate) {
        return flightService.searchFlights(departureCode, arrivalCode, departureDate);
    }
}
""",
    "CarController.java": """package com.example.demo.controller;

import com.example.demo.entity.Car;
import com.example.demo.service.CarService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/cars")
@CrossOrigin(origins = "*")
public class CarController {

    @Autowired
    private CarService carService;

    @GetMapping
    public List<Car> getAllCars() {
        return carService.getAllCars();
    }

    @GetMapping("/search")
    public List<Car> searchCars(
            @RequestParam String pickupCity,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime pickupTime,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dropoffTime) {
        return carService.searchCars(pickupCity, pickupTime, dropoffTime);
    }
}
""",
    "AttractionController.java": """package com.example.demo.controller;

import com.example.demo.entity.Attraction;
import com.example.demo.service.AttractionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/attractions")
@CrossOrigin(origins = "*")
public class AttractionController {

    @Autowired
    private AttractionService attractionService;

    @GetMapping
    public List<Attraction> getAllAttractions() {
        return attractionService.getAllAttractions();
    }

    @GetMapping("/search")
    public List<Attraction> searchAttractions(@RequestParam String city) {
        return attractionService.searchAttractions(city);
    }
}
""",
    "AirportTaxiController.java": """package com.example.demo.controller;

import com.example.demo.entity.AirportTaxi;
import com.example.demo.service.AirportTaxiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/airport-taxis")
@CrossOrigin(origins = "*")
public class AirportTaxiController {

    @Autowired
    private AirportTaxiService airportTaxiService;

    @GetMapping
    public List<AirportTaxi> getAllTaxis() {
        return airportTaxiService.getAllTaxis();
    }

    @GetMapping("/search")
    public List<AirportTaxi> searchTaxis(@RequestParam String airportCode) {
        return airportTaxiService.searchTaxisByAirport(airportCode);
    }
}
"""
}

for filename, content in services.items():
    with open(os.path.join(service_dir, filename), "w") as f:
        f.write(content)

for filename, content in controllers.items():
    with open(os.path.join(controller_dir, filename), "w") as f:
        f.write(content)

print("Services and Controllers generated successfully!")
