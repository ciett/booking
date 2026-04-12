package com.example.demo.controller;

import com.example.demo.entity.Car;
import com.example.demo.entity.CarLocation;
import com.example.demo.repository.CarLocationRepository;
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

    @Autowired
    private CarLocationRepository carLocationRepository;

    @GetMapping("/locations")
    public List<CarLocation> getAllLocations() {
        return carLocationRepository.findAll();
    }

    @GetMapping
    public List<Car> getAllCars() {
        return carService.getAllCars();
    }

    @GetMapping("/search")
    public List<Car> searchCars(
            @RequestParam String pickupCity,
            @RequestParam(required = false) String dropoffCity,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime pickupTime,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dropoffTime) {
        return carService.searchCars(pickupCity, dropoffCity, pickupTime, dropoffTime);
    }
}
