package com.example.demo.service;

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
