package com.example.demo.controller;

import com.example.demo.entity.DynamicPrice;
import com.example.demo.repository.DynamicPriceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/dynamic-prices")
@CrossOrigin(origins = "*")
public class DynamicPriceController {

    @Autowired
    private DynamicPriceRepository dynamicPriceRepository;

    @GetMapping
    public List<DynamicPrice> getAllRules() {
        return dynamicPriceRepository.findAll();
    }

    @PostMapping
    public DynamicPrice createRule(@RequestBody DynamicPrice dynamicPrice) {
        return dynamicPriceRepository.save(dynamicPrice);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteRule(@PathVariable Long id) {
        if (!dynamicPriceRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        dynamicPriceRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
