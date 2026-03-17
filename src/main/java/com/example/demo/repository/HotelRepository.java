package com.example.demo.repository;

import com.example.demo.entity.Hotel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.time.LocalDate;

@Repository
public interface HotelRepository extends JpaRepository<Hotel, Long> {
    List<Hotel> findByCityContainingIgnoreCase(String city);

    @org.springframework.data.jpa.repository.Query("SELECT DISTINCT h.city FROM Hotel h WHERE h.city IS NOT NULL")
    List<String> findDistinctCities();

    @org.springframework.data.jpa.repository.Query("SELECT DISTINCT h FROM Hotel h " +
            "JOIN Room r ON h.id = r.hotel.id " +
            "WHERE LOWER(h.city) LIKE LOWER(CONCAT('%', :city, '%')) " +
            "AND r.id NOT IN (" +
            "    SELECT hb.room.id FROM HotelBooking hb " +
            "    WHERE hb.checkInDate < :checkOut " +
            "    AND hb.checkOutDate > :checkIn" +
            ")")
    List<Hotel> findAvailableHotels(
            @org.springframework.data.repository.query.Param("city") String city,
            @org.springframework.data.repository.query.Param("checkIn") LocalDate checkIn,
            @org.springframework.data.repository.query.Param("checkOut") LocalDate checkOut);
}
