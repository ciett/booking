package com.example.demo.entity;
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
}