package com.example.demo.repository;

import com.example.demo.entity.CarLocation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CarLocationRepository extends JpaRepository<CarLocation, Long> {
}
