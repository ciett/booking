package com.example.demo.service;

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

    public List<Attraction> searchAttractions(String city, java.time.LocalDateTime startDate, java.time.LocalDateTime endDate) {
        return attractionRepository.findAll().stream()
                 .filter(a -> a.getCity().equalsIgnoreCase(city))
                 .collect(Collectors.toList());
    }
    
    public List<Attraction> getAllAttractions() {
        return attractionRepository.findAll();
    }

    public List<String> getDistinctCities() {
        return attractionRepository.findDistinctCities();
    }
}
