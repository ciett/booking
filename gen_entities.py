import os

entity_dir = "c:/Users/dangn/Documents/de-an/demo/src/main/java/com/example/demo/entity"
repo_dir = "c:/Users/dangn/Documents/de-an/demo/src/main/java/com/example/demo/repository"

entities = {
    "Airport.java": """package com.example.demo.entity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "airports")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Airport {
    @Id @Column(length = 10)
    private String code;
    @Column(nullable = false)
    private String name;
    @Column(nullable = false)
    private String city;
    @Column(length = 100)
    private String country = "Vietnam";
}""",

    "CarLocation.java": """package com.example.demo.entity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "car_locations")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class CarLocation {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private String name;
    @Column(nullable = false)
    private String city;
}""",

    "Hotel.java": """package com.example.demo.entity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "hotels")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Hotel {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private String name;
    @Column(nullable = false)
    private String city;
    @Column(nullable = false, length = 500)
    private String address;
    @Column(columnDefinition = "TEXT")
    private String description;
    @Column(precision = 2, scale = 1)
    private java.math.BigDecimal rating;
}""",

    "Room.java": """package com.example.demo.entity;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "rooms")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Room {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hotel_id")
    private Hotel hotel;
    @Column(name = "room_type", nullable = false, length = 100)
    private String roomType;
    @Column(name = "price_per_night", nullable = false)
    private BigDecimal pricePerNight;
    @Column(name = "max_adults", columnDefinition = "INT DEFAULT 2")
    private Integer maxAdults;
    @Column(name = "max_children", columnDefinition = "INT DEFAULT 0")
    private Integer maxChildren;
}""",

    "Flight.java": """package com.example.demo.entity;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "flights")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Flight {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false, length = 100)
    private String airline;
    @Column(name = "flight_number", nullable = false, length = 50)
    private String flightNumber;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "departure_airport_code")
    private Airport departureAirport;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "arrival_airport_code")
    private Airport arrivalAirport;
    @Column(name = "departure_time", nullable = false)
    private LocalDateTime departureTime;
    @Column(name = "arrival_time", nullable = false)
    private LocalDateTime arrivalTime;
    @Column(nullable = false)
    private BigDecimal price;
}""",

    "Car.java": """package com.example.demo.entity;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "cars")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Car {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "company_name", nullable = false, length = 100)
    private String companyName;
    @Column(name = "car_model", nullable = false, length = 100)
    private String carModel;
    @Column(columnDefinition = "INT DEFAULT 4")
    private Integer seats;
    @Column(name = "price_per_day", nullable = false)
    private BigDecimal pricePerDay;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "location_id")
    private CarLocation location;
}""",

    "Attraction.java": """package com.example.demo.entity;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "attractions")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Attraction {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private String name;
    @Column(nullable = false)
    private String city;
    @Column(length = 50)
    private String category;
    @Column(nullable = false)
    private BigDecimal price;
}""",

    "AirportTaxi.java": """package com.example.demo.entity;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "airport_taxis")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AirportTaxi {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "airport_code")
    private Airport airport;
    @Column(name = "car_type", nullable = false, length = 50)
    private String carType;
    @Column(name = "base_price", nullable = false)
    private BigDecimal basePrice;
}""",

    "BookingType.java": """package com.example.demo.entity;
public enum BookingType {
    FLIGHT, HOTEL, CAR_RENTAL, ATTRACTION, TAXI, COMBO
}""",

    "BookingStatus.java": """package com.example.demo.entity;
public enum BookingStatus {
    PENDING, CONFIRMED, CANCELLED, COMPLETED
}""",

    "Booking.java": """package com.example.demo.entity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "bookings")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Booking {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    @Enumerated(EnumType.STRING)
    @Column(name = "booking_type", nullable = false)
    private BookingType bookingType;
    @Column(name = "total_price", nullable = false)
    private BigDecimal totalPrice;
    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "VARCHAR(20) DEFAULT 'PENDING'")
    private BookingStatus status = BookingStatus.PENDING;
    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}""",

    "HotelBooking.java": """package com.example.demo.entity;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "hotel_bookings")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class HotelBooking {
    @Id
    private Long bookingId;
    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "booking_id")
    private Booking booking;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id", nullable = false)
    private Room room;

    @Column(name = "check_in_date", nullable = false)
    private LocalDate checkInDate;
    @Column(name = "check_out_date", nullable = false)
    private LocalDate checkOutDate;
    @Column(columnDefinition = "INT DEFAULT 1")
    private Integer adults;
    @Column(columnDefinition = "INT DEFAULT 0")
    private Integer children;
    @Column(name = "rooms_count", columnDefinition = "INT DEFAULT 1")
    private Integer roomsCount;
}""",

    "FlightBooking.java": """package com.example.demo.entity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "flight_bookings")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class FlightBooking {
    @Id
    private Long bookingId;
    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "booking_id")
    private Booking booking;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "flight_id", nullable = false)
    private Flight flight;

    @Column(name = "seat_class", columnDefinition = "ENUM('ECONOMY', 'BUSINESS', 'FIRST_CLASS') DEFAULT 'ECONOMY'")
    private String seatClass;

    @Column(name = "is_roundtrip", columnDefinition = "BOOLEAN DEFAULT FALSE")
    private Boolean isRoundtrip;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "return_flight_id")
    private Flight returnFlight;

    @Column(name = "passengers_count", columnDefinition = "INT DEFAULT 1")
    private Integer passengersCount;
}""",

    "CarRentalBooking.java": """package com.example.demo.entity;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "car_rental_bookings")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class CarRentalBooking {
    @Id
    private Long bookingId;
    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "booking_id")
    private Booking booking;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "car_id", nullable = false)
    private Car car;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pickup_location_id", nullable = false)
    private CarLocation pickupLocation;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "dropoff_location_id", nullable = false)
    private CarLocation dropoffLocation;

    @Column(name = "pickup_datetime", nullable = false)
    private LocalDateTime pickupDatetime;
    @Column(name = "dropoff_datetime", nullable = false)
    private LocalDateTime dropoffDatetime;
}""",

    "AttractionBooking.java": """package com.example.demo.entity;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "attraction_bookings")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AttractionBooking {
    @Id
    private Long bookingId;
    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "booking_id")
    private Booking booking;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "attraction_id", nullable = false)
    private Attraction attraction;

    @Column(name = "visit_date", nullable = false)
    private LocalDate visitDate;

    @Column(name = "tickets_count", columnDefinition = "INT DEFAULT 1")
    private Integer ticketsCount;
}""",

    "TaxiBooking.java": """package com.example.demo.entity;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "taxi_bookings")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class TaxiBooking {
    @Id
    private Long bookingId;
    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "booking_id")
    private Booking booking;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "taxi_id", nullable = false)
    private AirportTaxi taxi;

    @Column(name = "pickup_datetime", nullable = false)
    private LocalDateTime pickupDatetime;

    @Column(name = "dropoff_address", nullable = false, length = 500)
    private String dropoffAddress;
}"""
}

