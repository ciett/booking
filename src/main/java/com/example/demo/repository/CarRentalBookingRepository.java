package com.example.demo.repository;

import com.example.demo.entity.CarRentalBooking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CarRentalBookingRepository extends JpaRepository<CarRentalBooking, Long> {
}
