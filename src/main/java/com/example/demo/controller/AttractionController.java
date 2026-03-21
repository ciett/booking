package com.example.demo.controller;

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
    public List<Attraction> searchAttractions(
            @RequestParam String city,
            @RequestParam(required = false) @org.springframework.format.annotation.DateTimeFormat(iso = org.springframework.format.annotation.DateTimeFormat.ISO.DATE_TIME) java.time.LocalDateTime startDate,
            @RequestParam(required = false) @org.springframework.format.annotation.DateTimeFormat(iso = org.springframework.format.annotation.DateTimeFormat.ISO.DATE_TIME) java.time.LocalDateTime endDate) {
        return attractionService.searchAttractions(city, startDate, endDate);
    }

    @GetMapping("/cities")
    public List<String> getDistinctCities() {
        return attractionService.getDistinctCities();
    }
}
