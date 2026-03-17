package com.example.demo.repository;

import com.example.demo.entity.AirportTaxi;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AirportTaxiRepository extends JpaRepository<AirportTaxi, Long> {
}