# The user and UserRole entity stays mostly the same, let's just make sure they are correct.
# Skipping User.java and UserRole.java assuming they align fairly well with the db.sql. 
# Re-creating User.java just in case to be perfectly matched with db.sql (No UserRole natively in db.sql, but we kept it for Spring Security).

repos = {
    "AirportRepository.java": "Airport, String",
    "CarLocationRepository.java": "CarLocation, Long",
    "HotelRepository.java": "Hotel, Long",
    "RoomRepository.java": "Room, Long",
    "FlightRepository.java": "Flight, Long",
    "CarRepository.java": "Car, Long",
    "AttractionRepository.java": "Attraction, Long",
    "AirportTaxiRepository.java": "AirportTaxi, Long",
    "BookingRepository.java": "Booking, Long",
    "HotelBookingRepository.java": "HotelBooking, Long",
    "FlightBookingRepository.java": "FlightBooking, Long",
    "CarRentalBookingRepository.java": "CarRentalBooking, Long",
    "AttractionBookingRepository.java": "AttractionBooking, Long",
    "TaxiBookingRepository.java": "TaxiBooking, Long"
}

for filename, content in entities.items():
    with open(os.path.join(entity_dir, filename), "w") as f:
        f.write(content)

for filename, generic in repos.items():
    content = f"""package com.example.demo.repository;

import com.example.demo.entity.{generic.split(',')[0].strip()};
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface {filename.split('.')[0]} extends JpaRepository<{generic}> {{
}}
"""
    with open(os.path.join(repo_dir, filename), "w") as f:
        f.write(content)

print("Entities and Repositories generated successfully!")
